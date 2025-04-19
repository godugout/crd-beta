
import { useState } from 'react';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import { toast } from 'sonner';
import useImageProcessing from '@/hooks/useImageProcessing';
import { useConnectivity } from '@/hooks/useConnectivity';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

// Define and export the GroupUploadType
export type GroupUploadType = 'group' | 'memorabilia' | 'mixed';

interface UseUploadHandlingProps {
  onComplete?: (cardIds: string[]) => void;
}

export const useUploadHandling = ({ onComplete }: UseUploadHandlingProps = {}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const imageProcessing = useImageProcessing();
  const { isOnline } = useConnectivity();
  const { isMobile } = useMobileOptimization();
  
  const handleFileSelected = async (file: File) => {
    try {
      // Create a thumbnail for preview
      const thumbnail = await imageProcessing.createThumbnail(file, 800, 800);
      
      // Add to uploaded files
      setUploadedFiles(prev => [...prev, file]);
      setUploadedUrls(prev => [...prev, thumbnail]);
      
      toast.success('Image added successfully');
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast.error('Failed to process image');
    }
  };
  
  const processUploads = async () => {
    if (uploadedFiles.length === 0) {
      toast.warning('No files to process');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would handle actual upload and processing
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      
      // Generate mock card IDs
      const cardIds = uploadedFiles.map((_, index) => `card-${Date.now()}-${index}`);
      
      if (onComplete) {
        onComplete(cardIds);
      }
      
      toast.success(`Processed ${uploadedFiles.length} images successfully`);
      
      // Clear files after processing
      setUploadedFiles([]);
      setUploadedUrls([]);
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('Failed to process uploads');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    uploadedFiles,
    uploadedUrls,
    isProcessing,
    handleFileSelected,
    processUploads
  };
};
