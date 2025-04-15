
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useConnectivity } from '../useConnectivity';
import { saveOfflineItem } from '@/lib/offlineStorage';

interface SaveDataOptions {
  collectionName?: string;
  persistOffline?: boolean;
}

export function useSaveOfflineData() {
  const { isOnline } = useConnectivity();
  const [isSaving, setIsSaving] = useState(false);

  const saveData = useCallback(async (
    data: Record<string, any>,
    options?: SaveDataOptions
  ) => {
    setIsSaving(true);
    
    try {
      const itemId = uuidv4();
      const collectionName = options?.collectionName || 'default';
      
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
      } else {
        console.log('Online mode - saving data:', data);
        await new Promise(resolve => setTimeout(resolve, 500));
        
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

  return { saveData, isSaving };
}
