
import { useState } from 'react';
import { toast } from 'sonner';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';
import { getDetectionTypesByMode, simulateItemDetection } from '../utils/detectionUtils';

interface UseBatchImageProcessingProps {
  onProcessComplete: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
}

export const useBatchImageProcessing = ({ onProcessComplete }: UseBatchImageProcessingProps) => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Run detection on the current image
  const runDetection = async (
    editorImgRef: React.RefObject<HTMLImageElement>,
    detectionType: 'face' | 'memorabilia' | 'mixed' | 'group'
  ): Promise<EnhancedCropBoxProps[]> => {
    if (!editorImgRef.current) return [];
    
    setIsDetecting(true);
    toast.info("Detecting items in image...");
    
    try {
      // Determine detection types based on the selected mode
      const detectionTypes = getDetectionTypesByMode(detectionType);
      
      const img = editorImgRef.current;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      // Simulate detection with reasonably placed boxes
      const detectedItems = simulateItemDetection(imgWidth, imgHeight, detectionTypes);
      
      toast.success(`Detected ${detectedItems.length} items in image`);
      return detectedItems;
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Error detecting items in image");
      return [];
    } finally {
      setIsDetecting(false);
    }
  };
  
  // Process selected areas
  const processSelectedAreas = async (
    selectedAreas: EnhancedCropBoxProps[],
    editorImgRef: React.RefObject<HTMLImageElement>,
    originalFile: File | null,
    autoEnhance: boolean = true
  ) => {
    if (!editorImgRef.current || !originalFile) {
      toast.error("Missing image data");
      return;
    }
    
    if (selectedAreas.length === 0) {
      toast.error("No areas selected for processing");
      return;
    }
    
    setIsProcessing(true);
    toast.info(`Processing ${selectedAreas.length} selected areas...`);
    
    try {
      const processedFiles: File[] = [];
      const processedUrls: string[] = [];
      const types: MemorabiliaType[] = [];
      
      // Create a temporary canvas for processing each area
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error("Could not create temporary canvas");
      
      // Process each selected area
      for (const area of selectedAreas) {
        // Set dimensions for extracted area
        tempCanvas.width = area.width;
        tempCanvas.height = area.height;
        
        // Clear canvas
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the selected portion of the image
        tempCtx.drawImage(
          editorImgRef.current,
          area.x, area.y, area.width, area.height,
          0, 0, area.width, area.height
        );
        
        // If auto-enhance is enabled, apply enhancement based on type
        if (autoEnhance) {
          // Simplified enhancement for demo - in production this would be more sophisticated
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          const data = imageData.data;
          
          // Basic enhancement by type
          if (area.memorabiliaType === 'face') {
            // Brighten slightly and warm the tones for faces (stadium lighting correction)
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] * 1.1);      // Red (warm)
              data[i+1] = Math.min(255, data[i+1] * 1.05); // Green
              data[i+2] = Math.min(255, data[i+2] * 1.0);  // Blue
            }
          } else {
            // Increase contrast for memorabilia
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
              data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.2 + 128));
              data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.2 + 128));
            }
          }
          
          tempCtx.putImageData(imageData, 0, 0);
        }
        
        // Convert to file
        const blob = await new Promise<Blob>((resolve) => 
          tempCanvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.92)
        );
        
        // Create file name based on type
        const fileType = area.memorabiliaType || 'image';
        const fileName = `${fileType}_${Date.now()}_${Math.round(Math.random() * 1000)}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // Create preview URL
        const url = URL.createObjectURL(blob);
        
        // Add to processed results
        processedFiles.push(file);
        processedUrls.push(url);
        types.push(area.memorabiliaType || 'face');
      }
      
      // Call the complete handler with processed images
      onProcessComplete(processedFiles, processedUrls, types);
      
      return { success: true };
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Error processing selected areas");
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isDetecting,
    isProcessing,
    runDetection,
    processSelectedAreas
  };
};
