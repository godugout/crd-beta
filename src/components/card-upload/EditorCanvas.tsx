
import React, { useRef } from 'react';
import { CropBoxProps } from './CropBox';
import { ImageData } from './hooks/useCropState';
import { useFabricCanvas } from './hooks/useFabricCanvas';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: CropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  editorImgRef: React.RefObject<HTMLImageElement>;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  editorImgRef
}) => {
  const fabricRef = useRef<HTMLCanvasElement>(null);
  
  // Use our refactored Fabric.js canvas hook
  useFabricCanvas({
    fabricRef,
    canvasRef,
    cropBoxes, 
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    imageData,
    editorImgRef
  });

  return (
    <canvas 
      ref={fabricRef}
      className="w-full h-full touch-none"
    />
  );
};

export default EditorCanvas;
