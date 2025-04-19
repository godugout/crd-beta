
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface OfflineItem {
  id: string;
  timestamp: number;
  type: string;
  data: any;
  syncStatus: SyncStatus;
  collectionName: string;
  createdAt: number;
  syncPriority: number;
  retryCount: number;
}

// Function to save and retrieve data from IndexedDB
const createOfflineStorage = () => {
  // Placeholder implementation - would use IndexedDB in real code
  const storage: Record<string, OfflineItem> = {};

  return {
    storeItem: async (item: Omit<OfflineItem, "id" | "timestamp">): Promise<{ success: boolean; id?: string; error?: any }> => {
      try {
        const id = uuidv4();
        const timestamp = Date.now();
        storage[id] = { ...item, id, timestamp };
        return { success: true, id };
      } catch (error) {
        return { success: false, error };
      }
    },

    getItem: async (id: string): Promise<OfflineItem | null> => {
      return storage[id] || null;
    },

    getAllItems: async (): Promise<OfflineItem[]> => {
      return Object.values(storage);
    },
    
    getItemsByType: async (type: string): Promise<OfflineItem[]> => {
      return Object.values(storage).filter(item => item.type === type);
    },

    removeItem: async (id: string): Promise<boolean> => {
      if (storage[id]) {
        delete storage[id];
        return true;
      }
      return false;
    },

    updateItem: async (id: string, updates: Partial<OfflineItem>): Promise<boolean> => {
      if (storage[id]) {
        storage[id] = { ...storage[id], ...updates };
        return true;
      }
      return false;
    }
  };
};

export const useOfflineStorage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const offlineStorage = createOfflineStorage();

  useEffect(() => {
    const init = async () => {
      try {
        const items = await offlineStorage.getAllItems();
        setOfflineItems(items);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize offline storage:', error);
      }
    };
    init();
  }, []);

  const storeOffline = async (type: string, data: any, priority: number = 1) => {
    try {
      const result = await offlineStorage.storeItem({
        type,
        data,
        syncStatus: 'pending' as SyncStatus,
        collectionName: type,
        createdAt: Date.now(),
        syncPriority: priority,
        retryCount: 0
      });
      
      if (result.success && result.id) {
        setOfflineItems(prev => [...prev, {
          id: result.id as string,
          timestamp: Date.now(),
          type,
          data,
          syncStatus: 'pending' as SyncStatus,
          collectionName: type,
          createdAt: Date.now(),
          syncPriority: priority,
          retryCount: 0
        }]);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to store offline item:', error);
      return { success: false, error };
    }
  };

  const storeFileOffline = async (file: File, metadata: Record<string, any> = {}) => {
    try {
      // Convert file to data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const fileId = uuidv4();
      const fileData = {
        fileId,
        dataUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        metadata
      };
      
      const result = await offlineStorage.storeItem({
        type: 'file',
        data: fileData,
        syncStatus: 'pending' as SyncStatus,
        collectionName: 'files',
        createdAt: Date.now(),
        syncPriority: 10, // Files typically have higher priority
        retryCount: 0
      });
      
      if (result.success && result.id) {
        setOfflineItems(prev => [...prev, {
          id: result.id as string,
          timestamp: Date.now(),
          type: 'file',
          data: fileData,
          syncStatus: 'pending' as SyncStatus,
          collectionName: 'files',
          createdAt: Date.now(),
          syncPriority: 10,
          retryCount: 0
        }]);
      }
      
      return { success: result.success, fileId, id: result.id };
    } catch (error) {
      console.error('Failed to store file offline:', error);
      return { success: false, error };
    }
  };

  // Method for saving data through the offline system
  const saveData = async (collectionName: string, data: any, options: { priority?: number } = {}) => {
    return storeOffline(collectionName, data, options.priority || 1);
  };

  const getOfflineItemsByType = async (type: string): Promise<OfflineItem[]> => {
    try {
      const items = await offlineStorage.getItemsByType(type);
      return items;
    } catch (error) {
      console.error('Failed to get offline items by type:', error);
      return [];
    }
  };

  return {
    storeOffline,
    storeFileOffline,
    isInitialized,
    offlineItems,
    getOfflineItemsByType,
    saveData // Add the missing saveData method
  };
};
