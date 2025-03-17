
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
      
      // Calculate the center of the box for rotation calculations
      const centerX = selectedBox.x + selectedBox.width / 2;
      const centerY = selectedBox.y + selectedBox.height / 2;
      
      // Convert rotation angle to radians
      const angleRad = -selectedBox.rotation * Math.PI / 180;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      
      // Convert mouse coordinates to box's coordinate system
      const translateAndRotatePoint = (pointX: number, pointY: number) => {
        // Translate to origin
        const translatedX = pointX - centerX;
        const translatedY = pointY - centerY;
        
        // Rotate around origin (opposite to box rotation)
        const rotatedX = translatedX * cos - translatedY * sin;
        const rotatedY = translatedX * sin + translatedY * cos;
        
        return { rotatedX, rotatedY };
      };
      
      // Convert current mouse position to box's coordinate system
      const currentPoint = translateAndRotatePoint(x, y);
      
      // Convert drag start position to box's coordinate system
      const startPoint = translateAndRotatePoint(dragStart.x, dragStart.y);
      
      // Calculate the delta between current and start positions
      const deltaX = currentPoint.rotatedX - startPoint.rotatedX;
      const deltaY = currentPoint.rotatedY - startPoint.rotatedY;
      
      // Maintain aspect ratio (2.5:3.5)
      const aspectRatio = 2.5 / 3.5;
      
      // Initialize new dimensions and position offsets
      let newWidth = selectedBox.width;
      let newHeight = selectedBox.height;
      let newX = selectedBox.x;
      let newY = selectedBox.y;
      
      // Handle resize based on which corner is being dragged
      switch (isResizing) {
        case 'tl': // Top-left
          // Update width and height based on drag delta
          newWidth = Math.max(100, selectedBox.width - deltaX * 2);
          newHeight = newWidth / aspectRatio;
          
          // Calculate new position to maintain center
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
          
        case 'tr': // Top-right
          // Update width and height based on drag delta
          newWidth = Math.max(100, selectedBox.width + deltaX * 2);
          newHeight = newWidth / aspectRatio;
          
          // Calculate new position to maintain center
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
          
        case 'bl': // Bottom-left
          // Update width and height based on drag delta
          newWidth = Math.max(100, selectedBox.width - deltaX * 2);
          newHeight = newWidth / aspectRatio;
          
          // Calculate new position to maintain center
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
          
        case 'br': // Bottom-right
          // Update width and height based on drag delta
          newWidth = Math.max(100, selectedBox.width + deltaX * 2);
          newHeight = newWidth / aspectRatio;
          
          // Calculate new position to maintain center
          newX = centerX - newWidth / 2;
          newY = centerY - newHeight / 2;
          break;
      }
      
      // Update the crop box with new dimensions and position
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...selectedBox,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
      
      setCropBoxes(newBoxes);
      return { x, y }; // Return current mouse position
    }
    return dragStart; // Return unchanged if no resizing
  };

  return {
    isResizing,
    setIsResizing,
    handleResizing
  };
};
