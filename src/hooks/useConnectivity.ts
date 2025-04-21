
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  getOfflineItems, 
  saveOfflineItem, 
  removeOfflineItem, 
  OfflineItem,
  getPendingItemCount
} from '@/lib/offlineStorage';
import { syncAllData, cancelSync, SyncOptions } from '@/lib/syncService';

export interface ConnectivityOptions {
  autoSync?: boolean;
  notifySyncEvents?: boolean;
  syncOnConnect?: boolean;
}

export const useConnectivity = (options: ConnectivityOptions = {}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  
  const {
    autoSync = true,
    notifySyncEvents = true,
    syncOnConnect = true
  } = options;

  // Load any stored offline items on mount
  useEffect(() => {
    const loadOfflineItems = async () => {
      try {
        const items = await getOfflineItems();
        setOfflineItems(items);
        
        const count = await getPendingItemCount();
        setPendingCount(count);
      } catch (e) {
        console.error('Failed to load stored offline items:', e);
      }
    };
    
    loadOfflineItems();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      if (notifySyncEvents) {
        toast.success('You are back online');
      }
      
      // Automatically sync when coming back online
      if (syncOnConnect) {
        syncOfflineItems();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      
      if (notifySyncEvents) {
        toast.error('You are offline - data will be saved locally', {
          duration: 5000
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [notifySyncEvents, syncOnConnect]);

  // Add an item to offline storage
  const saveOfflineItemAndUpdate = async (item: OfflineItem) => {
    const id = await saveOfflineItem(item);
    const updatedItems = await getOfflineItems();
    setOfflineItems(updatedItems);
    
    const count = await getPendingItemCount();
    setPendingCount(count);
    
    return id;
  };

  // Remove an item from offline storage
  const removeOfflineItemAndUpdate = async (itemId: string) => {
    await removeOfflineItem(itemId);
    const updatedItems = await getOfflineItems();
    setOfflineItems(updatedItems);
    
    const count = await getPendingItemCount();
    setPendingCount(count);
  };

  // Sync offline items when back online
  const syncOfflineItems = useCallback(async (syncOptions: SyncOptions = {}) => {
    if (!isOnline || isSyncing || pendingCount === 0) return 0;
    
    setIsSyncing(true);
    
    try {
      // Use the syncService to perform the sync
      const syncCount = await syncAllData({
        notify: notifySyncEvents,
        continueOnError: true,
        ...syncOptions
      });
      
      if (syncCount > 0) {
        // Refresh the offline items list
        const items = await getOfflineItems();
        setOfflineItems(items);
        
        // Update the pending count
        const count = await getPendingItemCount();
        setPendingCount(count);
        
        // Update last sync date
        setLastSyncDate(new Date());
      }
      
      return syncCount;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, pendingCount, notifySyncEvents]);
  
  // Cancel an ongoing sync
  const cancelSyncOperation = useCallback(() => {
    cancelSync();
    setIsSyncing(false);
  }, []);

  return {
    isOnline,
    isSyncing,
    offlineItems,
    pendingCount,
    lastSyncDate,
    saveOfflineItem: saveOfflineItemAndUpdate,
    removeOfflineItem: removeOfflineItemAndUpdate,
    syncOfflineItems,
    cancelSync: cancelSyncOperation
  };
};

export default useConnectivity;
