
import { CropBoxProps } from '../../CropBox';

export interface DragState {
  x: number;
  y: number;
}

export interface UseMouseInteractionsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: CropBoxProps[]; 
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  editorImgRef: React.RefObject<HTMLImageElement>;
}

export interface MouseHandlers {
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
}
