
import { Canvas, Rect } from 'fabric'; // Updated import
import { EnhancedCropBoxProps } from '../../CropBox';

interface UseCreateCropBoxProps {
  canvas: Canvas | null;
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setSelectedCropIndex: (index: number) => void;
  cropBoxesLength: number;
}

export const useCreateCropBox = ({
  canvas,
  setCropBoxes,
  setSelectedCropIndex,
  cropBoxesLength
}: UseCreateCropBoxProps) => {
  
  const addNewCropBox = () => {
    if (!canvas) return;
    
    // Standard trading card ratio (2.5:3.5)
    const cardRatio = 2.5 / 3.5;
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    // Create a new crop box with proper card ratio
    const newWidth = canvasWidth * 0.3;
    const newHeight = newWidth / cardRatio;
    
    const newBox: EnhancedCropBoxProps = {
      id: cropBoxesLength + 1,
      x: (canvasWidth - newWidth) / 2,
      y: (canvasHeight - newHeight) / 2,
      width: newWidth,
      height: newHeight,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'unknown',
      confidence: 0.5
    };
    
    setCropBoxes(prev => [...prev, newBox]);
    setSelectedCropIndex(cropBoxesLength);
  };
  
  return { addNewCropBox };
};
