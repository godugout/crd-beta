
import React from 'react';

export interface CropBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export const CropBox: React.FC<{
  box: CropBoxProps;
  isSelected: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}> = ({ box, isSelected, canvasRef }) => {
  // This is just a utility component, actual rendering happens in the canvas
  return null;
};

// Get resize handle from mouse position
export const getResizeHandle = (
  e: React.MouseEvent<HTMLCanvasElement>, 
  box: CropBoxProps, 
  handleSize: number = 8
): string | null => {
  if (!e.currentTarget) return null;
  
  const canvas = e.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.left;
  
  // Check if cursor is on any of the resize handles
  // Top-left
  if (Math.abs(x - box.x) <= handleSize && Math.abs(y - box.y) <= handleSize) return 'tl';
  // Top-right
  if (Math.abs(x - (box.x + box.width)) <= handleSize && Math.abs(y - box.y) <= handleSize) return 'tr';
  // Bottom-left
  if (Math.abs(x - box.x) <= handleSize && Math.abs(y - (box.y + box.height)) <= handleSize) return 'bl';
  // Bottom-right
  if (Math.abs(x - (box.x + box.width)) <= handleSize && Math.abs(y - (box.y + box.height)) <= handleSize) return 'br';
  
  return null;
};

// Draw crop box and handles on canvas
export const drawCropBox = (
  ctx: CanvasRenderingContext2D,
  box: CropBoxProps,
  isSelected: boolean
) => {
  // Draw crop box
  ctx.strokeStyle = isSelected ? '#2563eb' : 'rgba(37, 99, 235, 0.5)';
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  
  // Draw selection indicator
  if (isSelected) {
    // Draw corner resize handles
    const handleSize = 8;
    
    // Draw handles
    ctx.fillStyle = '#2563eb';
    // Top-left
    ctx.fillRect(box.x - handleSize/2, box.y - handleSize/2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(box.x + box.width - handleSize/2, box.y - handleSize/2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(box.x - handleSize/2, box.y + box.height - handleSize/2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(box.x + box.width - handleSize/2, box.y + box.height - handleSize/2, handleSize, handleSize);
    
    // Draw rotation handle
    const rotateHandleX = box.x + box.width / 2;
    const rotateHandleY = box.y - 20;
    const rotateHandleRadius = 8;
    
    // Draw a line connecting the rotation handle to the box
    ctx.beginPath();
    ctx.moveTo(rotateHandleX, box.y);
    ctx.lineTo(rotateHandleX, rotateHandleY);
    ctx.strokeStyle = '#2563eb';
    ctx.stroke();
    
    // Draw the rotation handle
    ctx.beginPath();
    ctx.arc(rotateHandleX, rotateHandleY, rotateHandleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#2563eb';
    ctx.fill();
    
    // Draw a transparent overlay for selected crop
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.fillRect(box.x, box.y, box.width, box.height);
  }
};

export default CropBox;
