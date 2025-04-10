
import { useState } from 'react';
import { uploadMedia } from '@/lib/mediaManager';
import { toast } from 'sonner';

interface UseMediaBatchUploadOptions {
  memoryId: string;
  userId: string;
  isPrivate?: boolean;
  detectFaces?: boolean;
  onError?: (err: Error) => void;
}

export const useMediaBatchUpload = ({
  memoryId,
  userId,
  isPrivate = false,
  detectFaces = false,
  onError
}: UseMediaBatchUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const uploadFiles = async (files: File[]): Promise<any[]> => {
    if (files.length === 0) return [];
    
    setUploading(true);
    const uploadedItems: any[] = [];

    try {
      // Process files in chunks to avoid overwhelming the network
      const chunkSize = 3; 
      
      for (let i = 0; i < files.length; i += chunkSize) {
        const slice = files.slice(i, i + chunkSize);
        
        const uploads = slice.map(async (file, idx) => {
          const key = `${file.name}-${i + idx}`;
          setProgress(prev => ({ ...prev, [key]: 0 }));
          
          try {
            const meta = { detectFaces };
            const mediaItem = await uploadMedia({
              file,
              memoryId,
              userId,
              isPrivate,
              metadata: meta,
              progressCallback: (pct) => {
                setProgress(prev => ({ ...prev, [key]: pct }));
              }
            });
            uploadedItems.push(mediaItem);
          } catch (err: any) {
            console.error('Error uploading file:', err);
            toast.error(`Failed to upload ${file.name}`);
            if (onError) onError(err);
          }
        });
        
        await Promise.all(uploads);
      }
      
      return uploadedItems;
    } finally {
      setUploading(false);
      setProgress({});
    }
  };

  const getOverallProgress = (): number => {
    const keys = Object.keys(progress);
    if (keys.length === 0) return 0;
    const sum = Object.values(progress).reduce((a, b) => a + b, 0);
    return sum / keys.length;
  };

  return {
    uploading,
    progress,
    uploadFiles,
    getOverallProgress
  };
};
