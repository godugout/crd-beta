
import { useState } from 'react';
import { CropBoxProps } from '../../CropBox';
import { DragState } from './types';

export const useDragging = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cropBoxes: CropBoxProps[],
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>,
  selectedCropIndex: number
) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragging = (x: number, y: number, dragStart: DragState) => {
    if (isDragging && selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length && canvasRef.current) {
      const canvas = canvasRef.current;
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      const newBoxes = [...cropBoxes];
      const box = {...newBoxes[selectedCropIndex]};
      
      box.x = Math.max(0, Math.min(canvas.width - box.width, box.x + deltaX));
      box.y = Math.max(0, Math.min(canvas.height - box.height, box.y + deltaY));
      
      newBoxes[selectedCropIndex] = box;
      setCropBoxes(newBoxes);
      return { x, y };
    }
    return dragStart;
  };

  return {
    isDragging,
    setIsDragging,
    handleDragging
  };
};
