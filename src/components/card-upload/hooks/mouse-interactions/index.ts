
import { useState } from 'react';
import { useRotation } from './useRotation';
import { useResizing } from './useResizing';
import { useDragging } from './useDragging';
import { useMouseEvents } from './useMouseEvents';
import { UseMouseInteractionsProps, MouseHandlers, DragState } from './types';

export const useMouseInteractions = (props: UseMouseInteractionsProps): MouseHandlers => {
  const [dragStart, setDragStart] = useState<DragState>({ x: 0, y: 0 });
  
  // Use isolated hooks for each interaction type
  const { isDragging, setIsDragging, handleDragging } = useDragging(
    props.canvasRef,
    props.cropBoxes,
    props.setCropBoxes,
    props.selectedCropIndex
  );
  
  const { isResizing, setIsResizing, handleResizing } = useResizing(
    props.cropBoxes,
    props.setCropBoxes,
    props.selectedCropIndex
  );
  
  const { isRotating, setIsRotating, handleRotation } = useRotation(
    props.cropBoxes,
    props.setCropBoxes,
    props.selectedCropIndex
  );

  // Combine all state and handlers into a single mouse events hook
  return useMouseEvents(
    props,
    {
      dragStart,
      setDragStart,
      isDragging,
      setIsDragging,
      isResizing,
      setIsResizing,
      isRotating,
      setIsRotating
    },
    {
      handleDragging,
      handleResizing,
      handleRotation
    }
  );
};
