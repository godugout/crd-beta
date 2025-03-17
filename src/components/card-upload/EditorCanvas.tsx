import React, { useState, useEffect } from 'react';
import { CropBoxProps, getResizeHandle, drawCropBox } from './CropBox';
import { ImageData } from './hooks/useCropState';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: CropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  editorImgRef: React.RefObject<HTMLImageElement>;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  editorImgRef
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Draw the editor with crop boxes
  useEffect(() => {
    if (canvasRef.current && editorImgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && editorImgRef.current) {
        const img = editorImgRef.current;
        
        // Calculate scaling to fit image in canvas
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const scale = Math.min(
          canvasWidth / img.naturalWidth,
          canvasHeight / img.naturalHeight
        );
        
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        const x = (canvasWidth - scaledWidth) / 2;
        const y = (canvasHeight - scaledHeight) / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw background
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Save context for image rotation
        ctx.save();
        
        // Center rotation
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(imageData.rotation * Math.PI / 180);
        
        // Draw image (centered)
        ctx.drawImage(
          img, 
          -scaledWidth / 2, 
          -scaledHeight / 2, 
          scaledWidth, 
          scaledHeight
        );
        
        // Restore context to draw crop boxes without rotation
        ctx.restore();
        
        // Draw all crop boxes
        cropBoxes.forEach((box, index) => {
          drawCropBox(ctx, box, index === selectedCropIndex);
        });
      }
    }
  }, [canvasRef, cropBoxes, editorImgRef, imageData.rotation, selectedCropIndex]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on a selected box's resize handle
    const selectedBox = cropBoxes[selectedCropIndex];
    const resizeHandle = getResizeHandle(e, selectedBox);
    
    if (resizeHandle) {
      setIsResizing(resizeHandle);
      setDragStart({ x, y });
      return;
    }
    
    // Check if clicking for rotation (near top-center of selected crop box)
    if (selectedBox) {
      const rotateHandleX = selectedBox.x + selectedBox.width / 2;
      const rotateHandleY = selectedBox.y - 20;
      const rotateHandleRadius = 12;
      
      if (
        Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= rotateHandleRadius
      ) {
        setIsRotating(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    // Check if clicking inside an existing crop box
    for (let i = 0; i < cropBoxes.length; i++) {
      const box = cropBoxes[i];
      
      if (
        x >= box.x && 
        x <= box.x + box.width && 
        y >= box.y && 
        y <= box.y + box.height
      ) {
        // Select this box
        setSelectedCropIndex(i);
        setIsDragging(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    // If clicked outside all boxes and there's an image loaded, create a new crop box
    if (editorImgRef.current) {
      // Create a new crop box with proper card ratio
      const newWidth = 150;
      const newHeight = newWidth * (3.5 / 2.5);
      
      const newBox: CropBoxProps = {
        x: x - newWidth / 2,
        y: y - newHeight / 2,
        width: newWidth,
        height: newHeight
      };
      
      const newBoxes = [...cropBoxes, newBox];
      setCropBoxes(newBoxes);
      setSelectedCropIndex(newBoxes.length - 1);
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update cursor style based on position
    if (!isDragging && !isResizing && !isRotating) {
      let cursorStyle = 'default';
      
      // Check for rotation handle
      const selectedBox = cropBoxes[selectedCropIndex];
      if (selectedBox) {
        const rotateHandleX = selectedBox.x + selectedBox.width / 2;
        const rotateHandleY = selectedBox.y - 20;
        const rotateHandleRadius = 12;
        
        if (
          Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= rotateHandleRadius
        ) {
          cursorStyle = 'grab';
        }
      }
      
      // If over an existing box or resize handle
      cropBoxes.forEach((box) => {
        const resizeHandle = getResizeHandle(e, box);
        if (resizeHandle) {
          switch (resizeHandle) {
            case 'tl':
            case 'br':
              cursorStyle = 'nwse-resize';
              break;
            case 'tr':
            case 'bl':
              cursorStyle = 'nesw-resize';
              break;
          }
        } else if (
          x >= box.x && 
          x <= box.x + box.width && 
          y >= box.y && 
          y <= box.y + box.height
        ) {
          cursorStyle = 'move';
        }
      });
      
      canvas.style.cursor = cursorStyle;
    }
    
    if (isRotating) {
      const selectedBox = cropBoxes[selectedCropIndex];
      const boxCenterX = selectedBox.x + selectedBox.width / 2;
      const boxCenterY = selectedBox.y + selectedBox.height / 2;
      
      // Calculate angle based on mouse position relative to box center
      const startAngle = Math.atan2(dragStart.y - boxCenterY, dragStart.x - boxCenterX);
      const currentAngle = Math.atan2(y - boxCenterY, x - boxCenterX);
      
      // Convert from radians to degrees
      const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      
      // Rotate the cropbox (not implemented yet, would need to add rotation property to CropBoxProps)
      // For now, just update the dragStart
      setDragStart({ x, y });
      
    } else if (isResizing) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      const newBoxes = [...cropBoxes];
      const box = { ...newBoxes[selectedCropIndex] };
      
      // Lock aspect ratio to 2.5:3.5
      const aspectRatio = 2.5 / 3.5;
      
      switch (isResizing) {
        case 'tl': // Top-left
          const newWidthTL = box.width - deltaX;
          const newHeightTL = newWidthTL / aspectRatio;
          
          box.x = box.x + box.width - newWidthTL;
          box.y = box.y + box.height - newHeightTL;
          box.width = newWidthTL;
          box.height = newHeightTL;
          break;
        
        case 'tr': // Top-right
          const newWidthTR = box.width + deltaX;
          const newHeightTR = newWidthTR / aspectRatio;
          
          box.y = box.y + box.height - newHeightTR;
          box.width = newWidthTR;
          box.height = newHeightTR;
          break;
        
        case 'bl': // Bottom-left
          const newWidthBL = box.width - deltaX;
          const newHeightBL = newWidthBL / aspectRatio;
          
          box.x = box.x + box.width - newWidthBL;
          box.width = newWidthBL;
          box.height = newHeightBL;
          break;
        
        case 'br': // Bottom-right
          const newWidthBR = box.width + deltaX;
          const newHeightBR = newWidthBR / aspectRatio;
          
          box.width = newWidthBR;
          box.height = newHeightBR;
          break;
      }
      
      // Enforce minimum size
      const minSize = 100;
      if (box.width < minSize) {
        const scale = minSize / box.width;
        box.width = minSize;
        box.height *= scale;
      }
      
      newBoxes[selectedCropIndex] = box;
      setCropBoxes(newBoxes);
      setDragStart({ x, y });
      
    } else if (isDragging) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      const newBoxes = [...cropBoxes];
      const box = newBoxes[selectedCropIndex];
      
      // Update crop box position, keeping it within canvas bounds
      box.x = Math.max(0, Math.min(canvas.width - box.width, box.x + deltaX));
      box.y = Math.max(0, Math.min(canvas.height - box.height, box.y + deltaY));
      
      setCropBoxes(newBoxes);
      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
    setIsRotating(false);
  };

  return (
    <canvas 
      ref={canvasRef}
      width={600}
      height={600}
      className="w-full h-full touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default EditorCanvas;
