
/**
 * Interface for detected face information
 */
export interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks: {
    positions: { x: number, y: number }[];
  };
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
}

/**
 * Options for face detection
 */
export interface FaceDetectionOptions {
  /** Minimum confidence threshold for detections (0-1) */
  minConfidence?: number;
  /** Whether to include landmarks in detection results */
  withLandmarks?: boolean;
  /** Whether to include expressions in detection results */
  withExpressions?: boolean;
  /** Maximum number of faces to detect (0 = unlimited) */
  maxResults?: number;
}

/**
 * Types of facial expressions that can be detected
 */
export type FacialExpression = 
  | 'neutral' 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'fearful' 
  | 'disgusted' 
  | 'surprised';

/**
 * Face detection status
 */
export enum FaceDetectionStatus {
  INITIALIZING = 'initializing',
  READY = 'ready',
  PROCESSING = 'processing',
  ERROR = 'error'
}

/**
 * Error information for face detection
 */
export interface FaceDetectionError {
  code: string;
  message: string;
  details?: any;
}
