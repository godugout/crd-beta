
import { useState } from 'react';
import { EnhancedCropBoxProps } from '../cardDetection';
import { ImageData } from './useCropState';
import { detectCardsInImage, MemorabiliaType } from '../cardDetection';

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
  enabledMemorabiliaTypes
}: UseImageHandlingProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detectionRunning, setDetectionRunning] = useState<boolean>(false);

  // Rotate the current image
  const rotateImage = async (direction: 'clockwise' | 'counterclockwise') => {
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
            const newDetectedCards = await detectCardsInImage(newImg);
            setDetectedCards(newDetectedCards);
            setCropBoxes(newDetectedCards);
          } catch (error) {
            console.error('Error detecting cards in rotated image:', error);
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

  return {
    rotateImage,
    isLoading,
    detectionRunning,
  };
};
