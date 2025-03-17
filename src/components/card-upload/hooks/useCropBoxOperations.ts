
import { toast } from 'sonner';
import { CropBoxProps } from '../CropBox';

export interface UseCropBoxOperationsProps {
  cropBoxes: CropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
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
  
  const rotateClockwise = () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...newBoxes[selectedCropIndex],
        rotation: (newBoxes[selectedCropIndex].rotation + 15) % 360
      };
      setCropBoxes(newBoxes);
    }
  };

  const rotateCounterClockwise = () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...newBoxes[selectedCropIndex],
        rotation: (newBoxes[selectedCropIndex].rotation - 15 + 360) % 360
      };
      setCropBoxes(newBoxes);
    }
  };

  const addNewCropBox = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Create a new crop box with proper card ratio
    const newWidth = rect.width * 0.3;
    const newHeight = newWidth * (3.5 / 2.5);
    
    const newBox: CropBoxProps = {
      x: (rect.width - newWidth) / 2,
      y: (rect.height - newHeight) / 2,
      width: newWidth,
      height: newHeight,
      rotation: 0
    };
    
    const newBoxes = [...cropBoxes, newBox];
    setCropBoxes(newBoxes);
    setSelectedCropIndex(newBoxes.length - 1);
  };

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

  const maximizeCrop = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the maximum possible crop area while maintaining the 2.5:3.5 aspect ratio
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // Calculate the maximum crop area within the image bounds
    let maxWidth, maxHeight;
    const cardRatio = 2.5 / 3.5;
    
    if (canvasWidth / canvasHeight > cardRatio) {
      // The image is wider than the card ratio
      maxHeight = canvasHeight * 0.9;
      maxWidth = maxHeight * cardRatio;
    } else {
      // The image is taller than the card ratio
      maxWidth = canvasWidth * 0.9;
      maxHeight = maxWidth / cardRatio;
    }
    
    // Update the selected crop box
    const newBoxes = [...cropBoxes];
    const currentBox = newBoxes[selectedCropIndex];
    
    newBoxes[selectedCropIndex] = {
      x: (canvasWidth - maxWidth) / 2,
      y: (canvasHeight - maxHeight) / 2,
      width: maxWidth,
      height: maxHeight,
      rotation: currentBox ? currentBox.rotation : 0
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
