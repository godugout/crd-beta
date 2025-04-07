
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface OfflineItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  tags?: string[];
  template?: string;
  location?: string;
  section?: string;
  metadata?: Record<string, any>;
}

export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load any stored offline items on mount
  useEffect(() => {
    const storedItems = localStorage.getItem('offlineItems');
    if (storedItems) {
      try {
        setOfflineItems(JSON.parse(storedItems));
      } catch (e) {
        console.error('Failed to parse stored offline items');
      }
    }
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

  // Save offline items whenever the list changes
  useEffect(() => {
    localStorage.setItem('offlineItems', JSON.stringify(offlineItems));
  }, [offlineItems]);

  // Add an item to offline storage
  const saveOfflineItem = (item: OfflineItem) => {
    setOfflineItems(prev => [...prev, item]);
    return item.id; // Return the ID for reference
  };

  // Remove an item from offline storage
  const removeOfflineItem = (itemId: string) => {
    setOfflineItems(prev => prev.filter(item => item.id !== itemId));
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
          removeOfflineItem(item.id);
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
    saveOfflineItem,
    removeOfflineItem,
    syncOfflineItems
  };
};
