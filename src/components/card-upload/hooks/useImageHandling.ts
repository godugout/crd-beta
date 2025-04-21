import { useState, useEffect, useCallback, useRef } from 'react';
import { ImageData } from './useCropState';
import { EnhancedCropBoxProps, detectCardsInImage, MemorabiliaType } from '../cardDetection';

export interface UseImageHandlingOptions {
  showEditor: boolean;
  setImageData: React.Dispatch<React.SetStateAction<ImageData>>;
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setDetectedCards?: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  setSelectedCropIndex?: React.Dispatch<React.SetStateAction<number>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  batchProcessingMode?: boolean;
  enabledMemorabiliaTypes?: MemorabiliaType[];
  editorImage?: string | null; // Add editorImage property
  minimumConfidence?: number;
}

export const useImageHandling = ({
  showEditor,
  setImageData,
  setCropBoxes,
  setDetectedCards = () => {},
  setSelectedCropIndex = () => {},
  canvasRef,
  editorImgRef,
  batchProcessingMode = false,
  enabledMemorabiliaTypes = ['card'],
  editorImage = null, // Include default value
  minimumConfidence = 0.5
}: UseImageHandlingOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detectionRunning, setDetectionRunning] = useState(false);
  
  const detectItems = useCallback(async () => {
    if (!canvasRef.current || !editorImgRef.current || !editorImgRef.current.complete) {
      console.log('Canvas, image or image data not ready');
      return;
    }

    setDetectionRunning(true);
    try {
      // Get the image dimensions
      const img = editorImgRef.current;
      const result = await detectCardsInImage({
        imageElement: img,
        debugMode: true,
        canvas: canvasRef.current,
        enabledTypes: enabledMemorabiliaTypes
      });
      
      setCropBoxes(result);
      setDetectedCards(result);
      
      // Select the first high confidence crop if available
      const highConfidenceCrops = result.filter(box => 
        (box.confidence || 0) > minimumConfidence
      );
      
      if (highConfidenceCrops.length > 0) {
        setSelectedCropIndex(result.indexOf(highConfidenceCrops[0]));
      } else if (result.length > 0) {
        setSelectedCropIndex(0);
      }
      
      console.log(`Detected ${result.length} items, ${highConfidenceCrops.length} with high confidence`);
      return result;
    } catch (error) {
      console.error('Error detecting items:', error);
      return [];
    } finally {
      setDetectionRunning(false);
    }
  }, [
    canvasRef, 
    editorImgRef, 
    enabledMemorabiliaTypes, 
    setCropBoxes, 
    setDetectedCards, 
    setSelectedCropIndex,
    minimumConfidence
  ]);

  const rotateImage = useCallback(() => {
    setImageData((prevData) => {
      const newRotation = (prevData.rotation || 0) + 90;
      return {
        ...prevData,
        rotation: newRotation % 360
      };
    });
  }, [setImageData]);

  useEffect(() => {
    if (!showEditor || !editorImgRef.current) return;
    
    const img = editorImgRef.current;
    const handleImageLoad = () => {
      setImageData(prev => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight
      }));
    };
    
    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener('load', handleImageLoad);
    }
    
    return () => {
      img.removeEventListener('load', handleImageLoad);
    };
  }, [showEditor, editorImgRef, setImageData]);

  return {
    detectItems,
    rotateImage,
    isLoading,
    detectionRunning
  };
};
