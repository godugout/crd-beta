
import { useState } from 'react';
import { CropBoxProps } from '../CropBox';
import { ImageData } from './useCropState';
import { useInitFabricCanvas } from './fabric/useInitFabricCanvas';
import { useBackgroundImage } from './fabric/useBackgroundImage';
import { useCropRectangles } from './fabric/useCropRectangles';
import { useCreateCropBox } from './fabric/useCreateCropBox';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';

interface UseFabricCanvasProps {
  fabricRef: React.RefObject<HTMLCanvasElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  editorImgRef: React.RefObject<HTMLImageElement>;
  batchMode?: boolean;
  batchSelections?: number[];
  onToggleBatchSelection?: (index: number) => void;
  onMemorabiliaTypeChange?: (index: number, type: MemorabiliaType) => void;
}

export const useFabricCanvas = ({
  fabricRef,
  canvasRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  editorImgRef,
  batchMode = false,
  batchSelections = [],
  onToggleBatchSelection,
  onMemorabiliaTypeChange
}: UseFabricCanvasProps) => {
  
  // Initialize the canvas
  const canvas = useInitFabricCanvas(fabricRef);
  
  // Set up crop box creation
  const { addNewCropBox } = useCreateCropBox({
    canvas,
    setCropBoxes,
    setSelectedCropIndex,
    cropBoxesLength: cropBoxes.length
  });
  
  // Load background image
  useBackgroundImage({
    canvas,
    editorImgRef,
    imageData,
    addNewCropBox,
    cropBoxesLength: cropBoxes.length
  });
  
  // Set up crop rectangles
  useCropRectangles({
    canvas,
    cropBoxes,
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    batchMode,
    batchSelections,
    onToggleBatchSelection
  });
  
  return { addNewCropBox };
};
