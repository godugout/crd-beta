
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { processImage, compressImage } from '@/lib/image-utils';

export type GroupUploadType = 'individual' | 'team' | 'group';

export interface UseUploadHandlingProps {
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  uploadType?: GroupUploadType;
  onComplete?: (files: File[], urls: string[]) => void;
}

export const useUploadHandling = ({
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  uploadType = 'group',
  onComplete
}: UseUploadHandlingProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileSelected = async (files: File[]) => {
    try {
      if (!files.length) return;
      
      setIsUploading(true);
      setUploadProgress(10);
      
      // Process all files
      const processedFiles = [];
      const processedUrls = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate progress update for each file
        setUploadProgress(10 + Math.round((i / files.length) * 80));
        
        // Process and compress image
        const compressed = await compressImage(file);
        const { url } = await processImage(compressed);
        
        processedFiles.push(compressed);
        processedUrls.push(url);
      }
      
      setUploadProgress(90);
      
      // Complete the upload
      if (onComplete) {
        onComplete(processedFiles, processedUrls);
      }
      
      setUploadProgress(100);
      
      // Reset progress after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error processing uploads:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const processUploads = async (acceptedFiles: File[]) => {
    // If multiple is disabled, only take the first file
    const filesToProcess = multiple 
      ? acceptedFiles.slice(0, maxFiles) 
      : [acceptedFiles[0]];
    
    await handleFileSelected(filesToProcess);
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize,
    multiple,
    maxFiles,
    onDrop: processUploads
  });
  
  return {
    getRootProps,
    getInputProps,
    isDragActive,
    isUploading,
    uploadProgress,
    uploadType,
    handleFileSelected, // Add these missing methods
    processUploads
  };
};

export default useUploadHandling;
