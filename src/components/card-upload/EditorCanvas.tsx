
import React from 'react';
import { EnhancedCropBoxProps } from './CropBox';
import { MemorabiliaType } from './cardDetection';
import { ImageData } from './hooks/useCropState';
import { useFabricCanvas } from './hooks/useFabricCanvas';

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
  const fabricRef = canvasRef; // We'll use the same ref
  
  // Use our enhanced Fabric.js canvas hook
  const { 
    addNewCropBox,
    removeCropBox,
    updateCropBoxType,
    canvasInstance
  } = useFabricCanvas({
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
