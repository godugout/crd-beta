
import React, { useState } from 'react';
import { CropBoxProps, getResizeHandle, drawCropBox, isPointInRotatedRect } from './CropBox';
import { ImageData } from './hooks/useCropState';
import { useCanvasRenderer } from './hooks/useCanvasRenderer';
import { useMouseInteractions } from './hooks/useMouseInteractions';

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
  // Use the custom hooks for rendering and mouse interactions
  useCanvasRenderer(canvasRef, cropBoxes, editorImgRef, imageData, selectedCropIndex);
  
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useMouseInteractions(
    canvasRef,
    cropBoxes, 
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    editorImgRef
  );

  return (
    <canvas 
      ref={canvasRef}
      width={600}
      height={600}
      className="w-full h-full touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default EditorCanvas;
