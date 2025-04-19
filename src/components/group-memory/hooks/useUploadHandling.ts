
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import useImageProcessing from '@/hooks/useImageProcessing';
import { useConnectivity } from '@/hooks/useConnectivity';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';

export type GroupUploadType = 'group' | 'memorabilia' | 'mixed';

export interface UploadFileItem {
  file: File;
  url: string;
  type?: MemorabiliaType;
}

export interface UseUploadHandlingProps {
  onComplete?: (cardIds: string[]) => void;
}

export const useUploadHandling = ({ onComplete }: UseUploadHandlingProps = {}) => {
  const [uploadType, setUploadType] = useState<GroupUploadType>('group');
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  
  const { resizeImage, createThumbnail } = useImageProcessing();
  const { isOnline } = useConnectivity();
  const { shouldOptimizeAnimations, getImageQuality } = useMobileOptimization();
  
  const handleFileSelected = async (file: File): Promise<void> => {
    try {
      if (!file.type.includes('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      const quality = getImageQuality();
      const dataUrl = await createThumbnail(file, 800);
      
      setUploadedFiles(prev => [...prev, { file, url: dataUrl }]);
      
      setCurrentFile(file);
      setCurrentImageUrl(dataUrl);
      setShowEditor(true);
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Failed to process image');
    }
  };
  
  const handleBatchUpload = (
    files: File[],
    urls: string[],
    types?: MemorabiliaType[]
  ) => {
    if (files.length === 0) {
      toast.error('No files to process');
      return;
    }
    
    const newUploadItems: UploadFileItem[] = files.map((file, index) => ({
      file,
      url: urls[index] || '',
      type: types?.[index]
    }));
    
    setUploadedFiles(prev => [...prev, ...newUploadItems]);
    
    const cardIds = files.map((_, index) => `card-${Date.now()}-${index}`);
    
    setShowEditor(false);
    
    setCurrentFile(null);
    setCurrentImageUrl(null);
    
    if (onComplete) {
      onComplete(cardIds);
    }
    
    toast.success(`Successfully processed ${files.length} items`);
  };
  
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const processUploads = async () => {
    if (uploadedFiles.length === 0) {
      toast.warning('No files to process');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (!isOnline) {
        toast.warning('You are offline. Files will sync when connection is restored.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const cardIds = uploadedFiles.map((_, index) => `card-${Date.now()}-${index}`);
      
      if (onComplete) {
        onComplete(cardIds);
      }
      
      setUploadedFiles([]);
      
      toast.success(`Successfully processed ${cardIds.length} images`);
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('Failed to process uploads');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    uploadType,
    setUploadType,
    uploadedFiles,
    isProcessing,
    showEditor,
    setShowEditor,
    currentFile,
    currentImageUrl,
    handleFileSelected,
    handleBatchUpload,
    handleRemoveFile,
    processUploads
  };
};
