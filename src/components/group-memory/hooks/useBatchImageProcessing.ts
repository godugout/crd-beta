
import { useState } from 'react';
import { EnhancedCropBoxProps, MemorabiliaType, applyCrop } from '@/components/card-upload/cardDetection';
import { detectCardsInImage } from '@/components/card-upload/cardDetection';
import { toast } from 'sonner';

export interface BatchProcessingProps {
  onComplete?: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  autoEnhance?: boolean;
}

export const useBatchImageProcessing = ({ 
  onComplete, 
  autoEnhance = true 
}: BatchProcessingProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stagedItems, setStagedItems] = useState<Array<{
    file: File;
    url: string;
    type?: MemorabiliaType;
  }>>([]);

  // Clear staged items
  const clearStaged = () => {
    setStagedItems([]);
  };

  // Run detection on an image element
  const runDetection = async (
    imgRef: React.RefObject<HTMLImageElement>,
    detectionType: 'face' | 'group' | 'memorabilia' | 'mixed'
  ): Promise<EnhancedCropBoxProps[]> => {
    if (!imgRef.current || !imgRef.current.complete) {
      toast.error("Image not loaded");
      return [];
    }

    setIsDetecting(true);
    
    try {
      // Determine which detection types to enable based on the selected mode
      let enabledTypes: MemorabiliaType[] = [];
      
      switch (detectionType) {
        case 'face':
          enabledTypes = ['face'];
          break;
        case 'group':
          enabledTypes = ['face', 'group'];
          break;
        case 'memorabilia':
          enabledTypes = ['card', 'ticket', 'program', 'autograph'];
          break;
        case 'mixed':
          enabledTypes = ['face', 'group', 'card', 'ticket', 'program', 'autograph'];
          break;
      }
      
      // Run detection with appropriate types
      const detectedItems = await detectCardsInImage(
        imgRef.current,
        autoEnhance,
        null,
        enabledTypes
      );
      
      return detectedItems;
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Failed to detect content in image");
      return [];
    } finally {
      setIsDetecting(false);
    }
  };

  // Process batch selections
  const processBatchSelections = async (
    originalFile: File,
    cropBoxes: EnhancedCropBoxProps[],
    batchSelections: number[],
    imgRef: React.RefObject<HTMLImageElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>
  ) => {
    if (!imgRef.current || !canvasRef.current || !originalFile) {
      toast.error("Missing required elements for processing");
      return false;
    }

    setIsProcessing(true);
    
    try {
      const files: File[] = [];
      const urls: string[] = [];
      const types: MemorabiliaType[] = [];
      
      // Process each selected area
      for (const index of batchSelections) {
        if (index >= 0 && index < cropBoxes.length) {
          const box = cropBoxes[index];
          
          const result = await applyCrop(
            box,
            canvasRef.current,
            originalFile,
            imgRef.current,
            autoEnhance ? box.memorabiliaType : undefined
          );
          
          if (result?.file && result?.url) {
            files.push(result.file);
            urls.push(result.url);
            types.push(box.memorabiliaType || 'unknown');
          }
        }
      }
      
      if (files.length > 0) {
        // Add to staged items
        const newStagedItems = files.map((file, i) => ({
          file,
          url: urls[i],
          type: types[i]
        }));
        
        setStagedItems([...stagedItems, ...newStagedItems]);
        
        // Call the completion callback if provided
        if (onComplete) {
          onComplete(files, urls, types);
        }
        
        toast.success(`Successfully processed ${files.length} items`);
        return true;
      } else {
        toast.error("No items were processed");
        return false;
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process selected areas");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process selected areas
  const processSelectedAreas = async (
    selectedAreas: EnhancedCropBoxProps[],
    imgRef: React.RefObject<HTMLImageElement>,
    originalFile: File,
    applyEnhancement: boolean = true
  ) => {
    if (!originalFile || !imgRef.current) {
      toast.error("Missing file or image reference");
      return { success: false };
    }
    
    setIsProcessing(true);
    
    try {
      // Create a temporary canvas for processing
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      const files: File[] = [];
      const urls: string[] = [];
      const types: MemorabiliaType[] = [];
      
      // Process each area
      for (const area of selectedAreas) {
        const result = await applyCrop(
          area,
          tempCanvas,
          originalFile,
          imgRef.current,
          applyEnhancement ? area.memorabiliaType : undefined
        );
        
        if (result?.file && result?.url) {
          files.push(result.file);
          urls.push(result.url);
          types.push(area.memorabiliaType || 'unknown');
        }
      }
      
      if (files.length > 0) {
        // Add to staged items
        const newStagedItems = files.map((file, i) => ({
          file,
          url: urls[i],
          type: types[i]
        }));
        
        setStagedItems([...stagedItems, ...newStagedItems]);
        
        // Call the completion callback if provided
        if (onComplete) {
          onComplete(files, urls, types);
        }
        
        return { 
          success: true, 
          files, 
          urls, 
          types 
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Processing error:", error);
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isDetecting,
    isProcessing,
    stagedItems,
    setStagedItems,
    clearStaged,
    processBatchSelections,
    runDetection,
    processSelectedAreas
  };
};
