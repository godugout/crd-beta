import { useState } from 'react';
import { CropBoxProps, getResizeHandle, isPointInRotatedRect } from '../CropBox';

interface DragState {
  x: number;
  y: number;
}

export const useMouseInteractions = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cropBoxes: CropBoxProps[], 
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>,
  selectedCropIndex: number,
  setSelectedCropIndex: (index: number) => void,
  editorImgRef: React.RefObject<HTMLImageElement>
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState<DragState>({ x: 0, y: 0 });

  const isRotationHandle = (
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

  const createNewCropBox = (x: number, y: number) => {
    if (editorImgRef.current) {
      const newWidth = 150;
      const newHeight = newWidth * (3.5 / 2.5);
      
      const newBox: CropBoxProps = {
        x: x - newWidth / 2,
        y: y - newHeight / 2,
        width: newWidth,
        height: newHeight,
        rotation: 0
      };
      
      const newBoxes = [...cropBoxes, newBox];
      setCropBoxes(newBoxes);
      setSelectedCropIndex(newBoxes.length - 1);
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleRotation = (x: number, y: number) => {
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
      setDragStart({ x, y });
    }
  };

  const handleResizing = (x: number, y: number) => {
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
      setDragStart({ x, y });
    }
  };

  const handleDragging = (x: number, y: number) => {
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
      setDragStart({ x, y });
    }
  };

  const updateCursorStyle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!isDragging && !isResizing && !isRotating && selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      let cursorStyle = 'default';
      
      const selectedBox = cropBoxes[selectedCropIndex];
      if (selectedBox && isRotationHandle(x, y, selectedBox)) {
        cursorStyle = 'grab';
      }
      
      cropBoxes.forEach((box) => {
        const resizeHandle = getResizeHandle(e, box);
        if (resizeHandle) {
          switch (resizeHandle) {
            case 'tl':
            case 'br':
              cursorStyle = 'nwse-resize';
              break;
            case 'tr':
            case 'bl':
              cursorStyle = 'nesw-resize';
              break;
          }
        } else if (isPointInRotatedRect(x, y, box)) {
          cursorStyle = 'move';
        }
      });
      
      canvas.style.cursor = cursorStyle;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const selectedBox = cropBoxes[selectedCropIndex];
      const resizeHandle = getResizeHandle(e, selectedBox);
      
      if (resizeHandle) {
        setIsResizing(resizeHandle);
        setDragStart({ x, y });
        return;
      }
      
      if (isRotationHandle(x, y, selectedBox)) {
        setIsRotating(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    for (let i = 0; i < cropBoxes.length; i++) {
      const box = cropBoxes[i];
      
      if (isPointInRotatedRect(x, y, box)) {
        setSelectedCropIndex(i);
        setIsDragging(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    createNewCropBox(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateCursorStyle(e);
    
    if (isRotating) {
      handleRotation(x, y);
    } else if (isResizing) {
      handleResizing(x, y);
    } else if (isDragging) {
      handleDragging(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
    setIsRotating(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
