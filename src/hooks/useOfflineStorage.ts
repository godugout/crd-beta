
import { useState, useCallback } from 'react';
import { useConnectivity } from './useConnectivity';
import { 
  saveOfflineItem, 
  storeFileAsDataUrl, 
  getPendingItemCount,
  getOfflineItems,
  removeOfflineItem,
  OfflineItem
} from '@/lib/offlineStorage';
import { v4 as uuidv4 } from 'uuid';

export interface UseOfflineStorageOptions {
  onSyncComplete?: (results: { success: boolean, syncedCount: number }) => void;
  autoSync?: boolean;
}

export function useOfflineStorage(options?: UseOfflineStorageOptions) {
  const { isOnline, pendingCount, syncOfflineItems } = useConnectivity();
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ success: boolean, syncedCount: number } | null>(null);

  // Function to save data with offline support
  const saveData = useCallback(async (
    data: Record<string, any>,
    options?: { 
      collectionName?: string;
      persistOffline?: boolean;
    }
  ) => {
    setIsSaving(true);
    
    try {
      const itemId = uuidv4();
      const collectionName = options?.collectionName || 'default';
      
      // If offline, save to offline storage
      if (!isOnline) {
        await saveOfflineItem({
          id: itemId,
          type: collectionName,
          data,
          createdAt: new Date().toISOString(),
          collectionName,
          syncStatus: 'pending',
          syncPriority: 1
        });
        
        return {
          id: itemId,
          success: true,
          mode: 'offline',
          message: 'Data saved offline and will sync when connection is restored'
        };
      } 
      // Online mode - would typically send to an API
      else {
        // For demo purposes, we're simulating an API call
        // In a real app, this would be an actual API request
        console.log('Online mode - saving data:', data);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return success with server-generated ID (simulated)
        return {
          id: itemId,
          success: true,
          mode: 'online',
          message: 'Data saved to server'
        };
      }
    } catch (error) {
      console.error('Error saving data:', error);
      return {
        success: false,
        mode: isOnline ? 'online' : 'offline',
        error: 'Failed to save data'
      };
    } finally {
      setIsSaving(false);
    }
  }, [isOnline]);

  // Function to upload a file with offline support
  async function uploadFile(
    file: File, 
    metadata: Record<string, any> = {}
  ) {
    if (!isOnline) {
      // Handle offline file upload
      const uploadId = uuidv4();
      const userId = metadata.userId || 'anonymous';
      
      // Save file metadata for later upload
      await saveOfflineItem({
        id: uploadId,
        type: 'file-upload',
        data: {
          file,
          userId,
          metadata
        },
        createdAt: Date.now()
      });
      
      // Store the file as a data URL for immediate display
      const fileKey = `file-${uploadId}`;
      await storeFileAsDataUrl(fileKey, file);
      
      return {
        success: true,
        id: uploadId,
        url: fileKey,
        mode: 'offline',
        message: 'File saved offline and will upload when connection is restored'
      };
    } else {
      // Handle online file upload
      // This would normally call an API endpoint
      console.log('Online mode - uploading file:', file.name);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        id: `upload-${Date.now()}`,
        url: URL.createObjectURL(file),
        mode: 'online',
        message: 'File uploaded successfully'
      };
    }
  }

  // Function to manually trigger sync
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
      
      // Call the onSyncComplete callback if provided
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
      
      // Call the onSyncComplete callback if provided
      if (options?.onSyncComplete) {
        options.onSyncComplete(errorResult);
      }
      
      return errorResult;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, syncOfflineItems, options]);

  // Function to fetch offline items
  const getOfflineData = useCallback(async (collectionName?: string) => {
    const items = await getOfflineItems();
    if (collectionName) {
      return items.filter(item => item.collectionName === collectionName);
    }
    return items;
  }, []);

  // Function to delete an offline item
  const deleteOfflineItem = useCallback(async (id: string) => {
    await removeOfflineItem(id);
  }, []);

  return {
    // Status
    isOnline,
    isSaving,
    isSyncing,
    pendingCount,
    lastSyncResult,
    
    // Functions
    saveData,
    uploadFile: uploadFile,
    syncData,
    getOfflineData,
    deleteOfflineItem
  };
}

export default useOfflineStorage;
