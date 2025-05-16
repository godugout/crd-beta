
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  onSuccess?: (url: string, path: string) => void;
  onError?: (error: Error) => void;
  metadata?: Record<string, string>;
}

export interface MediaServiceHook {
  uploadFile: (file: File, options?: UploadOptions) => Promise<string | null>;
  uploadDataUrl: (dataUrl: string, fileName: string, options?: UploadOptions) => Promise<string | null>;
  uploadProgress: number;
  isUploading: boolean;
  reset: () => void;
}

export const useMediaService = (): MediaServiceHook => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const DEFAULT_OPTIONS: UploadOptions = {
    bucket: 'assets',
    folder: 'uploads',
    maxSizeMB: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  };

  /**
   * Reset upload state
   */
  const reset = () => {
    setUploadProgress(0);
    setIsUploading(false);
  };

  /**
   * Upload a file to storage
   */
  const uploadFile = async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<string | null> => {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const { bucket, folder, maxSizeMB, allowedFileTypes, onSuccess, onError, metadata } = mergedOptions;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Validate file type
      if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
        throw new Error(`File type not supported. Allowed types: ${allowedFileTypes.join(', ')}`);
      }
      
      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (maxSizeMB && fileSizeMB > maxSizeMB) {
        throw new Error(`File size too large. Maximum size: ${maxSizeMB}MB`);
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
          metadata
        });
        
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
        
      const url = urlData.publicUrl;
      
      setUploadProgress(100);
      
      if (onSuccess) {
        onSuccess(url, data.path);
      }
      
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${(error as Error).message}`);
      
      if (onError) {
        onError(error as Error);
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Upload a data URL as a file
   */
  const uploadDataUrl = async (
    dataUrl: string, 
    fileName: string,
    options: UploadOptions = {}
  ): Promise<string | null> => {
    try {
      // Convert data URL to file
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: blob.type });
      
      // Upload the file
      return uploadFile(file, options);
    } catch (error) {
      console.error('Error uploading data URL:', error);
      toast.error(`Upload failed: ${(error as Error).message}`);
      
      if (options.onError) {
        options.onError(error as Error);
      }
      
      return null;
    }
  };
  
  return {
    uploadFile,
    uploadDataUrl,
    uploadProgress,
    isUploading,
    reset
  };
};

export default useMediaService;
