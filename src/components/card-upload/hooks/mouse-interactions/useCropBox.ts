
import { useState, useCallback } from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '../../cardDetection';

export const useCropBox = () => {
  const [cropBoxes, setCropBoxes] = useState<EnhancedCropBoxProps[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(-1);

  // Add a new crop box
  const addCropBox = useCallback((x: number, y: number, width: number, height: number) => {
    const newCropBox: EnhancedCropBoxProps = {
      id: `crop-${Date.now()}`,
      x,
      y,
      width,
      height,
      memorabiliaType: 'card' as MemorabiliaType, // Using 'card' as default instead of 'unknown'
      confidence: 0.5,
      color: '#00aaff',
      rotation: 0
    };
    
    setCropBoxes(prev => [...prev, newCropBox]);
    return cropBoxes.length; // Returns the index of the new crop box
  }, [cropBoxes.length]);

  // Update a crop box
  const updateCropBox = useCallback((index: number, updates: Partial<EnhancedCropBoxProps>) => {
    if (index < 0 || index >= cropBoxes.length) return;
    
    setCropBoxes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  }, [cropBoxes.length]);

  // Remove a crop box
  const removeCropBox = useCallback((index: number) => {
    if (index < 0 || index >= cropBoxes.length) return;
    
    setCropBoxes(prev => prev.filter((_, i) => i !== index));
    
    // Update selected index if needed
    if (selectedCropIndex === index) {
      setSelectedCropIndex(-1);
    } else if (selectedCropIndex > index) {
      setSelectedCropIndex(selectedCropIndex - 1);
    }
  }, [cropBoxes.length, selectedCropIndex]);

  return {
    cropBoxes,
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    addCropBox,
    updateCropBox,
    removeCropBox
  };
};
