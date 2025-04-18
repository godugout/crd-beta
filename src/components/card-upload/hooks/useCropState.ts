
import { useState } from 'react';
import { EnhancedCropBoxProps } from '../CropBox';

export interface ImageData {
  width: number;
  height: number;
  scale: number;
  rotation: number;
  url?: string; // Added url property
}

export const useCropState = () => {
  const [cropBoxes, setCropBoxes] = useState<EnhancedCropBoxProps[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const [imageData, setImageData] = useState<ImageData>({ 
    width: 0, 
    height: 0, 
    scale: 1,
    rotation: 0 
  });
  const [detectedCards, setDetectedCards] = useState<EnhancedCropBoxProps[]>([]);
  
  // Lock the main image by default
  const [imageIsLocked, setImageIsLocked] = useState(true);

  return {
    cropBoxes,
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    imageData,
    setImageData,
    detectedCards,
    setDetectedCards,
    imageIsLocked,
    setImageIsLocked
  };
};
