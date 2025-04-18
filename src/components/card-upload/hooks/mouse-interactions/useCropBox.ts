
import { useState } from 'react';
import { CropBoxProps } from '../../CropBox';

export const useCropBox = () => {
  const [cropBoxes, setCropBoxes] = useState<CropBoxProps[]>([]);

  const addCropBox = (x: number, y: number, width: number, height: number) => {
    const newBox: CropBoxProps = {
      id: crypto.randomUUID(), // Change to string ID using UUID
      x,
      y,
      width,
      height,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'unknown', // Set a default memorabiliaType
      confidence: 0.5 // Set a default confidence score
    };
    setCropBoxes([...cropBoxes, newBox]);
    return cropBoxes.length; // Return the index of the newly added box
  };

  const updateCropBox = (index: number, updates: Partial<CropBoxProps>) => {
    setCropBoxes(prevBoxes => {
      const updatedBoxes = [...prevBoxes];
      if (updatedBoxes[index]) {
        updatedBoxes[index] = { ...updatedBoxes[index], ...updates };
      }
      return updatedBoxes;
    });
  };

  const removeCropBox = (index: number) => {
    setCropBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== index));
  };

  const rotateClockwise = (index: number) => {
    setCropBoxes(prevBoxes => {
      const updatedBoxes = [...prevBoxes];
      if (updatedBoxes[index]) {
        updatedBoxes[index] = { ...updatedBoxes[index], rotation: (updatedBoxes[index].rotation + 15) % 360 };
      }
      return updatedBoxes;
    });
  };

  const rotateCounterClockwise = (index: number) => {
    setCropBoxes(prevBoxes => {
      const updatedBoxes = [...prevBoxes];
      if (updatedBoxes[index]) {
        updatedBoxes[index] = { ...updatedBoxes[index], rotation: (updatedBoxes[index].rotation - 15 + 360) % 360 };
      }
      return updatedBoxes;
    });
  };

  return {
    cropBoxes,
    setCropBoxes,
    addCropBox,
    updateCropBox,
    removeCropBox,
    rotateClockwise,
    rotateCounterClockwise
  };
};
