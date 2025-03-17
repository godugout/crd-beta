
import { useState } from 'react';
import { CropBoxProps } from '../CropBox';

export interface ImageData {
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

export const useCropState = () => {
  const [cropBoxes, setCropBoxes] = useState<CropBoxProps[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const [imageData, setImageData] = useState<ImageData>({ 
    width: 0, 
    height: 0, 
    scale: 1,
    rotation: 0 
  });
  const [detectedCards, setDetectedCards] = useState<CropBoxProps[]>([]);
  
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
