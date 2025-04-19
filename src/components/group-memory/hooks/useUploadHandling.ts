
import { useState } from 'react';

export type GroupUploadType = 'single' | 'batch' | 'selection';

export const useUploadHandling = () => {
  const [uploadType, setUploadType] = useState<GroupUploadType>('single');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasSelectedFiles, setHasSelectedFiles] = useState(false);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFiles(files);
      setHasSelectedFiles(true);
    }
  };

  const handleUploadTypeChange = (type: GroupUploadType) => {
    setUploadType(type);
    // Reset files if changing upload type
    setSelectedFiles([]);
    setHasSelectedFiles(false);
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setHasSelectedFiles(false);
    setUploadProgress(0);
  };

  const simulateUpload = async (): Promise<string[]> => {
    setIsUploading(true);
    
    // Simulate progress
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress((i / totalSteps) * 100);
    }

    // Create mock URLs for uploaded files
    const uploadedUrls = selectedFiles.map(file => {
      return URL.createObjectURL(file);
    });
    
    setIsUploading(false);
    return uploadedUrls;
  };

  return {
    uploadType,
    selectedFiles,
    uploadProgress,
    isUploading,
    hasSelectedFiles,
    handleFileSelect,
    handleUploadTypeChange,
    clearSelectedFiles,
    simulateUpload
  };
};
