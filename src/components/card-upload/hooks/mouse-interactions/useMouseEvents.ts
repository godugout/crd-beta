
import { CropBoxProps, getResizeHandle, isPointInRotatedRect } from '../../CropBox';
import { isRotationHandle } from './useRotation';
import { createNewCropBox, updateCursorStyle } from './useCropBox';
import { DragState, UseMouseInteractionsProps } from './types';

export const useMouseEvents = (
  props: UseMouseInteractionsProps,
  state: {
    dragStart: DragState;
    setDragStart: (state: DragState) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    isResizing: string | null;
    setIsResizing: (handle: string | null) => void;
    isRotating: boolean;
    setIsRotating: (isRotating: boolean) => void;
  },
  handlers: {
    handleDragging: (x: number, y: number, dragStart: DragState) => DragState;
    handleResizing: (x: number, y: number, dragStart: DragState) => DragState;
    handleRotation: (x: number, y: number, dragStart: DragState) => DragState;
  }
) => {
  const {
    canvasRef,
    cropBoxes,
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    editorImgRef
  } = props;

  const {
    dragStart,
    setDragStart,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    isRotating,
    setIsRotating
  } = state;

  const {
    handleDragging,
    handleResizing,
    handleRotation
  } = handlers;

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
    
    // Check if clicking on an existing crop box
    for (let i = 0; i < cropBoxes.length; i++) {
      const box = cropBoxes[i];
      
      if (isPointInRotatedRect(x, y, box)) {
        setSelectedCropIndex(i);
        setIsDragging(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    // Create a new crop box at the click position
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
    
    // Update cursor style based on interaction mode
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
    
    // Handle the active interaction mode
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
