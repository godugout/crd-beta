
import React from 'react';

export interface CropBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// This is now just a type definition file since Fabric.js handles the rendering
const CropBox: React.FC<{
  box: CropBoxProps;
  isSelected: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}> = () => null;

export default CropBox;
