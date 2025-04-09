
import { useCallback } from 'react';
import { Canvas } from 'fabric';
import { EnhancedCropBoxProps } from '../../cardDetection';

interface UseEventHandlersProps {
  canvas: Canvas | null;
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setSelectedCropIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useEventHandlers = ({
  canvas,
  setCropBoxes,
  setSelectedCropIndex
}: UseEventHandlersProps) => {
  
  // Handle selection of crop rectangles
  const handleSelectionCreated = useCallback((e: any) => {
    const selectedObject = e.selected?.[0];
    if (selectedObject && selectedObject.data?.cropBoxIndex !== undefined) {
      setSelectedCropIndex(selectedObject.data.cropBoxIndex);
    }
  }, [setSelectedCropIndex]);
  
  // Handle modification of crop rectangles
  const handleObjectModified = useCallback((e: any) => {
    if (!e.target || e.target.data?.cropBoxIndex === undefined) return;
    
    const index = e.target.data.cropBoxIndex;
    const rect = e.target;
    
    setCropBoxes(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          x: rect.left || 0,
          y: rect.top || 0,
          width: rect.width * (rect.scaleX || 1),
          height: rect.height * (rect.scaleY || 1),
          rotation: rect.angle || 0
        };
      }
      return updated;
    });
    
    // Reset scale after applying the new dimensions
    if (rect.scaleX !== 1 || rect.scaleY !== 1) {
      rect.set({
        width: rect.width * (rect.scaleX || 1),
        height: rect.height * (rect.scaleY || 1),
        scaleX: 1,
        scaleY: 1
      });
    }
  }, [setCropBoxes]);

  // Initialize event handlers
  const initializeEvents = useCallback(() => {
    if (!canvas) return;
    
    // Set up canvas event handlers
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionCreated);
    canvas.on('selection:cleared', () => setSelectedCropIndex(-1));
    
    // Return cleanup function
    return () => {
      canvas.off('object:modified');
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');
    };
  }, [canvas, handleObjectModified, handleSelectionCreated, setSelectedCropIndex]);
  
  return {
    initializeEvents,
    handleObjectModified,
    handleSelectionCreated
  };
};
