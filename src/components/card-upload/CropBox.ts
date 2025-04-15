
import { MemorabiliaType } from './cardDetection';

export interface CropBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
}

export interface EnhancedCropBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
}

// Export utility functions for ResizeHandle detection and rotation calculations
export const getResizeHandle = (x: number, y: number, box: CropBoxProps, handleSize: number = 10): string | null => {
  // Implementation for resize handle detection
  const edges = {
    top: Math.abs(y - box.y) < handleSize,
    bottom: Math.abs(y - (box.y + box.height)) < handleSize,
    left: Math.abs(x - box.x) < handleSize,
    right: Math.abs(x - (box.x + box.width)) < handleSize,
  };

  if (edges.top && edges.left) return 'tl';
  if (edges.top && edges.right) return 'tr';
  if (edges.bottom && edges.left) return 'bl';
  if (edges.bottom && edges.right) return 'br';
  if (edges.top) return 't';
  if (edges.bottom) return 'b';
  if (edges.left) return 'l';
  if (edges.right) return 'r';

  return null;
};

// Function to check if a point is inside a rotated rectangle
export const isPointInRotatedRect = (
  x: number, 
  y: number, 
  boxX: number, 
  boxY: number, 
  boxWidth: number, 
  boxHeight: number, 
  rotationDegrees: number
): boolean => {
  // Convert rotation from degrees to radians
  const rotation = rotationDegrees * (Math.PI / 180);
  
  // Translate point to origin relative to rectangle center
  const centerX = boxX + boxWidth / 2;
  const centerY = boxY + boxHeight / 2;
  
  // Translate point to be relative to the center of the rectangle
  const translatedX = x - centerX;
  const translatedY = y - centerY;
  
  // Rotate point in opposite direction of rectangle rotation
  const rotatedX = translatedX * Math.cos(-rotation) - translatedY * Math.sin(-rotation);
  const rotatedY = translatedX * Math.sin(-rotation) + translatedY * Math.cos(-rotation);
  
  // Check if rotated point is inside the non-rotated rectangle
  return (
    Math.abs(rotatedX) <= boxWidth / 2 && 
    Math.abs(rotatedY) <= boxHeight / 2
  );
};

// Create a default export of a CropBox component or class
// This is needed because the index.ts file is trying to import default from this file
const CropBox = {
  getResizeHandle,
  isPointInRotatedRect
};

export default CropBox;
