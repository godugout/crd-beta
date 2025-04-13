
import { useState, useEffect, useCallback } from 'react';
import offlineSyncService, { 
  SyncStats, 
  SyncOptions, 
  SyncResult,
  ConflictResolution 
} from '@/lib/offline/offlineSyncService';
import { useConnectivity } from '@/hooks/useConnectivity';
import { toast } from 'sonner';

export interface UseOfflineSyncOptions {
  autoSync?: boolean;
  autoSyncInterval?: number; // in milliseconds
  conflictStrategy?: 'client-wins' | 'server-wins' | 'manual' | 'merge';
  onAutoSyncComplete?: (result: SyncResult) => void;
}

/**
 * React hook for managing offline data synchronization
 * 
 * Features:
 * - Monitor sync status and statistics
 * - Trigger manual sync operations
 * - Configure automatic background syncing
 * - Handle conflict resolution
 */
export function useOfflineSync(options: UseOfflineSyncOptions = {}) {
  const { 
    autoSync = true,
    autoSyncInterval = 60000, // Default to 1 minute
    conflictStrategy = 'client-wins',
    onAutoSyncComplete
  } = options;
  
  const { isOnline } = useConnectivity();
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState<SyncStats>(offlineSyncService.getStats());
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  
  // Handle manual conflict resolution
  const [conflicts, setConflicts] = useState<{ [itemId: string]: any }>({});
  
  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      setStats(offlineSyncService.getStats());
    };
    
    // Update stats immediately
    updateStats();
    
    // Set up interval for periodic updates
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Auto sync effect
  useEffect(() => {
    let syncInterval: ReturnType<typeof setInterval> | null = null;
    
    const performAutoSync = async () => {
      if (isOnline && !isSyncing && stats.pending > 0) {
        try {
          const result = await syncOfflineData({
            showToasts: false
          });
          
          if (onAutoSyncComplete) {
            onAutoSyncComplete(result);
          }
        } catch (error) {
          console.error('Auto sync failed:', error);
        }
      }
    };
    
    if (autoSync) {
      // Initial sync when coming online
      if (isOnline && stats.pending > 0) {
        performAutoSync();
      }
      
      // Set up interval for periodic sync attempts
      syncInterval = setInterval(performAutoSync, autoSyncInterval);
    }
    
    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [isOnline, isSyncing, stats.pending, autoSync, autoSyncInterval, onAutoSyncComplete]);
  
  // Function to handle conflict resolution
  const resolveConflict = useCallback((itemId: string, resolution: ConflictResolution): void => {
    setConflicts(prev => {
      const newConflicts = { ...prev };
      delete newConflicts[itemId];
      return newConflicts;
    });
  }, []);
  
  // Main function to trigger synchronization
  const syncOfflineData = useCallback(async (
    customOptions: Partial<SyncOptions & { showToasts?: boolean }> = {}
  ): Promise<SyncResult> => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return {
        success: false,
        stats: offlineSyncService.getStats(),
        errors: [new Error('Device is offline')]
      };
    }
    
    if (isSyncing) {
      toast.info('Sync already in progress');
      return {
        success: false,
        stats: offlineSyncService.getStats(),
        errors: [new Error('Sync already in progress')]
      };
    }
    
    const { showToasts = true, ...syncOptions } = customOptions;
    
    try {
      setIsSyncing(true);
      
      if (showToasts) {
        toast.info(`Starting sync of ${stats.pending} items...`);
      }
      
      const result = await offlineSyncService.startSync({
        conflictStrategy,
        onProgress: (progressStats) => {
          setStats({ ...progressStats });
        },
        onConflict: async (conflict) => {
          if (conflictStrategy === 'manual') {
            // Store conflict for UI resolution
            setConflicts(prev => ({
              ...prev,
              [conflict.itemId]: conflict
            }));
            
            // This would normally wait for user input
            // For demo purposes, we'll just use client data after a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return { strategy: 'client-wins' };
          }
          
          // Default handling based on selected strategy
          return { strategy: conflictStrategy };
        },
        ...syncOptions
      });
      
      setLastResult(result);
      setStats(offlineSyncService.getStats());
      
      return result;
    } catch (error) {
      console.error('Sync operation failed:', error);
      
      if (showToasts) {
        toast.error('Sync failed. Please try again later.');
      }
      
      const errorResult: SyncResult = {
        success: false,
        stats: offlineSyncService.getStats(),
        errors: [error instanceof Error ? error : new Error(String(error))]
      };
      
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, stats.pending, conflictStrategy]);
  
  // Function to cancel ongoing sync
  const cancelSync = useCallback(() => {
    offlineSyncService.cancelSync();
    setIsSyncing(false);
  }, []);

  return {
    // State
    stats,
    isSyncing,
    isOnline,
    lastResult,
    conflicts,
    
    // Actions
    syncOfflineData,
    cancelSync,
    resolveConflict
  };
}

export default useOfflineSync;
