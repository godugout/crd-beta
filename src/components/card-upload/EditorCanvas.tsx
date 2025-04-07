
import React, { useRef } from 'react';
import { CropBoxProps } from './CropBox';
import { ImageData } from './hooks/useCropState';
import { useFabricCanvas } from './hooks/useFabricCanvas';
import { EnhancedCropBoxProps, MemorabiliaType } from './cardDetection';

interface EditorCanvasProps {
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

const EditorCanvas: React.FC<EditorCanvasProps> = ({
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
    editorImgRef,
    batchMode,
    batchSelections,
    onToggleBatchSelection,
    onMemorabiliaTypeChange
  });

  return (
    <canvas 
      ref={fabricRef}
      className="w-full h-full touch-none"
    />
  );
};

export default EditorCanvas;
