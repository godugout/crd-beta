
import React from 'react';
import { MemorabiliaType } from './cardDetection';

export interface CropBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color: string;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
}

// Enhanced version with required memorabiliaType field for cropped items
export interface EnhancedCropBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  memorabiliaType: MemorabiliaType;
  confidence: number;
}

interface CropBoxComponentProps {
  box: CropBoxProps;
  isSelected: boolean;
  onClick: () => void;
}

const CropBox: React.FC<CropBoxComponentProps> = ({ box, isSelected, onClick }) => {
  const boxStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    border: `2px solid ${box.color}`,
    transform: box.rotation ? `rotate(${box.rotation}deg)` : 'none',
    transformOrigin: 'center',
    cursor: 'pointer',
    boxShadow: isSelected ? '0 0 0 2px blue, 0 0 10px rgba(0, 0, 255, 0.5)' : 'none',
    zIndex: isSelected ? 10 : 1
  };

  return (
    <div 
      className="crop-box" 
      style={boxStyle}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {isSelected && (
        <div className="crop-box-controls flex items-center justify-center h-full">
          <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
            {box.width.toFixed(0)} × {box.height.toFixed(0)}
          </div>
        </div>
      )}
    </div>
  );
};

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
  // Implementation for point-in-rotated-rectangle detection
  // Convert rotation from degrees to radians
  const rotation = (rotationDegrees || 0) * (Math.PI / 180);
  
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

export default CropBox;
