
import { useCallback } from 'react';
import { Canvas, fabric } from 'fabric';
import { EnhancedCropBoxProps } from '../../cardDetection';
import { v4 as uuidv4 } from 'uuid';

interface UseCreateCropBoxProps {
  canvas: Canvas | null;
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setSelectedCropIndex: React.Dispatch<React.SetStateAction<number>>;
  cropBoxes: EnhancedCropBoxProps[];
}

export const useCreateCropBox = ({
  canvas,
  setCropBoxes,
  setSelectedCropIndex,
  cropBoxes
}: UseCreateCropBoxProps) => {
  // Handle creating new crop boxes
  const addNewCropBox = useCallback(() => {
    if (!canvas) return;
    
    // Get canvas dimensions
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    // Default crop box size (ensures it's not too small or too large)
    const defaultWidth = Math.min(canvasWidth / 3, 150);
    const defaultHeight = defaultWidth * (3.5 / 2.5); // Card ratio
    
    // Position in center of canvas
    const x = canvasWidth / 2 - defaultWidth / 2;
    const y = canvasHeight / 2 - defaultHeight / 2;
    
    // Add to state
    const newCropBox: EnhancedCropBoxProps = {
      id: crypto.randomUUID(), // Generate a unique ID as a number
      x,
      y,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
      color: '#FF0000',
      memorabiliaType: 'card'
    };
    
    setCropBoxes(prev => [...prev, newCropBox]);
    
    // Select the new crop box
    setSelectedCropIndex(cropBoxes.length);
  }, [canvas, setCropBoxes, setSelectedCropIndex, cropBoxes.length]);
  
  return { addNewCropBox };
};
