
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { imageProcessing } from '@/lib/image-utils';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

export type GroupUploadType = 'single' | 'multi' | 'detection';

export interface UseUploadHandlingProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  uploadType?: GroupUploadType;
}

export const useUploadHandling = ({
  onFilesSelected,
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 10,
  uploadType = 'single'
}: UseUploadHandlingProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isMobile = useIsMobile();
  const { shouldOptimizeAnimations, getImageQuality } = useMobileOptimization();

  // Handle file drop/selection
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Filter files by type and size
      const validFiles = acceptedFiles.filter(file => {
        // Check file type
        const isValidType = allowedTypes.includes(file.type);
        if (!isValidType) {
          toast.error(`File type not supported: ${file.type}`);
          return false;
        }
        
        // Check file size
        const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
        if (!isValidSize) {
          toast.error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB (max ${maxSizeMB}MB)`);
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }
      
      // Enforce max files limit
      const filesToProcess = uploadType === 'single' 
        ? validFiles.slice(0, 1) 
        : validFiles.slice(0, maxFiles);
      
      if (validFiles.length > maxFiles) {
        toast.warning(`Only the first ${maxFiles} files will be processed.`);
      }
      
      // Process files if needed (resize, optimize, etc.)
      setUploadProgress(30);
      
      // Pass files to the callback function
      onFilesSelected(filesToProcess);
      
      setUploadProgress(100);
      setIsUploading(false);
    } catch (error) {
      console.error('Error handling files:', error);
      toast.error('Failed to process uploaded files');
      setIsUploading(false);
    }
  }, [allowedTypes, maxFiles, maxSizeMB, onFilesSelected, uploadType]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.fromEntries(allowedTypes.map(type => [type, []])),
    maxFiles: uploadType === 'single' ? 1 : maxFiles,
    disabled: isUploading
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    isUploading,
    uploadProgress,
    uploadType
  };
};
