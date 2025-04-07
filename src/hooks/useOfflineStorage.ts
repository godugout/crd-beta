
import { useState } from 'react';
import { useConnectivity } from './useConnectivity';

export const useOfflineStorage = () => {
  const { saveOfflineItem, removeOfflineItem, offlineItems, isOnline } = useConnectivity();
  const [isSaving, setIsSaving] = useState(false);

  // Save a memory item, handling both online and offline cases
  const saveMemory = async (data: any, imageData?: Blob) => {
    setIsSaving(true);
    
    try {
      // Generate a temporary ID for the item
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // If we're offline, save locally
      if (!isOnline) {
        // Process and save image data if available (in a real app)
        let localImageUrl = '';
        
        if (imageData) {
          // In a real app, we'd store the blob in IndexedDB
          // For this demo, we'll just create a temporary URL
          localImageUrl = URL.createObjectURL(imageData);
        }
        
        // Save to offline storage
        saveOfflineItem({
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
      removeOfflineItem(id);
      return { success: true };
    } else {
      // Online would send a delete request to the server
      // Simulate server deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Also remove from local cache if it exists
      removeOfflineItem(id);
      
      return { success: true };
    }
  };
  
  return {
    saveMemory,
    deleteMemory,
    isSaving,
    offlineItems,
    saveOfflineItem
  };
};
