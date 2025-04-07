
import { useState, useEffect } from 'react';
import { EnhancedCropBoxProps, MemorabiliaType, detectCardsInImage } from '../cardDetection';
import { ImageData } from './useCropState';

export interface UseImageHandlingProps {
  editorImage: string | null;
  showEditor: boolean;
  setImageData: React.Dispatch<React.SetStateAction<ImageData>>;
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setDetectedCards: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setSelectedCropIndex: (index: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  batchProcessingMode?: boolean;
  enabledMemorabiliaTypes?: MemorabiliaType[];
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
  batchProcessingMode = false,
  enabledMemorabiliaTypes = ['card', 'ticket', 'program', 'autograph', 'face', 'unknown']
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
        const detected = detectCardsInImage(
          img, 
          isStandardRatio, 
          canvasRef.current, 
          batchProcessingMode,
          !batchProcessingMode // Only detect memorabilia in individual mode
        );
        
        // Filter results by enabled types
        const filteredDetected = detected.filter(item => 
          enabledMemorabiliaTypes.includes(item.memorabiliaType || 'unknown')
        );
        
        setDetectedCards(filteredDetected);
        
        if (batchProcessingMode) {
          // In batch mode, use all detected items
          setCropBoxes(filteredDetected);
        } else {
          // In single mode, start with the first detection or default box
          setCropBoxes(filteredDetected.length > 0 ? [filteredDetected[0]] : [{
            id: 1,
            x: 50,
            y: 50,
            width: 150,
            height: 210, // 3.5/2.5 ratio
            rotation: 0,
            color: '#00FF00',
            memorabiliaType: 'unknown',
            confidence: 0.5
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
    batchProcessingMode,
    enabledMemorabiliaTypes
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
