
import { useState, useCallback } from 'react';
import { CropBoxProps } from '../../CropBox';

export const useCropBox = () => {
  const [cropBoxes, setCropBoxes] = useState<CropBoxProps[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(-1);
  
  // Add a new crop box
  const addCropBox = useCallback((x: number, y: number, width: number, height: number) => {
    const newBox: CropBoxProps = {
      id: cropBoxes.length + 1,
      x,
      y,
      width,
      height,
      rotation: 0,
      color: '#00FF00'
    };
    
    setCropBoxes(prev => [...prev, newBox]);
    setSelectedCropIndex(cropBoxes.length);
    return newBox;
  }, [cropBoxes]);
  
  // Update a crop box
  const updateCropBox = useCallback((index: number, updates: Partial<CropBoxProps>) => {
    setCropBoxes(prev => {
      const newBoxes = [...prev];
      if (newBoxes[index]) {
        newBoxes[index] = { ...newBoxes[index], ...updates };
      }
      return newBoxes;
    });
  }, []);
  
  // Remove a crop box
  const removeCropBox = useCallback((index: number) => {
    setCropBoxes(prev => {
      const newBoxes = prev.filter((_, i) => i !== index);
      return newBoxes;
    });
    
    if (selectedCropIndex === index) {
      setSelectedCropIndex(-1);
    } else if (selectedCropIndex > index) {
      setSelectedCropIndex(prev => prev - 1);
    }
  }, [selectedCropIndex]);
  
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
