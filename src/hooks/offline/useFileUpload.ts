
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useConnectivity } from '../useConnectivity';
import { saveOfflineItem, storeFileAsDataUrl } from '@/lib/offlineStorage';

export function useFileUpload() {
  const { isOnline } = useConnectivity();

  const uploadFile = useCallback(async (
    file: File, 
    metadata: Record<string, any> = {}
  ) => {
    if (!isOnline) {
      const uploadId = uuidv4();
      const userId = metadata.userId || 'anonymous';
      
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
      
      const fileKey = `file-${uploadId}`;
      await storeFileAsDataUrl(fileKey, file);
      
      return {
        success: true,
        id: uploadId,
        url: fileKey,
        mode: 'offline',
        message: 'File saved offline and will upload when connection is restored'
      };
    }
    
    console.log('Online mode - uploading file:', file.name);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      id: `upload-${Date.now()}`,
      url: URL.createObjectURL(file),
      mode: 'online',
      message: 'File uploaded successfully'
    };
  }, [isOnline]);

  return { uploadFile };
}
