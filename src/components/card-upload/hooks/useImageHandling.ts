
import { useState, useEffect } from 'react';
import { CropBoxProps } from '../CropBox';
import { detectCardsInImage } from '../cardDetection';
import { ImageData } from './useCropState';

export interface UseImageHandlingProps {
  editorImage: string | null;
  showEditor: boolean;
  setImageData: React.Dispatch<React.SetStateAction<ImageData>>;
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  setDetectedCards: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  setSelectedCropIndex: (index: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  batchProcessingMode?: boolean;
}

export const useImageHandling = ({
  editorImage,
  showEditor,
  setImageData,
  setCropBoxes,
  setDetectedCards,
  setSelectedCropIndex,
  canvasRef,
  editorImgRef,
  batchProcessingMode = false
}: UseImageHandlingProps) => {
  
  // Initialize canvas and detect cards when image is loaded
  useEffect(() => {
    if (showEditor && editorImage && canvasRef.current && editorImgRef.current) {
      const img = editorImgRef.current;
      
      img.onload = () => {
        // Check if dimensions match standard card ratio (2.5:3.5)
        const ratio = img.width / img.height;
        const standardRatio = 2.5 / 3.5;
        const isStandardRatio = Math.abs(ratio - standardRatio) < 0.1;
        
        // Update image data
        setImageData({
          width: img.width,
          height: img.height,
          scale: 1,
          rotation: 0
        });
        
        // Detect cards or faces in the image based on mode
        const detected = detectCardsInImage(img, isStandardRatio, canvasRef.current, batchProcessingMode);
        setDetectedCards(detected);
        
        if (batchProcessingMode) {
          // In batch mode, use all detected items
          setCropBoxes(detected);
        } else {
          // In single mode, start with the first detection or default box
          setCropBoxes(detected.length > 0 ? [detected[0]] : [{
            x: 50,
            y: 50,
            width: 150,
            height: 210, // 3.5/2.5 ratio
            rotation: 0
          }]);
        }
        
        setSelectedCropIndex(0);
      };
    }
  }, [
    showEditor, 
    editorImage, 
    setDetectedCards, 
    setCropBoxes, 
    setImageData, 
    setSelectedCropIndex, 
    canvasRef, 
    editorImgRef, 
    batchProcessingMode
  ]);

  const rotateImage = () => {
    setImageData(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  return {
    rotateImage
  };
};
