
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
  // Initialize Fabric.js event handlers
  const initializeEvents = useCallback(() => {
    if (!canvas) return () => {};
    
    // Object Modified handler - update crop boxes state when objects are moved/resized
    const handleObjectModified = (e: any) => {
      const target = e.target;
      if (!target) return;
      
      // Get the crop box index from the object's data
      const cropBoxIndex = (target as any).data?.cropBoxIndex;
      if (cropBoxIndex === undefined) return;
      
      // Update the crop box with new position, size, and angle
      setCropBoxes(prev => {
        const updated = [...prev];
        updated[cropBoxIndex] = {
          ...updated[cropBoxIndex],
          x: target.left || 0,
          y: target.top || 0,
          width: target.width! * target.scaleX!,
          height: target.height! * target.scaleY!,
          rotation: target.angle || 0
        };
        return updated;
      });
    };
    
    // Object Selected handler - update selected crop box index
    const handleObjectSelected = (e: any) => {
      const target = e.selected?.[0] || e.target;
      if (!target) return;
      
      // Get the crop box index from the object's data
      const cropBoxIndex = (target as any).data?.cropBoxIndex;
      if (cropBoxIndex === undefined) return;
      
      setSelectedCropIndex(cropBoxIndex);
    };
    
    // Canvas cleared handler - deselect any crop box
    const handleSelectionCleared = () => {
      setSelectedCropIndex(-1);
    };
    
    // Add event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleObjectSelected);
    canvas.on('selection:updated', handleObjectSelected);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    // Return cleanup function to remove event listeners
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleObjectSelected);
      canvas.off('selection:updated', handleObjectSelected);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, setCropBoxes, setSelectedCropIndex]);
  
  return { initializeEvents };
};
