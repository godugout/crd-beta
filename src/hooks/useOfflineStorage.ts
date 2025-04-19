
import { useState, useCallback } from 'react';
import { useConnectivity } from './useConnectivity';
import { 
  saveOfflineItem, 
  getOfflineItems,
  removeOfflineItem,
  OfflineItem
} from '@/lib/offlineStorage';
import { v4 as uuidv4 } from 'uuid';

// Define missing function
const storeFileAsDataUrl = async (key: string, file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // In a real implementation, we would store this in IndexedDB or localStorage
      console.log(`Stored file ${key} as data URL`);
      resolve(dataUrl);
    };
    reader.onerror = () => {
      reject(new Error("Failed to convert file to data URL"));
    };
    reader.readAsDataURL(file);
  });
};

export interface UseOfflineStorageOptions {
  onSyncComplete?: (results: { success: boolean, syncedCount: number }) => void;
  autoSync?: boolean;
  collectionName?: string;
}

export function useOfflineStorage(options: UseOfflineStorageOptions = {}) {
  const [isStoring, setIsStoring] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { isOnline } = useConnectivity();
  
  // Fetch pending count
  const fetchPendingCount = useCallback(async () => {
    try {
      const items = await getOfflineItems();
      const count = items.filter(item => item.syncStatus === 'pending').length;
      setPendingCount(count);
      return count;
    } catch (error) {
      console.error('Error fetching pending count:', error);
      return 0;
    }
  }, []);
  
  // Store an item offline
  const storeOffline = async (type: string, data: any, priority = 1) => {
    setIsStoring(true);
    try {
      const timestamp = Date.now();
      
      // Add necessary properties for OfflineItem
      const itemToStore = {
        type,
        data,
        syncStatus: 'pending',
        collectionName: options.collectionName,
        createdAt: timestamp,
        syncPriority: priority,
        retryCount: 0
      };
      
      const id = await saveOfflineItem(itemToStore);
      
      await fetchPendingCount();
      
      return { success: true, id };
    } catch (error) {
      console.error('Error storing offline data:', error);
      return { success: false, error };
    } finally {
      setIsStoring(false);
    }
  };
  
  // Store file as data URL and add to offline storage
  const storeFileOffline = async (file: File, metadata: Record<string, any> = {}) => {
    setIsStoring(true);
    try {
      const fileId = uuidv4();
      const dataUrl = await storeFileAsDataUrl(fileId, file);
      
      const fileData = {
        fileId,
        dataUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        metadata
      };
      
      // Store file data in offline storage
      // Add necessary properties for OfflineItem
      const storageData = {
        type: 'file',
        data: fileData,
        syncStatus: 'pending',
        collectionName: options.collectionName || 'files',
        createdAt: Date.now(),
        syncPriority: 2, // Higher priority for files
        retryCount: 0
      };
      
      const id = await saveOfflineItem(storageData);
      
      await fetchPendingCount();
      
      return { success: true, id, dataUrl };
    } catch (error) {
      console.error('Error storing file offline:', error);
      return { success: false, error };
    } finally {
      setIsStoring(false);
    }
  };
  
  // Sync a single item
  const syncItem = async (item: OfflineItem) => {
    // This would be implemented to actually sync with a server
    console.log('Syncing item:', item);
    
    // Mock successful sync
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove the item from offline storage after successful sync
    await removeOfflineItem(item.id);
    
    return true;
  };
  
  // Sync all items
  const syncAll = async () => {
    if (!isOnline) {
      return { success: false, error: 'Offline', syncedCount: 0 };
    }
    
    try {
      const items = await getOfflineItems();
      const pendingItems = items.filter(item => item.syncStatus === 'pending');
      
      if (pendingItems.length === 0) {
        return { success: true, syncedCount: 0 };
      }
      
      let syncedCount = 0;
      
      // Sort by priority and timestamp
      const sortedItems = pendingItems.sort((a, b) => {
        // First by priority (if available)
        if (a.syncPriority && b.syncPriority && a.syncPriority !== b.syncPriority) {
          return a.syncPriority - b.syncPriority;
        }
        
        // Then by timestamp or createdAt
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.timestamp;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.timestamp;
        return aTime - bTime;
      });
      
      // Process in batches to avoid overwhelming the network
      const batchSize = 5;
      for (let i = 0; i < sortedItems.length; i += batchSize) {
        const batch = sortedItems.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (item) => {
          try {
            const success = await syncItem(item);
            if (success) {
              syncedCount++;
            }
          } catch (error) {
            console.error(`Error syncing item ${item.id}:`, error);
          }
        }));
      }
      
      await fetchPendingCount();
      
      if (options.onSyncComplete) {
        options.onSyncComplete({ 
          success: syncedCount > 0, 
          syncedCount 
        });
      }
      
      return { success: true, syncedCount };
    } catch (error) {
      console.error('Error syncing all items:', error);
      return { success: false, error, syncedCount: 0 };
    }
  };
  
  // Get all offline items of a specific type
  const getOfflineItemsByType = async (type: string) => {
    const items = await getOfflineItems();
    return items.filter(item => 
      item.type === type && 
      (options.collectionName ? item.collectionName === options.collectionName : true)
    );
  };

  return {
    storeOffline,
    storeFileOffline,
    syncAll,
    isStoring,
    pendingCount,
    fetchPendingCount,
    getOfflineItemsByType
  };
}
