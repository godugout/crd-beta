
import React from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  image: string | null;
  selectedAreas: EnhancedCropBoxProps[];
  setSelectedAreas: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  editorImgRef?: React.RefObject<HTMLImageElement>; // Added this missing prop
  handlePointerDown?: (e: React.PointerEvent) => void; // Added these missing handlers
  handlePointerMove?: (e: React.PointerEvent) => void;
  handlePointerUp?: () => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  image,
  selectedAreas,
  setSelectedAreas,
  selectedIndex,
  setSelectedIndex,
  editorImgRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) => {
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      {editorImgRef && (
        <img
          ref={editorImgRef}
          src={image || ''}
          className="hidden" // Hidden reference image
          alt="Editor reference"
        />
      )}
    </div>
  );
};

export default EditorCanvas;
