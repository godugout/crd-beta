
import React, { useEffect } from 'react';
import { EnhancedCropBoxProps } from '@/components/card-upload/cardDetection';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  imageUrl: string | null;
  selectedAreas: EnhancedCropBoxProps[];
  isDetecting: boolean;
  isProcessing: boolean;
  handlePointerDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  handlePointerMove?: (e: React.MouseEvent | React.TouchEvent) => void;
  handlePointerUp?: () => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  editorImgRef,
  imageUrl,
  selectedAreas,
  isDetecting,
  isProcessing,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) => {
  // Setup event handlers
  useEffect(() => {
    // Make sure we clean up event listeners if component unmounts
    return () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.onmousedown = null;
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        canvas.onmouseleave = null;
        canvas.ontouchstart = null;
        canvas.ontouchmove = null;
        canvas.ontouchend = null;
      }
    };
  }, []);

  return (
    <div className="relative flex-grow border rounded-md overflow-hidden bg-gray-100">
      {/* Hidden image for reference */}
      <img 
        ref={editorImgRef}
        src={imageUrl || ''}
        alt="Editor reference"
        className="hidden"
        crossOrigin="anonymous"
      />
      
      {/* Canvas for interactive editing */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-grab touch-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
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
