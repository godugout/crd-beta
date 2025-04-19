
import React from 'react';

export interface EditorCanvasProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement>;
  editorImgRef: React.MutableRefObject<HTMLImageElement>;
  width: number;
  height: number;
  isDrawing: boolean;
  startX: number;
  startY: number;
  isProcessing: boolean; // Added this prop
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  imageUrl?: string; // Add optional imageUrl prop
  selectedAreas?: any[]; // Add optional selectedAreas prop
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
  handlePointerUp,
  imageUrl,
  selectedAreas
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
        src={imageUrl}
        style={{ opacity: isProcessing ? 0.5 : 1 }}
      />
      {selectedAreas?.length > 0 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {selectedAreas.length} areas selected
        </div>
      )}
    </div>
  );
};

export default EditorCanvas;
