
import { useState } from 'react';
import { EnhancedCropBoxProps, detectCardsInImage, MemorabiliaType } from '../cardDetection';
import { ImageData } from './useCropState';

interface UseImageHandlingProps {
  editorImage: string | null;
  showEditor: boolean;
  setImageData: React.Dispatch<React.SetStateAction<ImageData>>;
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setDetectedCards: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setSelectedCropIndex: (index: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  batchProcessingMode?: boolean;
  enabledMemorabiliaTypes?: MemorabiliaType[];
}

export const useImageHandling = ({
  editorImage,
  showEditor,
  setImageData,
  setCropBoxes,
  setDetectedCards,
  setSelectedCropIndex,
  canvasRef,
  editorImgRef,
  batchProcessingMode = false,
  enabledMemorabiliaTypes = ['card', 'ticket', 'program', 'autograph', 'face']
}: UseImageHandlingProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detectionRunning, setDetectionRunning] = useState<boolean>(false);

  // Detect items in the current image
  const detectItems = async () => {
    setDetectionRunning(true);
    
    try {
      if (editorImgRef.current && editorImgRef.current.complete) {
        const detectedItems = await detectCardsInImage(
          editorImgRef.current, 
          true, 
          canvasRef.current,
          enabledMemorabiliaTypes
        );
        
        setDetectedCards(detectedItems);
        setCropBoxes(detectedItems);
        
        // Select the first item by default
        if (detectedItems.length > 0) {
          setSelectedCropIndex(0);
        }
        
        return detectedItems;
      }
      return [];
    } catch (error) {
      console.error('Error detecting items:', error);
      return [];
    } finally {
      setDetectionRunning(false);
    }
  };

  // Rotate the current image
  const rotateImage = async (direction: 'clockwise' | 'counterclockwise' = 'clockwise') => {
    setIsLoading(true);

    try {
      if (canvasRef.current && editorImgRef.current && editorImgRef.current.complete) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = editorImgRef.current;

        if (!ctx) return;

        // Set canvas dimensions based on image orientation
        const angle = direction === 'clockwise' ? 90 : -90;
        const radians = (angle * Math.PI) / 180;
        
        canvas.width = img.naturalHeight;
        canvas.height = img.naturalWidth;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Translate and rotate
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();

        // Convert to blob and update image data
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.92);
        });

        const url = URL.createObjectURL(blob);
        
        // Update image data with rotated image
        setImageData(prevData => ({
          ...prevData,
          url,
          width: canvas.width,
          height: canvas.height,
        }));

        // Reset crop boxes and detect again
        setCropBoxes([]);
        setSelectedCropIndex(-1);
        
        // Re-run detection after image is loaded
        const newImg = new Image();
        newImg.onload = async () => {
          try {
            const newDetectedItems = await detectItems();
            setDetectedCards(newDetectedItems);
            setCropBoxes(newDetectedItems);
          } catch (error) {
            console.error('Error detecting items in rotated image:', error);
          } finally {
            setIsLoading(false);
          }
        };
        newImg.src = url;
      }
    } catch (error) {
      console.error('Error rotating image:', error);
      setIsLoading(false);
    }
  };

  // Enhance a specific image area
  const enhanceImageArea = async (cropBox: EnhancedCropBoxProps, type: MemorabiliaType) => {
    if (!canvasRef.current || !editorImgRef.current) return null;
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = editorImgRef.current;
      
      if (!ctx) return null;
      
      // Set canvas to the size of the crop
      canvas.width = cropBox.width;
      canvas.height = cropBox.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image section
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
      
      // Apply enhancement based on type
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Apply stadium lighting enhancement
      if (type === 'face') {
        // Face-specific enhancement logic
        // Brighten and improve skin tones
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] = Math.min(255, imageData.data[i] * 1.05);
          imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] * 1.02);
          imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] * 1.01);
        }
      } else {
        // Default enhancement for memorabilia
        // Increase contrast and color saturation
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          
          // Simple contrast enhancement
          imageData.data[i] = Math.min(255, Math.max(0, (r - 128) * 1.1 + 128));
          imageData.data[i + 1] = Math.min(255, Math.max(0, (g - 128) * 1.1 + 128));
          imageData.data[i + 2] = Math.min(255, Math.max(0, (b - 128) * 1.1 + 128));
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(blob => resolve(blob!), 'image/png', 0.95);
      });
      
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error enhancing image area:', error);
      return null;
    }
  };
  
  // Auto-enhance for stadium lighting conditions
  const applyStadiumLightingCorrection = async () => {
    if (!canvasRef.current || !editorImgRef.current) return false;
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = editorImgRef.current;
      
      if (!ctx) return false;
      
      // Set canvas to the size of the image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply stadium lighting correction
      // Stadium lights often create yellowish tint and uneven exposure
      let totalBrightness = 0;
      
      // First pass - calculate average brightness
      for (let i = 0; i < data.length; i += 4) {
        totalBrightness += (data[i] + data[i+1] + data[i+2]) / 3;
      }
      
      const avgBrightness = totalBrightness / (data.length / 4);
      const brightnessFactor = avgBrightness < 128 ? 1.2 : 1.0; // Boost dark images
      
      // Second pass - apply corrections
      for (let i = 0; i < data.length; i += 4) {
        // Reduce yellow cast (common in stadium lighting)
        // Increase blue slightly when red and green are high but blue is low
        if (data[i] > 150 && data[i+1] > 150 && data[i+2] < 120) {
          data[i+2] = Math.min(255, data[i+2] * 1.2); // Boost blue
          data[i] = Math.max(0, data[i] * 0.95);      // Reduce red slightly
        }
        
        // Apply brightness adjustment
        data[i] = Math.min(255, data[i] * brightnessFactor);
        data[i+1] = Math.min(255, data[i+1] * brightnessFactor);
        data[i+2] = Math.min(255, data[i+2] * brightnessFactor);
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to blob and update image
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.92);
      });
      
      const url = URL.createObjectURL(blob);
      
      // Update image data with enhanced image
      setImageData(prevData => ({
        ...prevData,
        url
      }));
      
      return true;
    } catch (error) {
      console.error('Error applying stadium lighting correction:', error);
      return false;
    }
  };

  return {
    rotateImage,
    detectItems,
    enhanceImageArea,
    applyStadiumLightingCorrection,
    isLoading,
    detectionRunning,
  };
};
