
import { useState, useCallback } from 'react';
import { uploadMedia } from '@/lib/mediaManager';
import { toast } from 'sonner';

interface MediaBatchUploadOptions {
  memoryId: string;
  userId: string;
  isPrivate?: boolean;
  detectFaces?: boolean;
  onError?: (err: Error) => void;
}

export function useMediaBatchUpload({
  memoryId,
  userId,
  isPrivate = false,
  detectFaces = false,
  onError
}: MediaBatchUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const uploadFiles = async (selectedFiles: File[]): Promise<any[]> => {
    if (selectedFiles.length === 0) return [];
    
    setUploading(true);
    const uploadedItems: any[] = [];

    try {
      const chunkSize = 3;
      for (let i = 0; i < selectedFiles.length; i += chunkSize) {
        const slice = selectedFiles.slice(i, i + chunkSize);
        const uploads = slice.map(async (file, idx) => {
          const key = file.name + idx;
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
            return mediaItem;
          } catch (err: any) {
            console.error('Error uploading file:', err);
            toast.error(`Failed to upload ${file.name}`);
            if (onError) onError(err);
            return null;
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

  const getOverallProgress = useCallback(() => {
    const keys = Object.keys(progress);
    if (keys.length === 0) return 0;
    const sum = Object.values(progress).reduce((a, b) => a + b, 0);
    return sum / keys.length;
  }, [progress]);

  return {
    uploading,
    progress,
    uploadFiles,
    getOverallProgress
  };
}
