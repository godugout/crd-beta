
import React from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  image: string | null;
  selectedAreas: EnhancedCropBoxProps[];
  setSelectedAreas: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  image,
  selectedAreas,
  setSelectedAreas,
  selectedIndex,
  setSelectedIndex
}) => {
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default EditorCanvas;
