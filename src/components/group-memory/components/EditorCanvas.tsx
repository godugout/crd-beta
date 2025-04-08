
import React, { useEffect } from 'react';
import { EnhancedCropBoxProps } from '@/components/card-upload/cardDetection';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  imageUrl: string | null;
  selectedAreas: EnhancedCropBoxProps[];
  isDetecting: boolean;
  isProcessing: boolean;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  editorImgRef,
  imageUrl,
  selectedAreas,
  isDetecting,
  isProcessing
}) => {
  return (
    <div className="relative flex-grow border rounded-md overflow-hidden bg-gray-100">
      {/* Hidden image for reference */}
      <img 
        ref={editorImgRef}
        src={imageUrl || ''}
        alt="Editor reference"
        className="hidden"
      />
      
      {/* Canvas for interactive editing */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Loading overlay */}
      {(isDetecting || isProcessing) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>{isDetecting ? "Detecting..." : "Processing..."}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorCanvas;
