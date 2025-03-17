import { useState } from 'react';
import { CropBoxProps } from '../../CropBox';
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
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      
      const translatedX = x - boxCenterX;
      const translatedY = y - boxCenterY;
      
      const rotatedX = translatedX * cos - translatedY * sin;
      const rotatedY = translatedX * sin + translatedY * cos;
      
      const dragStartTranslatedX = dragStart.x - boxCenterX;
      const dragStartTranslatedY = dragStart.y - boxCenterY;
      const dragStartRotatedX = dragStartTranslatedX * cos - dragStartTranslatedY * sin;
      const dragStartRotatedY = dragStartTranslatedX * sin + dragStartTranslatedY * cos;
      
      const deltaX = rotatedX - dragStartRotatedX;
      const deltaY = rotatedY - dragStartRotatedY;
      
      const aspectRatio = 2.5 / 3.5;
      
      let newWidth = selectedBox.width;
      let newHeight = selectedBox.height;
      let offsetX = 0;
      let offsetY = 0;
      
      switch (isResizing) {
        case 'tl': // Top-left
          if (Math.abs(deltaX) > Math.abs(deltaY * aspectRatio)) {
            newWidth = selectedBox.width - deltaX * 2;
            newHeight = newWidth / aspectRatio;
            offsetX = deltaX;
            offsetY = (selectedBox.height - newHeight) / 2;
          } else {
            newHeight = selectedBox.height - deltaY * 2;
            newWidth = newHeight * aspectRatio;
            offsetY = deltaY;
            offsetX = (selectedBox.width - newWidth) / 2;
          }
          break;
        
        case 'tr': // Top-right
          if (Math.abs(deltaX) > Math.abs(deltaY * aspectRatio)) {
            newWidth = selectedBox.width + deltaX * 2;
            newHeight = newWidth / aspectRatio;
            offsetX = -deltaX;
            offsetY = (selectedBox.height - newHeight) / 2;
          } else {
            newHeight = selectedBox.height - deltaY * 2;
            newWidth = newHeight * aspectRatio;
            offsetY = deltaY;
            offsetX = (selectedBox.width - newWidth) / 2;
          }
          break;
        
        case 'bl': // Bottom-left
          if (Math.abs(deltaX) > Math.abs(deltaY * aspectRatio)) {
            newWidth = selectedBox.width - deltaX * 2;
            newHeight = newWidth / aspectRatio;
            offsetX = deltaX;
            offsetY = (selectedBox.height - newHeight) / 2;
          } else {
            newHeight = selectedBox.height + deltaY * 2;
            newWidth = newHeight * aspectRatio;
            offsetY = -deltaY;
            offsetX = (selectedBox.width - newWidth) / 2;
          }
          break;
        
        case 'br': // Bottom-right
          if (Math.abs(deltaX) > Math.abs(deltaY * aspectRatio)) {
            newWidth = selectedBox.width + deltaX * 2;
            newHeight = newWidth / aspectRatio;
            offsetX = -deltaX;
            offsetY = (selectedBox.height - newHeight) / 2;
          } else {
            newHeight = selectedBox.height + deltaY * 2;
            newWidth = newHeight * aspectRatio;
            offsetY = -deltaY;
            offsetX = (selectedBox.width - newWidth) / 2;
          }
          break;
      }
      
      const minSize = 100;
      if (newWidth < minSize) {
        newWidth = minSize;
        newHeight = newWidth / aspectRatio;
      }
      
      const newCenterX = boxCenterX;
      const newCenterY = boxCenterY;
      
      const newX = newCenterX - newWidth / 2;
      const newY = newCenterY - newHeight / 2;
      
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
