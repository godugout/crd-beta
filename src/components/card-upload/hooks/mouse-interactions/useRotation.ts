
import { useState } from 'react';
import { CropBoxProps } from '../../CropBox';
import { DragState } from './types';

export const isRotationHandle = (
  x: number,
  y: number,
  box: CropBoxProps
): boolean => {
  const rotateHandleDistance = 20;
  const rotateHandleRadius = 10;
  
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const halfHeight = box.height / 2;
  
  const rotateAngleRad = box.rotation * Math.PI / 180;
  const topEdgeX = centerX;
  const topEdgeY = centerY - halfHeight;
  
  const rotatedTopX = centerX + (topEdgeX - centerX) * Math.cos(rotateAngleRad) - (topEdgeY - centerY) * Math.sin(rotateAngleRad);
  const rotatedTopY = centerY + (topEdgeX - centerX) * Math.sin(rotateAngleRad) + (topEdgeY - centerY) * Math.cos(rotateAngleRad);
  
  const rotateHandleX = rotatedTopX - rotateHandleDistance * Math.sin(rotateAngleRad);
  const rotateHandleY = rotatedTopY - rotateHandleDistance * Math.cos(rotateAngleRad);
  
  return Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= rotateHandleRadius;
};

export const useRotation = (
  cropBoxes: CropBoxProps[],
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>,
  selectedCropIndex: number
) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleRotation = (x: number, y: number, dragStart: DragState) => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const selectedBox = {...cropBoxes[selectedCropIndex]};
      const boxCenterX = selectedBox.x + selectedBox.width / 2;
      const boxCenterY = selectedBox.y + selectedBox.height / 2;
      
      const startAngle = Math.atan2(dragStart.y - boxCenterY, dragStart.x - boxCenterX);
      const currentAngle = Math.atan2(y - boxCenterY, x - boxCenterX);
      
      let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...selectedBox,
        rotation: (selectedBox.rotation + angleDiff) % 360
      };
      
      setCropBoxes(newBoxes);
      return { x, y };
    }
    return dragStart;
  };

  return {
    isRotating,
    setIsRotating,
    handleRotation
  };
};
