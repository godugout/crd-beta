
import React from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  image?: string | null;
  selectedAreas: EnhancedCropBoxProps[];
  setSelectedAreas: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  editorImgRef?: React.RefObject<HTMLImageElement>;
  handlePointerDown?: (e: React.PointerEvent) => void;
  handlePointerMove?: (e: React.PointerEvent) => void;
  handlePointerUp?: () => void;
  imageUrl?: string | null; // Added this missing prop
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
  handlePointerUp,
  imageUrl
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
          src={imageUrl || image || ''}
          className="hidden" // Hidden reference image
          alt="Editor reference"
        />
      )}
    </div>
  );
};

export default EditorCanvas;
