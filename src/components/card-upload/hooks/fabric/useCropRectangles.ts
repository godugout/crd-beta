
import { useCallback, useEffect } from 'react';
import { Canvas, Rect, util, IEvent, FabricObject } from 'fabric';
import { EnhancedCropBoxProps } from '../../CropBox';

// Define types for the fabric events
type TPointerEvent = MouseEvent | TouchEvent;
type BasicTransformEvent<E extends TPointerEvent> = IEvent<E>;

interface UseCropRectanglesProps {
  canvas: Canvas | null;
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useCropRectangles = ({
  canvas,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex
}: UseCropRectanglesProps) => {
  
  // Function to render crop boxes on canvas
  const renderCropBoxes = useCallback(() => {
    if (!canvas) return;
    
    // Clear existing rect objects
    const existingRects = canvas.getObjects().filter(obj => obj.type === 'rect');
    existingRects.forEach(rect => canvas.remove(rect));
    
    // Create and add new rects based on cropBoxes state
    cropBoxes.forEach((box, index) => {
      const isSelected = index === selectedCropIndex;
      
      const rect = new Rect({
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        angle: box.rotation || 0,
        fill: 'transparent',
        stroke: isSelected ? '#FFCC00' : box.color,
        strokeWidth: isSelected ? a : 1,
        strokeDashArray: isSelected ? [5, 5] : undefined,
        cornerColor: '#FFCC00',
        cornerSize: 8,
        transparentCorners: false,
        hasControls: isSelected,
        hasBorders: true,
        selectable: true,
        hoverCursor: 'pointer',
        // Store original index for reference
        data: { 
          cropBoxIndex: index,
          memorabiliaType: box.memorabiliaType,
          confidence: box.confidence
        }
      });
      
      canvas.add(rect);
      if (isSelected) {
        canvas.setActiveObject(rect);
      }
    });
    
    canvas.renderAll();
  }, [canvas, cropBoxes, selectedCropIndex]);
  
  // Initialize event handlers
  const initializeEvents = useCallback(() => {
    if (!canvas) return;
    
    // Handle selection change
    canvas.on('selection:created', (e) => {
      const selectedObject = e.selected?.[0];
      if (selectedObject && selectedObject.data?.cropBoxIndex !== undefined) {
        setSelectedCropIndex(selectedObject.data.cropBoxIndex);
      }
    });
    
    canvas.on('selection:updated', (e) => {
      const selectedObject = e.selected?.[0];
      if (selectedObject && selectedObject.data?.cropBoxIndex !== undefined) {
        setSelectedCropIndex(selectedObject.data.cropBoxIndex);
      }
    });
    
    canvas.on('selection:cleared', () => {
      setSelectedCropIndex(-1);
    });
    
    // Handle object modifications
    canvas.on('object:modified', (e) => {
      if (!e.target) return;
      
      const modifiedObject = e.target;
      if (modifiedObject.data?.cropBoxIndex !== undefined) {
        const index = modifiedObject.data.cropBoxIndex;
        
        setCropBoxes(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            x: modifiedObject.left || updated[index].x,
            y: modifiedObject.top || updated[index].y,
            width: modifiedObject.width! * (modifiedObject.scaleX || 1),
            height: modifiedObject.height! * (modifiedObject.scaleY || 1),
            rotation: modifiedObject.angle || 0
          };
          return updated;
        });
      }
    });
    
    // Update during transformations for smoother experience
    canvas.on('object:scaling', (e) => {
      if (!e.target) return;
      
      const scalingObject = e.target;
      if (scalingObject.data?.cropBoxIndex !== undefined) {
        const index = scalingObject.data.cropBoxIndex;
        
        // Update in real-time while scaling
        setCropBoxes(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            width: scalingObject.width! * (scalingObject.scaleX || 1),
            height: scalingObject.height! * (scalingObject.scaleY || 1)
          };
          return updated;
        });
      }
    });
    
    canvas.on('object:moving', (e) => {
      if (!e.target) return;
      
      const movingObject = e.target;
      if (movingObject.data?.cropBoxIndex !== undefined) {
        const index = movingObject.data.cropBoxIndex;
        
        // Update in real-time while moving
        setCropBoxes(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            x: movingObject.left || updated[index].x,
            y: movingObject.top || updated[index].y
          };
          return updated;
        });
      }
    });
    
    canvas.on('object:rotating', (e) => {
      if (!e.target) return;
      
      const rotatingObject = e.target;
      if (rotatingObject.data?.cropBoxIndex !== undefined) {
        const index = rotatingObject.data.cropBoxIndex;
        
        // Update in real-time while rotating
        setCropBoxes(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            rotation: rotatingObject.angle || 0
          };
          return updated;
        });
      }
    });
    
  }, [canvas, setCropBoxes, setSelectedCropIndex]);
  
  // Update cropbox type
  const updateCropBoxType = useCallback((index: number, memorabiliaType: string, confidence: number) => {
    setCropBoxes(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          memorabiliaType: memorabiliaType as any,
          confidence
        };
        
        // Also update the data if the object exists on canvas
        const objects = canvas?.getObjects() || [];
        const matchingRect = objects.find(obj => obj.data?.cropBoxIndex === index);
        if (matchingRect) {
          matchingRect.data = {
            ...matchingRect.data,
            memorabiliaType,
            confidence
          };
        }
      }
      return updated;
    });
    
    canvas?.renderAll();
  }, [canvas, setCropBoxes]);
  
  // Delete a cropbox
  const deleteCropBox = useCallback((index: number) => {
    // First remove it from the canvas
    if (canvas) {
      const objects = canvas.getObjects();
      const matchingRect = objects.find(obj => obj.data?.cropBoxIndex === index);
      if (matchingRect) {
        canvas.remove(matchingRect);
      }
    }
    
    // Then remove from state
    setCropBoxes(prev => prev.filter((_, i) => i !== index));
    
    // Also deselect if it was selected
    if (selectedCropIndex === index) {
      setSelectedCropIndex(-1);
    }
    
    canvas?.renderAll();
  }, [canvas, setCropBoxes, selectedCropIndex, setSelectedCropIndex]);
  
  // Initial render and cleanup
  useEffect(() => {
    if (canvas) {
      // Initialize events
      initializeEvents();
      
      // Initial render
      renderCropBoxes();
      
      // Cleanup on unmount or canvas change
      return () => {
        canvas.off('selection:created');
        canvas.off('selection:updated');
        canvas.off('selection:cleared');
        canvas.off('object:modified');
        canvas.off('object:scaling');
        canvas.off('object:moving');
        canvas.off('object:rotating');
      };
    }
  }, [canvas, initializeEvents, renderCropBoxes]);
  
  // Re-render when cropBoxes or selection changes
  useEffect(() => {
    renderCropBoxes();
  }, [cropBoxes, selectedCropIndex, renderCropBoxes]);
  
  return {
    updateCropBoxType,
    deleteCropBox
  };
};

// Fix the typo in the code
const a = 2;
