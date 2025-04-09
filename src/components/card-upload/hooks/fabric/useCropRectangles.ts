
import { useCallback, useEffect, useRef } from 'react';
import { Canvas, Rect } from 'fabric';
import { EnhancedCropBoxProps, MemorabiliaType } from '../../cardDetection';

interface UseCropRectanglesProps {
  canvas: Canvas | null;
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: React.Dispatch<React.SetStateAction<number>>;
  batchMode?: boolean;
  batchSelections?: number[];
  onToggleBatchSelection?: (index: number) => void;
  onMemorabiliaTypeChange?: (index: number, type: MemorabiliaType) => void;
}

export const useCropRectangles = ({
  canvas,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  batchMode = false,
  batchSelections = [],
  onToggleBatchSelection,
  onMemorabiliaTypeChange
}: UseCropRectanglesProps) => {
  const cropRectsRef = useRef<Rect[]>([]);
  
  // Function to render crop boxes on canvas
  const renderCropBoxes = useCallback(() => {
    if (!canvas) return;
    
    // Remove existing rectangles
    cropRectsRef.current.forEach(rect => canvas.remove(rect));
    cropRectsRef.current = [];
    
    // Create new rectangles for each crop box
    cropBoxes.forEach((box, index) => {
      const isSelected = index === selectedCropIndex;
      const isInBatch = batchSelections?.includes(index);
      
      const rect = new Rect({
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        angle: box.rotation || 0,
        fill: 'transparent',
        stroke: isInBatch ? '#4CAF50' : (isSelected ? '#FFCC00' : box.color || '#FF0000'),
        strokeWidth: isSelected ? 3 : 2,
        strokeDashArray: isSelected ? undefined : [5, 5],
        cornerColor: '#FFCC00',
        cornerSize: 12,
        cornerStyle: 'circle',
        transparentCorners: false,
        hasControls: isSelected,
        hasBorders: true,
        lockRotation: false,
        lockScalingFlip: true,
        padding: 5,
        cornerStrokeColor: '#FFCC00',
        borderScaleFactor: 1.3,
        borderOpacityWhenMoving: 0.8,
        borderColor: isSelected ? '#FFCC00' : (box.color || '#FF0000'),
      });
      
      // Store reference to the crop box index
      // We need to use type assertion since Fabric.js v6 doesn't have data property by default
      (rect as any).data = { 
        cropBoxIndex: index, 
        memorabiliaType: box.memorabiliaType 
      };
      
      canvas.add(rect);
      cropRectsRef.current.push(rect);
      
      if (isSelected) {
        canvas.setActiveObject(rect);
      }
    });
    
    canvas.renderAll();
  }, [canvas, cropBoxes, selectedCropIndex, batchSelections]);
  
  // Remove selected crop box
  const removeCropBox = useCallback(() => {
    if (selectedCropIndex < 0 || selectedCropIndex >= cropBoxes.length) return;
    
    setCropBoxes(prev => prev.filter((_, i) => i !== selectedCropIndex));
    setSelectedCropIndex(-1);
  }, [cropBoxes.length, selectedCropIndex, setCropBoxes, setSelectedCropIndex]);
  
  // Update crop box type
  const updateCropBoxType = useCallback((index: number, type: MemorabiliaType) => {
    if (index < 0 || index >= cropBoxes.length) return;
    
    setCropBoxes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], memorabiliaType: type };
      return updated;
    });
    
    if (onMemorabiliaTypeChange) {
      onMemorabiliaTypeChange(index, type);
    }
  }, [cropBoxes.length, setCropBoxes, onMemorabiliaTypeChange]);
  
  // Re-render when cropBoxes or selection changes
  useEffect(() => {
    renderCropBoxes();
  }, [cropBoxes, selectedCropIndex, batchSelections, renderCropBoxes]);
  
  return {
    renderCropBoxes,
    removeCropBox,
    updateCropBoxType,
    cropRectsRef
  };
};
