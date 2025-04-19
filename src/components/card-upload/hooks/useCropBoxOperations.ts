
import { toast } from 'sonner';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';

export interface UseCropBoxOperationsProps {
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useCropBoxOperations = ({
  cropBoxes, 
  setCropBoxes, 
  selectedCropIndex,
  setSelectedCropIndex,
  canvasRef
}: UseCropBoxOperationsProps) => {
  
  // Rotate the selected crop box clockwise
  const rotateClockwise = () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...newBoxes[selectedCropIndex],
        rotation: (newBoxes[selectedCropIndex].rotation || 0) + 15
      };
      setCropBoxes(newBoxes);
    }
  };

  // Rotate the selected crop box counter-clockwise
  const rotateCounterClockwise = () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...newBoxes[selectedCropIndex],
        rotation: ((newBoxes[selectedCropIndex].rotation || 0) - 15 + 360) % 360
      };
      setCropBoxes(newBoxes);
    }
  };

  // Add a new crop box to the canvas
  const addNewCropBox = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Standard trading card ratio (2.5:3.5)
    const cardRatio = 2.5 / 3.5;
    
    // Create a new crop box with proper card ratio
    const newWidth = rect.width * 0.3;
    const newHeight = newWidth / cardRatio;
    
    const newBox: EnhancedCropBoxProps = {
      id: crypto.randomUUID(), 
      x: (rect.width - newWidth) / 2,
      y: (rect.height - newHeight) / 2,
      width: newWidth,
      height: newHeight,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'card' as MemorabiliaType, // Changed from 'unknown' to 'card'
      confidence: 0.5
    };
    
    const newBoxes = [...cropBoxes, newBox];
    setCropBoxes(newBoxes);
    setSelectedCropIndex(newBoxes.length - 1);
  };

  // Remove the selected crop box
  const removeCropBox = () => {
    if (cropBoxes.length <= 1) {
      toast.error("At least one crop area is required");
      return;
    }
    
    const newBoxes = cropBoxes.filter((_, i) => i !== selectedCropIndex);
    setCropBoxes(newBoxes);
    
    // Update selected index
    if (selectedCropIndex >= newBoxes.length) {
      setSelectedCropIndex(newBoxes.length - 1);
    }
  };

  // Maximize the crop box while maintaining aspect ratio
  const maximizeCrop = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Standard trading card ratio (2.5:3.5)
    const cardRatio = 2.5 / 3.5;
    
    // Calculate the maximum crop area within the canvas bounds
    let maxWidth, maxHeight;
    
    if (rect.width / rect.height > cardRatio) {
      // The canvas is wider than the card ratio
      maxHeight = rect.height * 0.9;
      maxWidth = maxHeight * cardRatio;
    } else {
      // The canvas is taller than the card ratio
      maxWidth = rect.width * 0.9;
      maxHeight = maxWidth / cardRatio;
    }
    
    // Update the selected crop box
    const newBoxes = [...cropBoxes];
    const currentBox = newBoxes[selectedCropIndex];
    
    newBoxes[selectedCropIndex] = {
      ...currentBox,
      x: (rect.width - maxWidth) / 2,
      y: (rect.height - maxHeight) / 2,
      width: maxWidth,
      height: maxHeight
    };
    
    setCropBoxes(newBoxes);
  };

  return {
    rotateClockwise,
    rotateCounterClockwise,
    addNewCropBox,
    removeCropBox,
    maximizeCrop
  };
};
