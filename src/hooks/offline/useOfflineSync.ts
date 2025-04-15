
import { useState, useCallback } from 'react';
import { useConnectivity } from '../useConnectivity';
import { getOfflineItems, removeOfflineItem } from '@/lib/offlineStorage';

interface SyncOptions {
  onSyncComplete?: (results: { success: boolean; syncedCount: number }) => void;
}

export function useOfflineSync(options?: SyncOptions) {
  const { isOnline, syncOfflineItems } = useConnectivity();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ success: boolean; syncedCount: number } | null>(null);

  const syncData = useCallback(async () => {
    if (!isOnline || isSyncing) return null;
    
    setIsSyncing(true);
    try {
      const result = await syncOfflineItems();
      const syncResult = { 
        success: true, 
        syncedCount: result
      };
      
      setLastSyncResult(syncResult);
      
      if (options?.onSyncComplete) {
        options.onSyncComplete(syncResult);
      }
      
      return syncResult;
    } catch (error) {
      console.error('Error syncing offline data:', error);
      const errorResult = { 
        success: false, 
        syncedCount: 0 
      };
      
      setLastSyncResult(errorResult);
      
      if (options?.onSyncComplete) {
        options.onSyncComplete(errorResult);
      }
      
      return errorResult;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, syncOfflineItems, options]);

  const getOfflineData = useCallback(async (collectionName?: string) => {
    const items = await getOfflineItems();
    if (collectionName) {
      return items.filter(item => item.collectionName === collectionName);
    }
    return items;
  }, []);

  const deleteOfflineItem = useCallback(async (id: string) => {
    await removeOfflineItem(id);
  }, []);

  return {
    isSyncing,
    lastSyncResult,
    syncData,
    getOfflineData,
    deleteOfflineItem
  };
}
