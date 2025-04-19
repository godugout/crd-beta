
import { useState, useCallback } from 'react';
import { processImage, compressImage } from '@/lib/image-utils';
import { FALLBACK_UNSPLASH_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';

interface UseImageHandlingOptions {
  enabledMemorabiliaTypes?: MemorabiliaType[];
  batchProcessingMode?: boolean;
}

export const useImageHandling = (options?: UseImageHandlingOptions) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionRunning, setDetectionRunning] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<{
    url: string;
    width: number;
    height: number;
    file?: File;
  } | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return null;
    
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // Compress image for better performance
      const compressedFile = await compressImage(file);
      
      // Process the image to get dimensions and data URL
      const processed = await processImage(compressedFile);
      
      setProcessedImage({
        ...processed,
        file: compressedFile
      });
      
      return processed;
    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingError('Failed to process image. Please try another file.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearProcessedImage = () => {
    setProcessedImage(null);
  };
  
  const rotateImage = useCallback(() => {
    console.log("Rotating image");
    // Implementation would go here
  }, []);
  
  const detectItems = useCallback(() => {
    console.log("Detecting items in image");
    setDetectionRunning(true);
    
    // Mock implementation
    setTimeout(() => {
      setDetectionRunning(false);
    }, 1500);
    
    // Implementation would go here
  }, []);

  return {
    isProcessing,
    isLoading,
    detectionRunning,
    processingError,
    processedImage,
    handleImageUpload,
    clearProcessedImage,
    rotateImage,
    detectItems
  };
};
