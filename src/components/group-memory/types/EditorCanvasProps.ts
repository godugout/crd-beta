
import { MutableRefObject } from 'react';

export interface EditorCanvasProps {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  editorImgRef: MutableRefObject<HTMLImageElement>;
  isDrawing: boolean;
  currentTool: string;
  brushSize: number;
  brushColor: string;
  canvasWidth: number;
  canvasHeight: number;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  isProcessing: boolean; // Added required property
}
