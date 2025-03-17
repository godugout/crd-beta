
import React from 'react';

export interface CropBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
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
  
  // For rotated boxes, we need to transform the mouse coordinates
  // into the box's coordinate system
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  
  // Translate to origin
  const translatedX = x - centerX;
  const translatedY = y - centerY;
  
  // Rotate around origin (opposite direction of box rotation)
  const rotationInRadians = -box.rotation * Math.PI / 180;
  const rotatedX = translatedX * Math.cos(rotationInRadians) - translatedY * Math.sin(rotationInRadians);
  const rotatedY = translatedX * Math.sin(rotationInRadians) + translatedY * Math.cos(rotationInRadians);
  
  // Translate back
  const finalX = rotatedX + centerX;
  const finalY = rotatedY + centerY;
  
  // Calculate distances to corners in the rotated coordinate system
  const halfWidth = box.width / 2;
  const halfHeight = box.height / 2;
  
  // Check if cursor is on any of the resize handles
  // Top-left
  if (Math.abs(finalX - (centerX - halfWidth)) <= handleSize && 
      Math.abs(finalY - (centerY - halfHeight)) <= handleSize) return 'tl';
  
  // Top-right
  if (Math.abs(finalX - (centerX + halfWidth)) <= handleSize && 
      Math.abs(finalY - (centerY - halfHeight)) <= handleSize) return 'tr';
  
  // Bottom-left
  if (Math.abs(finalX - (centerX - halfWidth)) <= handleSize && 
      Math.abs(finalY - (centerY + halfHeight)) <= handleSize) return 'bl';
  
  // Bottom-right
  if (Math.abs(finalX - (centerX + halfWidth)) <= handleSize && 
      Math.abs(finalY - (centerY + halfHeight)) <= handleSize) return 'br';
  
  return null;
};

// Check if point is inside rotated rectangle
export const isPointInRotatedRect = (
  x: number, 
  y: number, 
  box: CropBoxProps
): boolean => {
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  
  // Translate to origin
  const translatedX = x - centerX;
  const translatedY = y - centerY;
  
  // Rotate around origin (opposite direction of box rotation)
  const rotationInRadians = -box.rotation * Math.PI / 180;
  const rotatedX = translatedX * Math.cos(rotationInRadians) - translatedY * Math.sin(rotationInRadians);
  const rotatedY = translatedX * Math.sin(rotationInRadians) + translatedY * Math.cos(rotationInRadians);
  
  // Check if point is in rectangle centered at origin
  const halfWidth = box.width / 2;
  const halfHeight = box.height / 2;
  
  return (
    rotatedX >= -halfWidth && 
    rotatedX <= halfWidth && 
    rotatedY >= -halfHeight && 
    rotatedY <= halfHeight
  );
};

// Draw crop box and handles on canvas
export const drawCropBox = (
  ctx: CanvasRenderingContext2D,
  box: CropBoxProps,
  isSelected: boolean
) => {
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const handleSize = 8;
  
  // Save context state
  ctx.save();
  
  // Move to center of box for rotation
  ctx.translate(centerX, centerY);
  ctx.rotate(box.rotation * Math.PI / 180);
  
  // Draw crop box (centered at origin)
  const halfWidth = box.width / 2;
  const halfHeight = box.height / 2;
  
  ctx.strokeStyle = isSelected ? '#2563eb' : 'rgba(37, 99, 235, 0.5)';
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.strokeRect(-halfWidth, -halfHeight, box.width, box.height);
  
  // Draw selection indicator
  if (isSelected) {
    // Draw corner resize handles
    ctx.fillStyle = '#2563eb';
    
    // Top-left
    ctx.fillRect(-halfWidth - handleSize/2, -halfHeight - handleSize/2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(halfWidth - handleSize/2, -halfHeight - handleSize/2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(-halfWidth - handleSize/2, halfHeight - handleSize/2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(halfWidth - handleSize/2, halfHeight - handleSize/2, handleSize, handleSize);
    
    // Draw a transparent overlay for selected crop
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.fillRect(-halfWidth, -halfHeight, box.width, box.height);
  }
  
  // Restore context to draw rotation handle without rotation applied
  ctx.restore();
  
  // Draw rotation handle (always on top, regardless of box rotation)
  if (isSelected) {
    // Calculate position for rotation handle (20px above the box)
    const rotateHandleDistance = 20;
    const rotateAngleRad = box.rotation * Math.PI / 180;
    
    // Calculate the position on the top edge of the box (center of the top edge)
    const topEdgeX = centerX;
    const topEdgeY = centerY - halfHeight;
    
    // Rotate this point around the center of the box
    const rotatedTopX = centerX + (topEdgeX - centerX) * Math.cos(rotateAngleRad) - (topEdgeY - centerY) * Math.sin(rotateAngleRad);
    const rotatedTopY = centerY + (topEdgeX - centerX) * Math.sin(rotateAngleRad) + (topEdgeY - centerY) * Math.cos(rotateAngleRad);
    
    // Calculate the position for the rotation handle (20px above the rotated top edge)
    const rotateHandleX = rotatedTopX - rotateHandleDistance * Math.sin(rotateAngleRad);
    const rotateHandleY = rotatedTopY - rotateHandleDistance * Math.cos(rotateAngleRad);
    
    // Draw a line connecting the rotation handle to the box
    ctx.beginPath();
    ctx.moveTo(rotatedTopX, rotatedTopY);
    ctx.lineTo(rotateHandleX, rotateHandleY);
    ctx.strokeStyle = '#2563eb';
    ctx.stroke();
    
    // Draw the rotation handle
    const rotateHandleRadius = 8;
    ctx.beginPath();
    ctx.arc(rotateHandleX, rotateHandleY, rotateHandleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#2563eb';
    ctx.fill();
  }
};

export default CropBox;
