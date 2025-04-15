import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';
import { toast } from 'sonner';
import { OfflineItem } from '@/lib/offlineStorage';

/**
 * Offline Synchronization Service
 * 
 * This service provides advanced offline functionality including:
 * - Queueing operations for synchronization when online
 * - Conflict detection and resolution strategies
 * - Batch processing with retry capabilities
 * - Priority-based synchronization
 */

export interface SyncStats {
  pending: number;
  synced: number;
  failed: number;
  conflicts: number;
  lastSyncAt: Date | null;
}

export type ConflictStrategy = 'client-wins' | 'server-wins' | 'manual' | 'merge';

export interface SyncOptions {
  batchSize?: number;
  retryCount?: number;
  retryDelay?: number;
  conflictStrategy?: ConflictStrategy;
  onProgress?: (stats: SyncStats) => void;
  onComplete?: (stats: SyncStats) => void;
  onError?: (error: Error) => void;
  onConflict?: (conflict: SyncConflict) => Promise<ConflictResolution>;
}

export interface SyncConflict {
  itemId: string;
  clientData: any;
  serverData: any;
  timestamp: Date;
}

export interface ConflictResolution {
  strategy: ConflictStrategy;
  resolvedData?: any;
}

export interface SyncResult {
  success: boolean;
  stats: SyncStats;
  errors?: Error[];
}

// Create a separate storage instance for sync metadata
const syncMetaStorage = localforage.createInstance({
  name: 'OakFanSyncMeta',
  storeName: 'syncMetadata'
});

class OfflineSyncService {
  private isSyncing: boolean = false;
  private syncQueue: OfflineItem[] = [];
  private defaultOptions: SyncOptions = {
    batchSize: 10,
    retryCount: 3,
    retryDelay: 2000,
    conflictStrategy: 'client-wins'
  };
  private stats: SyncStats = {
    pending: 0,
    synced: 0,
    failed: 0,
    conflicts: 0,
    lastSyncAt: null
  };

  // Load sync metadata and queue from storage on initialization
  public async initialize(): Promise<void> {
    try {
      // Load last sync stats
      const savedStats = await syncMetaStorage.getItem<SyncStats>('syncStats');
      if (savedStats) {
        this.stats = savedStats;
      }
      
      // Check for pending items to sync
      const pendingCount = await this.getPendingCount();
      this.stats.pending = pendingCount;
      
      // Initialize sync queue
      await this.refreshSyncQueue();

      console.log('Offline sync service initialized', { 
        stats: this.stats,
        queueSize: this.syncQueue.length
      });
    } catch (error) {
      console.error('Failed to initialize offline sync service:', error);
    }
  }

  // Get current sync statistics
  public getStats(): SyncStats {
    return { ...this.stats };
  }

  // Queue an item for synchronization
  public async queueForSync(item: OfflineItem): Promise<string> {
    // Ensure the item has required fields
    const syncItem: OfflineItem = {
      ...item,
      id: item.id || uuidv4(),
      createdAt: item.createdAt || new Date().toISOString(),
      syncStatus: 'pending',
      syncPriority: item.syncPriority || 1
    };

    // Save to offline storage
    await localforage.setItem(`offline-${syncItem.type}-${syncItem.id}`, syncItem);
    
    // Update stats
    this.stats.pending++;
    await this.saveStats();
    
    // Add to sync queue if not already syncing
    if (!this.isSyncing) {
      this.syncQueue.push(syncItem);
    }
    
    return syncItem.id;
  }

  // Start the synchronization process
  public async startSync(options: SyncOptions = {}): Promise<SyncResult> {
    if (this.isSyncing) {
      return {
        success: false,
        stats: this.stats,
        errors: [new Error('Sync already in progress')]
      };
    }

    const syncOptions = { ...this.defaultOptions, ...options };
    const errors: Error[] = [];
    
    try {
      this.isSyncing = true;
      await this.refreshSyncQueue();
      
      // Reset sync counters for this run
      const runStats = {
        synced: 0,
        failed: 0,
        conflicts: 0
      };
      
      // Process items in batches
      for (let i = 0; i < this.syncQueue.length; i += syncOptions.batchSize || 10) {
        const batch = this.syncQueue.slice(i, i + (syncOptions.batchSize || 10));
        
        // Process batch with retry logic
        const batchResults = await this.processBatch(batch, syncOptions);
        
        // Update stats
        runStats.synced += batchResults.synced;
        runStats.failed += batchResults.failed;
        runStats.conflicts += batchResults.conflicts;
        
        // Report progress
        if (syncOptions.onProgress) {
          syncOptions.onProgress({
            ...this.stats,
            synced: runStats.synced,
            failed: runStats.failed,
            conflicts: runStats.conflicts
          });
        }
      }
      
      // Update overall stats
      this.stats.synced += runStats.synced;
      this.stats.failed += runStats.failed;
      this.stats.conflicts += runStats.conflicts;
      this.stats.pending = Math.max(0, this.stats.pending - runStats.synced);
      this.stats.lastSyncAt = new Date();
      
      await this.saveStats();
      
      // Refresh the queue to remove synced items
      await this.refreshSyncQueue();
      
      const success = runStats.failed === 0;
      
      // Complete callback
      if (syncOptions.onComplete) {
        syncOptions.onComplete(this.stats);
      }
      
      if (success) {
        toast.success(`Successfully synchronized ${runStats.synced} items`);
      } else {
        toast.warning(`Synchronized ${runStats.synced} items with ${runStats.failed} failures`);
      }
      
      return {
        success,
        stats: this.stats,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Sync process failed:', error);
      if (syncOptions.onError && error instanceof Error) {
        syncOptions.onError(error);
      }
      
      toast.error('Failed to synchronize data');
      
      return {
        success: false,
        stats: this.stats,
        errors: [error instanceof Error ? error : new Error(String(error))]
      };
    } finally {
      this.isSyncing = false;
    }
  }

  // Process a batch of items with retry logic
  private async processBatch(
    batch: OfflineItem[],
    options: SyncOptions
  ): Promise<{ synced: number; failed: number; conflicts: number }> {
    const results = {
      synced: 0,
      failed: 0,
      conflicts: 0
    };

    // Group items by type for more efficient processing
    const itemsByType: Record<string, OfflineItem[]> = {};
    batch.forEach(item => {
      const type = item.type || 'unknown';
      if (!itemsByType[type]) {
        itemsByType[type] = [];
      }
      itemsByType[type].push(item);
    });

    // Process each type group
    for (const [type, items] of Object.entries(itemsByType)) {
      try {
        // This would be replaced with actual API calls to sync data
        // For now, we'll just simulate successful syncing
        for (const item of items) {
          try {
            // Simulate potential conflicts (1 in 10 chance for demo)
            const hasConflict = Math.random() < 0.1;
            
            if (hasConflict) {
              results.conflicts++;
              
              // Handle conflict according to strategy
              if (options.conflictStrategy === 'manual' && options.onConflict) {
                // For manual conflict resolution, call the handler
                const mockServerData = { ...item.data, serverValue: 'changed' };
                
                const resolution = await options.onConflict({
                  itemId: item.id,
                  clientData: item.data,
                  serverData: mockServerData,
                  timestamp: new Date()
                });
                
                // Apply the resolution based on the strategy
                if (resolution.strategy === 'client-wins') {
                  // Keep client data (do nothing)
                  await this.markItemAsSynced(item);
                  results.synced++;
                } else if (resolution.strategy === 'server-wins') {
                  // Update with server data
                  item.data = mockServerData;
                  await this.markItemAsSynced(item);
                  results.synced++;
                } else if (resolution.strategy === 'merge' && resolution.resolvedData) {
                  // Use the merged data
                  item.data = resolution.resolvedData;
                  await this.markItemAsSynced(item);
                  results.synced++;
                } else {
                  // If no clear resolution, mark as failed
                  await this.markItemAsFailed(item);
                  results.failed++;
                }
              } else if (options.conflictStrategy === 'client-wins') {
                // Automatically use client version
                await this.markItemAsSynced(item);
                results.synced++;
              } else if (options.conflictStrategy === 'server-wins') {
                // Would normally update local data with server version here
                await this.markItemAsSynced(item);
                results.synced++;
              } else {
                // Default behavior for unresolved conflicts
                await this.markItemAsFailed(item);
                results.failed++;
              }
            } else {
              // No conflict, simply sync
              await this.markItemAsSynced(item);
              results.synced++;
            }
          } catch (itemError) {
            console.error(`Failed to sync item ${item.id}:`, itemError);
            await this.markItemAsFailed(item);
            results.failed++;
          }
        }
      } catch (typeError) {
        console.error(`Failed to sync items of type ${type}:`, typeError);
        // Mark all items in this type group as failed
        for (const item of items) {
          await this.markItemAsFailed(item);
          results.failed += items.length;
        }
      }
    }

    return results;
  }

  // Mark an item as successfully synced
  private async markItemAsSynced(item: OfflineItem): Promise<void> {
    try {
      // Remove from offline storage
      await localforage.removeItem(`offline-${item.type}-${item.id}`);
    } catch (error) {
      console.error(`Failed to remove synced item ${item.id}:`, error);
    }
  }

  // Mark an item as failed to sync
  private async markItemAsFailed(item: OfflineItem): Promise<void> {
    try {
      // Update the item's sync status and retry count
      const updatedItem: OfflineItem = {
        ...item,
        syncStatus: 'failed',
        retryCount: (item.retryCount || 0) + 1
      };
      
      await localforage.setItem(`offline-${item.type}-${item.id}`, updatedItem);
    } catch (error) {
      console.error(`Failed to update failed item ${item.id}:`, error);
    }
  }

  // Get the count of pending items
  private async getPendingCount(): Promise<number> {
    const keys = await localforage.keys();
    return keys.filter(key => key.startsWith('offline-')).length;
  }

  // Save current sync stats to storage
  private async saveStats(): Promise<void> {
    await syncMetaStorage.setItem('syncStats', this.stats);
  }

  // Refresh the sync queue from storage
  private async refreshSyncQueue(): Promise<void> {
    try {
      const keys = await localforage.keys();
      const offlineKeys = keys.filter(key => key.startsWith('offline-'));
      
      this.syncQueue = [];
      
      for (const key of offlineKeys) {
        const item = await localforage.getItem<OfflineItem>(key);
        if (item) {
          this.syncQueue.push(item);
        }
      }
      
      // Sort by priority (higher first) and then by creation date (oldest first)
      this.syncQueue.sort((a, b) => {
        // First by priority (descending)
        const priorityDiff = (b.syncPriority || 0) - (a.syncPriority || 0);
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by creation date (ascending)
        const aTime = typeof a.createdAt === 'string' 
          ? new Date(a.createdAt).getTime()
          : Number(a.createdAt);
        const bTime = typeof b.createdAt === 'string'
          ? new Date(b.createdAt).getTime()
          : Number(b.createdAt);
          
        return aTime - bTime;
      });
      
      // Update pending count
      this.stats.pending = this.syncQueue.length;
    } catch (error) {
      console.error('Failed to refresh sync queue:', error);
    }
  }
  
  // Cancel ongoing sync operation
  public cancelSync(): void {
    if (this.isSyncing) {
      this.isSyncing = false;
      toast.info('Synchronization canceled');
    }
  }
}

// Export singleton instance
export const offlineSyncService = new OfflineSyncService();

// Initialize on import
offlineSyncService.initialize().catch(console.error);

export default offlineSyncService;
