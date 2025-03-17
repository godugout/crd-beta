
import { useState } from 'react';
import { CropBoxProps } from '../CropBox';
import { ImageData } from './useCropState';
import { useInitFabricCanvas } from './fabric/useInitFabricCanvas';
import { useBackgroundImage } from './fabric/useBackgroundImage';
import { useCropRectangles } from './fabric/useCropRectangles';
import { useCreateCropBox } from './fabric/useCreateCropBox';

interface UseFabricCanvasProps {
  fabricRef: React.RefObject<HTMLCanvasElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: CropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  editorImgRef: React.RefObject<HTMLImageElement>;
}

export const useFabricCanvas = ({
  fabricRef,
  canvasRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  editorImgRef
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
    setSelectedCropIndex
  });
  
  return { addNewCropBox };
};
