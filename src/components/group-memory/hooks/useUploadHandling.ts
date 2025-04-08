
import { useState } from 'react';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { toast } from 'sonner';

export type GroupUploadType = 'group' | 'memorabilia' | 'mixed';

export interface UploadFileItem {
  file: File;
  url: string;
  type?: MemorabiliaType;
}

export interface UseUploadHandlingProps {
  onComplete?: (cardIds: string[]) => void;
}

export const useUploadHandling = ({ onComplete }: UseUploadHandlingProps) => {
  const [uploadType, setUploadType] = useState<GroupUploadType>('group');
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]); // Updated type
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  
  const { resizeImage, createThumbnail } = useImageProcessing();
  
  // Handle file selection
  const handleFileSelected = async (file: File): Promise<void> => {
    try {
      // Basic validation
      if (!file.type.includes('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Resize image for preview
      const dataUrl = await createThumbnail(file, 800);
      
      // Add to uploaded files
      setUploadedFiles(prev => [...prev, { file, url: dataUrl }]);
      
      // Open editor with current file
      setCurrentFile(file);
      setCurrentImageUrl(dataUrl);
      setShowEditor(true);
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Failed to process image');
    }
  };
  
  // Handle batched uploads from editor
  const handleBatchUpload = (
    files: File[],
    urls: string[],
    types?: MemorabiliaType[]
  ) => {
    if (files.length === 0) {
      toast.error('No files to process');
      return;
    }
    
    // Create proper upload file items
    const newUploadItems: UploadFileItem[] = files.map((file, index) => ({
      file,
      url: urls[index] || '',
      type: types?.[index]
    }));
    
    // Add to uploaded files
    setUploadedFiles(prev => [...prev, ...newUploadItems]);
    
    // Generate fake card IDs for demo
    const cardIds = files.map((_, index) => `card-${Date.now()}-${index}`);
    
    // Close editor
    setShowEditor(false);
    
    // Reset current file
    setCurrentFile(null);
    setCurrentImageUrl(null);
    
    // Call onComplete with card IDs
    if (onComplete) {
      onComplete(cardIds);
    }
    
    toast.success(`Successfully processed ${files.length} items`);
  };
  
  // Remove a file from the upload queue
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Process all uploads in queue
  const processUploads = async () => {
    if (uploadedFiles.length === 0) {
      toast.warning('No files to process');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, we would upload each file to the server here
      // For demo purposes, we'll just simulate server processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate fake card IDs
      const cardIds = uploadedFiles.map((_, index) => `card-${Date.now()}-${index}`);
      
      // Call onComplete with card IDs
      if (onComplete) {
        onComplete(cardIds);
      }
      
      // Clear uploaded files
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
