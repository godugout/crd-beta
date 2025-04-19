
import { useState } from 'react';
import { processImage, compressImage } from '@/lib/image-utils';
import { FALLBACK_UNSPLASH_IMAGE_URL } from '@/lib/utils/cardDefaults';

export const useImageHandling = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<{
    url: string;
    width: number;
    height: number;
    file?: File;
  } | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
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

  // Fix the parameter count
  const clearProcessedImage = () => {
    setProcessedImage(null);
  };

  return {
    isProcessing,
    processingError,
    processedImage,
    handleImageUpload,
    clearProcessedImage
  };
};
