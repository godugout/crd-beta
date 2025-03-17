
import { useState } from 'react';
import { CropBoxProps, getResizeHandle } from '../../CropBox';
import { DragState } from './types';

export const useResizing = (
  cropBoxes: CropBoxProps[],
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>,
  selectedCropIndex: number
) => {
  const [isResizing, setIsResizing] = useState<string | null>(null);

  const handleResizing = (x: number, y: number, dragStart: DragState) => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length && isResizing) {
      const selectedBox = {...cropBoxes[selectedCropIndex]};
      const boxCenterX = selectedBox.x + selectedBox.width / 2;
      const boxCenterY = selectedBox.y + selectedBox.height / 2;
      
      const angleRad = -selectedBox.rotation * Math.PI / 180;
      const translatedX = x - boxCenterX;
      const translatedY = y - boxCenterY;
      const rotatedX = translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
      const rotatedY = translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);
      
      const dragStartTranslatedX = dragStart.x - boxCenterX;
      const dragStartTranslatedY = dragStart.y - boxCenterY;
      const dragStartRotatedX = dragStartTranslatedX * Math.cos(angleRad) - dragStartTranslatedY * Math.sin(angleRad);
      const dragStartRotatedY = dragStartTranslatedX * Math.sin(angleRad) + dragStartTranslatedY * Math.cos(angleRad);
      
      const deltaX = rotatedX - dragStartRotatedX;
      const deltaY = rotatedY - dragStartRotatedY;
      
      const aspectRatio = 2.5 / 3.5;
      let newWidth = selectedBox.width;
      let newHeight = selectedBox.height;
      let newX = selectedBox.x;
      let newY = selectedBox.y;
      
      switch (isResizing) {
        case 'tl': // Top-left
          newWidth = selectedBox.width - deltaX * 2;
          newHeight = newWidth / aspectRatio;
          break;
        
        case 'tr': // Top-right
          newWidth = selectedBox.width + deltaX * 2;
          newHeight = newWidth / aspectRatio;
          break;
        
        case 'bl': // Bottom-left
          newWidth = selectedBox.width - deltaX * 2;
          newHeight = newWidth / aspectRatio;
          break;
        
        case 'br': // Bottom-right
          newWidth = selectedBox.width + deltaX * 2;
          newHeight = newWidth / aspectRatio;
          break;
      }
      
      const minSize = 100;
      if (newWidth < minSize) {
        newWidth = minSize;
        newHeight = newWidth / aspectRatio;
      }
      
      newX = boxCenterX - newWidth / 2;
      newY = boxCenterY - newHeight / 2;
      
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...selectedBox,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
      
      setCropBoxes(newBoxes);
      return { x, y };
    }
    return dragStart;
  };

  return {
    isResizing,
    setIsResizing,
    handleResizing
  };
};
