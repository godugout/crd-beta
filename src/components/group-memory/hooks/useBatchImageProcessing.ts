
import { useState } from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';
import useImageProcessing from '@/hooks/useImageProcessing';
import { toast } from 'sonner';

interface BatchProcessingProps {
  onComplete?: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  autoEnhance?: boolean;
}

export const useBatchImageProcessing = ({ onComplete, autoEnhance = true }: BatchProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stagedItems, setStagedItems] = useState<{ file: File, url: string, type?: MemorabiliaType }[]>([]);
  const imageProcessor = useImageProcessing();
  
  // Process a batch of selected crop areas
  const processBatchSelections = async (
    originalFile: File | null,
    cropBoxes: EnhancedCropBoxProps[],
    batchSelections: number[]
  ): Promise<boolean> => {
    if (!originalFile || batchSelections.length === 0) return false;
    
    setIsProcessing(true);
    const processedFiles: File[] = [];
    const processedUrls: string[] = [];
    const processedTypes: MemorabiliaType[] = [];
    
    try {
      // Sort selections by index to maintain order
      const sortedSelections = [...batchSelections].sort((a, b) => a - b);
      
      for (const index of sortedSelections) {
        if (index >= 0 && index < cropBoxes.length) {
          const cropBox = cropBoxes[index];
          const cropResult = await cropAndProcessImage(originalFile, cropBox);
          
          if (cropResult) {
            processedFiles.push(cropResult.file);
            processedUrls.push(cropResult.url);
            processedTypes.push(cropBox.memorabiliaType || 'unknown');
          }
        }
      }
      
      // Add to staged items
      const newItems = processedFiles.map((file, idx) => ({
        file: processedFiles[idx],
        url: processedUrls[idx],
        type: processedTypes[idx]
      }));
      
      setStagedItems(prev => [...prev, ...newItems]);
      
      if (processedFiles.length > 0 && onComplete) {
        onComplete(processedFiles, processedUrls, processedTypes);
      }
      
      return processedFiles.length > 0;
    } catch (error) {
      console.error('Error processing batch selections:', error);
      toast.error('Failed to process selected items');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Process a single crop area
  const processCropArea = async (
    originalFile: File | null,
    cropBox: EnhancedCropBoxProps
  ) => {
    if (!originalFile) return null;
    
    setIsProcessing(true);
    
    try {
      const result = await cropAndProcessImage(originalFile, cropBox);
      if (result) {
        setStagedItems(prev => [...prev, { 
          file: result.file, 
          url: result.url,
          type: cropBox.memorabiliaType
        }]);
      }
      return result;
    } catch (error) {
      console.error('Error processing crop area:', error);
      toast.error('Failed to process image section');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Helper to crop and process image
  const cropAndProcessImage = async (
    originalFile: File,
    cropBox: EnhancedCropBoxProps
  ): Promise<{ file: File, url: string } | null> => {
    // Create a canvas for cropping
    const canvas = document.createElement('canvas');
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    try {
      // Load the original image
      const img = await createImageFromFile(originalFile);
      
      // Apply the crop
      ctx.save();
      if (cropBox.rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((cropBox.rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }
      
      ctx.drawImage(
        img,
        cropBox.x, 
        cropBox.y,
        cropBox.width,
        cropBox.height,
        0,
        0,
        cropBox.width,
        cropBox.height
      );
      ctx.restore();
      
      // Apply enhancement if enabled
      if (autoEnhance) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Basic enhancement suitable for stadium lighting conditions
        for (let i = 0; i < imageData.data.length; i += 4) {
          // Increase contrast slightly
          imageData.data[i] = Math.min(255, Math.max(0, (imageData.data[i] - 128) * 1.1 + 128));
          imageData.data[i+1] = Math.min(255, Math.max(0, (imageData.data[i+1] - 128) * 1.1 + 128));
          imageData.data[i+2] = Math.min(255, Math.max(0, (imageData.data[i+2] - 128) * 1.1 + 128));
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else throw new Error('Failed to create image blob');
        }, 'image/jpeg', 0.92);
      });
      
      // Create a File from the blob
      const fileName = originalFile.name.replace(/\.[^/.]+$/, '') + '_cropped_' + Date.now() + '.jpg';
      const newFile = new File([blob], fileName, { type: 'image/jpeg' });
      
      return {
        file: newFile,
        url: URL.createObjectURL(blob)
      };
    } catch (error) {
      console.error('Error in cropAndProcessImage:', error);
      return null;
    }
  };
  
  // Helper to create an image from a file
  const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };
  
  // Clear all staged items
  const clearStaged = () => {
    setStagedItems([]);
  };
  
  return {
    isProcessing,
    stagedItems,
    setStagedItems,
    clearStaged,
    processBatchSelections,
    processCropArea
  };
};
