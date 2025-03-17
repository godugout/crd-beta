
import { Canvas } from 'fabric';
import { CropBoxProps } from '../../CropBox';

// Default trading card ratio (2.5:3.5)
const CARD_RATIO = 2.5 / 3.5;

interface UseCreateCropBoxProps {
  canvas: Canvas | null;
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  setSelectedCropIndex: (index: number) => void;
  cropBoxesLength: number;
}

export const useCreateCropBox = ({
  canvas,
  setCropBoxes,
  setSelectedCropIndex,
  cropBoxesLength
}: UseCreateCropBoxProps) => {
  
  // Add a new crop box
  const addNewCropBox = () => {
    if (!canvas) return;
    
    // Calculate default dimensions based on card ratio
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    const newWidth = canvasWidth * 0.3;
    const newHeight = newWidth / CARD_RATIO;
    
    const newBox: CropBoxProps = {
      x: (canvasWidth - newWidth) / 2,
      y: (canvasHeight - newHeight) / 2,
      width: newWidth,
      height: newHeight,
      rotation: 0
    };
    
    setCropBoxes(prev => [...prev, newBox]);
    setSelectedCropIndex(cropBoxesLength);
  };

  return { addNewCropBox };
};
