
import { useState } from 'react';
import { GroupUploadType } from '@/lib/types';

interface UploadHandlingOptions {
  uploadType: GroupUploadType;
  maxFiles?: number;
  allowedExtensions?: string[];
  maxSizeInMB?: number;
}

export const useUploadHandling = (options: UploadHandlingOptions) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (files: FileList | File[], onComplete?: (urls: string[]) => void) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Convert FileList to array if needed
      const fileArray = Array.from(files);
      
      if (options.maxFiles && fileArray.length > options.maxFiles) {
        throw new Error(`Maximum ${options.maxFiles} files allowed`);
      }
      
      // Check file extensions if specified
      if (options.allowedExtensions && options.allowedExtensions.length > 0) {
        const invalidFiles = fileArray.filter(file => {
          const extension = file.name.split('.').pop()?.toLowerCase();
          return !extension || !options.allowedExtensions?.includes(`.${extension}`);
        });
        
        if (invalidFiles.length > 0) {
          throw new Error(`Invalid file type(s). Allowed: ${options.allowedExtensions.join(', ')}`);
        }
      }
      
      // Check file sizes if specified
      if (options.maxSizeInMB) {
        const maxSizeBytes = options.maxSizeInMB * 1024 * 1024;
        const oversizedFiles = fileArray.filter(file => file.size > maxSizeBytes);
        
        if (oversizedFiles.length > 0) {
          throw new Error(`Some files exceed the maximum size of ${options.maxSizeInMB}MB`);
        }
      }
      
      // Mock upload process
      setUploadedFiles(prev => [...prev, ...fileArray]);
      
      // Create URL objects for local preview
      const urls = fileArray.map(file => URL.createObjectURL(file));
      
      // Call onComplete callback with URLs if provided
      if (onComplete) {
        onComplete(urls);
      }
      
      return {
        success: true,
        files: fileArray,
        urls
      };
      
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload files');
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearUploads = () => {
    // Clean up URLs to prevent memory leaks
    uploadedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      URL.revokeObjectURL(url);
    });
    
    setUploadedFiles([]);
    setUploadError(null);
  };
  
  return {
    uploadedFiles,
    isUploading,
    uploadProgress,
    uploadError,
    handleFileUpload,
    clearUploads,
    uploadType: options.uploadType // Return the upload type for reference
  };
};
