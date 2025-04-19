
import React from 'react';

export interface EditorCanvasProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement>;
  editorImgRef: React.MutableRefObject<HTMLImageElement>;
  width: number;
  height: number;
  isDrawing: boolean;
  startX: number;
  startY: number;
  isProcessing: boolean; // Add this prop
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  editorImgRef,
  width,
  height,
  isDrawing,
  startX,
  startY,
  isProcessing,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) => {
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute top-0 left-0 z-10 cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      />
      <img
        ref={editorImgRef}
        className="max-w-full h-auto"
        alt="Editor canvas"
        style={{ opacity: isProcessing ? 0.5 : 1 }}
      />
    </div>
  );
};

export default EditorCanvas;
