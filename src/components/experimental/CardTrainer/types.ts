
import { MemorabiliaType } from '../../card-upload/cardDetection';

export interface DetectedCard {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  confidence?: number;
  memorabiliaType?: MemorabiliaType;
}

export interface TracePoint {
  x: number;
  y: number;
}

export interface CardTrainerProps {
  // Add any props that CardDetectionTrainer might need
}

export interface ImageUploadProps {
  onSelectImage: (img: HTMLImageElement) => void;
}

export interface DetectionTabProps {
  uploadedImage: HTMLImageElement;
  detectedCards: DetectedCard[];
}

export interface TracingTabProps {
  uploadedImage: HTMLImageElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.RefObject<any>; // Use proper Fabric.js type if available
  displayWidth: number;
  displayHeight: number;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  manualTraces: DetectedCard[];
  onAddTrace: (trace: DetectedCard) => void;
  onClearTraces: () => void;
}

export interface ComparisonTabProps {
  uploadedImage: HTMLImageElement;
  detectedCards: DetectedCard[];
  manualTraces: DetectedCard[];
}
