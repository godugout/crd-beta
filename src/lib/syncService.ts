
import { getOfflineItems, removeOfflineItem, getPendingUploadItems, removePendingUpload } from './offlineStorage';
import { toast } from 'sonner';

/**
 * Types of sync strategies for different data types
 */
export type SyncStrategy = 'overwrite' | 'merge' | 'append';

export interface SyncOptions {
  /**
   * Whether to notify the user of sync progress
   */
  notify?: boolean;
  
  /**
   * Maximum number of items to sync in a single batch
   */
  batchSize?: number;
  
  /**
   * Whether to continue syncing if an error occurs
   */
  continueOnError?: boolean;
  
  /**
   * How to handle conflicts
   */
  conflictStrategy?: SyncStrategy;
  
  /**
   * Callback for sync progress
   */
  progressCallback?: (current: number, total: number) => void;
}

interface SyncItem {
  id: string;
  endpoint: string;
  method: string;
  payload: any;
  createdAt: string;
  syncPriority?: number;
}

/**
 * Responsible for synchronizing offline data to the server
 */
export class SyncService {
  private isRunning = false;
  private abortController: AbortController | null = null;
  
  /**
   * Sync all offline data to the server
   */
  async syncAll(options: SyncOptions = {}): Promise<number> {
    if (this.isRunning) {
      console.log('Sync already in progress');
      return 0;
    }
    
    try {
      this.isRunning = true;
      this.abortController = new AbortController();
      
      if (options.notify) {
        toast.loading('Syncing offline data...');
      }
      
      // Get all offline items
      const items = await getOfflineItems();
      const uploads = await getPendingUploadItems();
      
      const totalItems = items.length + uploads.length;
      if (totalItems === 0) {
        if (options.notify) {
          toast.dismiss();
          toast.info('No offline data to sync');
        }
        return 0;
      }
      
      let syncedCount = 0;
      
      // Sync data items
      if (items.length > 0) {
        syncedCount += await this.syncDataItems(items, options);
      }
      
      // Sync file uploads
      if (uploads.length > 0) {
        syncedCount += await this.syncFileUploads(uploads, options);
      }
      
      if (options.notify) {
        toast.dismiss();
        if (syncedCount > 0) {
          toast.success(`Successfully synced ${syncedCount} items`);
        } else {
          toast.error('Failed to sync offline data');
        }
      }
      
      return syncedCount;
    } catch (error) {
      console.error('Error during sync:', error);
      if (options.notify) {
        toast.dismiss();
        toast.error('Sync failed');
      }
      return 0;
    } finally {
      this.isRunning = false;
      this.abortController = null;
    }
  }
  
  /**
   * Cancel an ongoing sync operation
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.isRunning = false;
      toast.info('Sync cancelled');
    }
  }
  
  /**
   * Sync offline data items
   */
  private async syncDataItems(
    items: any[],
    options: SyncOptions
  ): Promise<number> {
    let syncedCount = 0;
    const batchSize = options.batchSize || 10;
    
    // Sort by priority if available
    const sortedItems = items.sort((a, b) => 
      (b.syncPriority || 0) - (a.syncPriority || 0)
    );
    
    // Process in batches
    for (let i = 0; i < sortedItems.length; i += batchSize) {
      const batch = sortedItems.slice(i, i + batchSize);
      
      for (const item of batch) {
        try {
          // In a real app, this would make an API call
          console.log('Syncing item:', item.id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Remove from offline storage after successful sync
          await removeOfflineItem(item.id);
          syncedCount++;
          
          // Update progress
          if (options.progressCallback) {
            options.progressCallback(syncedCount, items.length);
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          if (!options.continueOnError) {
            throw error;
          }
        }
        
        // Check if sync was cancelled
        if (this.abortController?.signal.aborted) {
          return syncedCount;
        }
      }
    }
    
    return syncedCount;
  }
  
  /**
   * Sync pending file uploads
   */
  private async syncFileUploads(
    uploads: any[],
    options: SyncOptions
  ): Promise<number> {
    let syncedCount = 0;
    
    for (const upload of uploads) {
      try {
        // In a real app, this would upload the file to storage
        console.log('Uploading file:', upload.id);
        
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from offline storage
        await removePendingUpload(upload.id);
        syncedCount++;
        
        // Update progress
        if (options.progressCallback) {
          options.progressCallback(syncedCount, uploads.length);
        }
      } catch (error) {
        console.error(`Failed to upload file ${upload.id}:`, error);
        
        if (!options.continueOnError) {
          throw error;
        }
      }
      
      // Check if sync was cancelled
      if (this.abortController?.signal.aborted) {
        return syncedCount;
      }
    }
    
    return syncedCount;
  }
}

// Create and export a singleton instance
export const syncService = new SyncService();

// Helper functions for common sync operations
export const syncAllData = async (options: SyncOptions = {}): Promise<number> => {
  return syncService.syncAll(options);
};

export const cancelSync = (): void => {
  syncService.cancel();
};

export default syncService;
