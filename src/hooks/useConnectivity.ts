
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getOfflineItems, 
  saveOfflineItem, 
  removeOfflineItem, 
  OfflineItem,
  getPendingItemCount
} from '@/lib/offlineStorage';

export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

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
      toast.success('You are back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline - memories will be saved locally', {
        duration: 5000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
  const syncOfflineItems = async () => {
    if (!isOnline || offlineItems.length === 0) return 0;
    
    setIsSyncing(true);
    let syncCount = 0;
    
    try {
      // Clone the current items to prevent mutation during processing
      const itemsToSync = [...offlineItems];
      
      for (const item of itemsToSync) {
        try {
          // In a real implementation, this would call an API to upload the item
          console.log(`Syncing item: ${item.id}`);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // If successful, remove from offline storage
          await removeOfflineItemAndUpdate(item.id);
          syncCount++;
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }
      
      return syncCount;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    offlineItems,
    pendingCount,
    saveOfflineItem: saveOfflineItemAndUpdate,
    removeOfflineItem: removeOfflineItemAndUpdate,
    syncOfflineItems
  };
};
