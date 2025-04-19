
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
  imageUrl?: string | null; // Required prop that was missing
  isDetecting?: boolean; // Required prop that was missing
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
  imageUrl,
  isDetecting = false
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
      
      {isDetecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
            <p>Detecting items...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorCanvas;
