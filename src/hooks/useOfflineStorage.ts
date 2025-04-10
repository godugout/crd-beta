
import { useState } from 'react';
import { useConnectivity } from './useConnectivity';
import { 
  saveForOfflineUpload, 
  storeFileAsDataUrl, 
  saveOfflineItem 
} from '@/lib/offlineStorage';
import { v4 as uuidv4 } from 'uuid';

export const useOfflineStorage = () => {
  const { saveOfflineItem, removeOfflineItem, offlineItems, isOnline, pendingCount } = useConnectivity();
  const [isSaving, setIsSaving] = useState(false);

  // Save a memory item, handling both online and offline cases
  const saveMemory = async (data: any, imageData?: Blob) => {
    setIsSaving(true);
    
    try {
      // Generate a temporary ID for the item
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // If we're offline, save locally
      if (!isOnline) {
        // Process and save image data if available
        let localImageUrl = '';
        
        if (imageData) {
          const fileKey = `image-${tempId}`;
          if (imageData instanceof File) {
            await storeFileAsDataUrl(fileKey, imageData);
          } else {
            const file = new File([imageData], `${tempId}.jpg`, { type: 'image/jpeg' });
            await storeFileAsDataUrl(fileKey, file);
          }
          localImageUrl = fileKey;
        }
        
        // Save to offline storage
        await saveOfflineItem({
          id: tempId,
          ...data,
          imageUrl: localImageUrl,
          createdAt: new Date().toISOString(),
        });
        
        return { 
          success: true, 
          id: tempId, 
          mode: 'offline'
        };
      } else {
        // Online flow would upload to server
        // Simulate server upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          id: `server-${tempId}`,
          mode: 'online'
        };
      }
    } catch (error) {
      console.error('Error saving memory:', error);
      return {
        success: false,
        error: 'Failed to save memory'
      };
    } finally {
      setIsSaving(false);
    }
  };
  
  // Delete a memory item
  const deleteMemory = async (id: string) => {
    if (!isOnline) {
      // If offline, just remove from local storage
      await removeOfflineItem(id);
      return { success: true };
    } else {
      // Online would send a delete request to the server
      // Simulate server deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Also remove from local cache if it exists
      await removeOfflineItem(id);
      
      return { success: true };
    }
  };
  
  // Upload a file with offline support
  const uploadFile = async (file: File, metadata: Record<string, any> = {}) => {
    if (!isOnline) {
      // Store for offline upload
      const userId = metadata.userId || 'anonymous';
      const memoryId = metadata.memoryId || uuidv4();
      
      // Save file for later upload
      const uploadId = await saveForOfflineUpload(
        file, 
        memoryId, 
        userId, 
        metadata
      );
      
      // Create a temporary URL for immediate display
      const fileKey = `file-${uploadId}`;
      await storeFileAsDataUrl(fileKey, file);
      
      return {
        success: true,
        id: uploadId,
        url: fileKey,
        mode: 'offline'
      };
    } else {
      // Simulate online upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        id: `upload-${Date.now()}`,
        url: URL.createObjectURL(file),
        mode: 'online'
      };
    }
  };
  
  return {
    saveMemory,
    deleteMemory,
    uploadFile,
    isSaving,
    offlineItems,
    saveOfflineItem,
    pendingCount
  };
};
