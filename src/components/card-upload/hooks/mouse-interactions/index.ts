
import { useState } from 'react';
import { CropBoxProps, getResizeHandle, isPointInRotatedRect } from '../../CropBox';
import { useRotation, isRotationHandle } from './useRotation';
import { useResizing } from './useResizing';
import { useDragging } from './useDragging';
import { createNewCropBox, updateCursorStyle } from './useCropBox';
import { UseMouseInteractionsProps, MouseHandlers, DragState } from './types';

export const useMouseInteractions = ({
  canvasRef,
  cropBoxes, 
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  editorImgRef
}: UseMouseInteractionsProps): MouseHandlers => {
  const [dragStart, setDragStart] = useState<DragState>({ x: 0, y: 0 });
  
  const { isDragging, setIsDragging, handleDragging } = useDragging(
    canvasRef,
    cropBoxes,
    setCropBoxes,
    selectedCropIndex
  );
  
  const { isResizing, setIsResizing, handleResizing } = useResizing(
    cropBoxes,
    setCropBoxes,
    selectedCropIndex
  );
  
  const { isRotating, setIsRotating, handleRotation } = useRotation(
    cropBoxes,
    setCropBoxes,
    selectedCropIndex
  );

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
    
    const newDragStart = createNewCropBox(
      x, 
      y, 
      cropBoxes, 
      setCropBoxes, 
      setSelectedCropIndex, 
      setIsDragging, 
      editorImgRef
    );
    setDragStart(newDragStart);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateCursorStyle(
      e, 
      canvasRef, 
      cropBoxes, 
      selectedCropIndex, 
      isDragging, 
      isResizing, 
      isRotating, 
      isRotationHandle, 
      getResizeHandle, 
      isPointInRotatedRect
    );
    
    let newDragStart = dragStart;
    
    if (isRotating) {
      newDragStart = handleRotation(x, y, dragStart);
    } else if (isResizing) {
      newDragStart = handleResizing(x, y, dragStart);
    } else if (isDragging) {
      newDragStart = handleDragging(x, y, dragStart);
    }
    
    if (newDragStart !== dragStart) {
      setDragStart(newDragStart);
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
