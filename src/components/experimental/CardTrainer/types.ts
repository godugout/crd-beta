
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

// Add properties needed by TabContent
export interface DetectionTabContentProps {
  image: string | null;
  detectedCards: DetectedCard[];
  isProcessing: boolean;
  showEdges: boolean;
  showContours: boolean;
  onDetectCards: () => void;
  onClearDetection: () => void;
  onToggleEdges: (value: boolean) => void;
  onToggleContours: (value: boolean) => void;
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

// Add properties needed by TabContent
export interface TracingTabContentProps {
  image: string | null;
  manualTraces: DetectedCard[];
  onAddTrace: () => void;
  onClearTraces: () => void;
  onCompareResults: () => void;
}

export interface ComparisonTabProps {
  uploadedImage: HTMLImageElement;
  detectedCards: DetectedCard[];
  manualTraces: DetectedCard[];
}

// Add properties needed by TabContent
export interface ComparisonTabContentProps {
  detectedCards: DetectedCard[];
  manualTraces: DetectedCard[];
  uploadedImage?: HTMLImageElement | null;
}

export interface TabContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  image: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  detectedCards: DetectedCard[];
  manualTraces: DetectedCard[];
  isProcessing: boolean;
  showEdges: boolean;
  showContours: boolean;
  onImageChange: (imageUrl: string) => void;
  onDetectCards: () => void;
  onAddTrace: () => void;
  onClearTraces: () => void;
  onCompareResults: () => void;
  onToggleEdges: (value: boolean) => void;
  onToggleContours: (value: boolean) => void;
  onClearDetection: () => void;
}
