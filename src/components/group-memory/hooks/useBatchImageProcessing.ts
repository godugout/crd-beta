import { useState } from 'react';
import { 
  EnhancedCropBoxProps, 
  MemorabiliaType, 
  applyCrop, 
  detectCardsInImage,
  ExtendedMemorabiliaType
} from '@/components/card-upload/cardDetection';
import { toast } from 'sonner';

export interface BatchProcessingProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  editorImgRef?: React.RefObject<HTMLImageElement>;
  selectedAreas?: EnhancedCropBoxProps[];
  detectionType?: 'group' | 'memorabilia' | 'mixed';
  setSelectedAreas?: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setIsDetecting?: (value: boolean) => void;
  setIsProcessing?: (value: boolean) => void;
  onComplete?: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  autoEnhance?: boolean;
}

export const useBatchImageProcessing = ({ 
  canvasRef,
  editorImgRef,
  selectedAreas = [],
  detectionType = 'group',
  setSelectedAreas,
  setIsDetecting,
  setIsProcessing,
  onComplete, 
  autoEnhance = true 
}: BatchProcessingProps = {}) => {
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
  const detectObjects = async (): Promise<EnhancedCropBoxProps[]> => {
    if (!editorImgRef?.current || !editorImgRef.current.complete) {
      toast.error("Image not loaded");
      return [];
    }

    if (setIsDetecting) setIsDetecting(true);
    
    try {
      // Determine which detection types to enable based on the selected mode
      let enabledTypes: MemorabiliaType[] = [];
      
      switch (detectionType) {
        case 'group':
          enabledTypes = ['face'];
          break;
        case 'memorabilia':
          enabledTypes = ['card', 'ticket', 'program', 'autograph'];
          break;
        case 'mixed':
          enabledTypes = ['face', 'card', 'ticket', 'program', 'autograph'];
          break;
      }
      
      // Run detection with appropriate types
      const detectedItems = await detectCardsInImage(
        editorImgRef.current,
        autoEnhance,
        null,
        enabledTypes
      );
      
      if (setSelectedAreas) {
        setSelectedAreas(detectedItems);
      }
      
      return detectedItems;
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Failed to detect content in image");
      return [];
    } finally {
      if (setIsDetecting) setIsDetecting(false);
    }
  };

  // Process batch selections
  const processDetections = async (
    originalFile: File,
    cropBoxes: EnhancedCropBoxProps[],
    batchSelections: number[]
  ): Promise<boolean> => {
    if (!canvasRef?.current || !editorImgRef?.current || !originalFile) {
      toast.error("Missing required elements for processing");
      return false;
    }

    if (setIsProcessing) setIsProcessing(true);
    
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
            editorImgRef.current,
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
      if (setIsProcessing) setIsProcessing(false);
    }
  };

  // Extract selected areas from the image
  const extractSelectedAreas = async (specificIndices?: number[]): Promise<File[]> => {
    if (!canvasRef?.current || !editorImgRef?.current) {
      toast.error("Missing required elements for extraction");
      return [];
    }
    
    const originalFile = new File([""], "temp.jpg", { type: "image/jpeg" });
    const indicesToProcess = specificIndices || selectedAreas.map((_, index) => index);
    
    if (setIsProcessing) setIsProcessing(true);
    
    try {
      const files: File[] = [];
      
      // Process each selected area
      for (const index of indicesToProcess) {
        if (index >= 0 && index < selectedAreas.length) {
          const box = selectedAreas[index];
          
          const result = await applyCrop(
            box,
            canvasRef.current,
            originalFile,
            editorImgRef.current,
            autoEnhance ? box.memorabiliaType : undefined
          );
          
          if (result?.file) {
            files.push(result.file);
          }
        }
      }
      
      return files;
    } catch (error) {
      console.error("Extraction error:", error);
      return [];
    } finally {
      if (setIsProcessing) setIsProcessing(false);
    }
  };

  // Get preview URLs for selected areas
  const getPreviewUrls = (specificIndices?: number[]): string[] => {
    const indicesToProcess = specificIndices || selectedAreas.map((_, index) => index);
    
    return indicesToProcess.map((index) => {
      if (canvasRef?.current && index >= 0 && index < selectedAreas.length) {
        const box = selectedAreas[index];
        
        // Create a temporary canvas for the preview
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = box.width;
        tempCanvas.height = box.height;
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvasRef.current,
            box.x, box.y, box.width, box.height,
            0, 0, box.width, box.height
          );
          
          return tempCanvas.toDataURL('image/jpeg', 0.7);
        }
      }
      
      return '';
    }).filter(url => url !== '');
  };

  return {
    stagedItems,
    setStagedItems,
    clearStaged,
    processDetections,
    detectObjects,
    extractSelectedAreas,
    getPreviewUrls,
    isDetecting: false,
    isProcessing: false
  };
};
