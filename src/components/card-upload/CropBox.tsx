
import React from 'react';
import { MemorabiliaType } from './cardDetection';

export interface CropBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation?: number;
  selected?: boolean;
  batchSelected?: boolean;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
}

// Enhanced version with required memorabiliaType and confidence
export interface EnhancedCropBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation?: number;
  selected?: boolean;
  batchSelected?: boolean;
  memorabiliaType: MemorabiliaType;
  confidence: number;
}

export interface CropBoxStyle {
  left: string;
  top: string;
  width: string;
  height: string;
  borderColor: string;
  transform?: string;
}

// This component no longer renders anything as Fabric.js handles rendering
const CropBox: React.FC<{
  box: CropBoxProps;
  isSelected: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}> = () => null;

// Helper functions needed by other components
export const getResizeHandle = (
  e: React.MouseEvent<HTMLCanvasElement>, 
  box: CropBoxProps
): string | null => {
  return null; // Since we're using Fabric.js now, this is just a stub
};

export const isPointInRotatedRect = (
  x: number, 
  y: number, 
  box: CropBoxProps
): boolean => {
  return false; // Since we're using Fabric.js now, this is just a stub
};

export const drawCropBox = (
  ctx: CanvasRenderingContext2D,
  box: CropBoxProps,
  isSelected: boolean
): void => {
  // Stub function since we're using Fabric.js now
};

export default CropBox;
