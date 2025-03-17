import React, { useState, useEffect } from 'react';
import { CropBoxProps, getResizeHandle, drawCropBox, isPointInRotatedRect } from './CropBox';
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

  useEffect(() => {
    if (canvasRef.current && editorImgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && editorImgRef.current) {
        const img = editorImgRef.current;
        
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
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.save();
        
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(imageData.rotation * Math.PI / 180);
        
        ctx.drawImage(
          img, 
          -scaledWidth / 2, 
          -scaledHeight / 2, 
          scaledWidth, 
          scaledHeight
        );
        
        ctx.restore();
        
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
    
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const selectedBox = cropBoxes[selectedCropIndex];
      const resizeHandle = getResizeHandle(e, selectedBox);
      
      if (resizeHandle) {
        setIsResizing(resizeHandle);
        setDragStart({ x, y });
        return;
      }
      
      const rotateHandleDistance = 20;
      const rotateHandleRadius = 10;
      
      const centerX = selectedBox.x + selectedBox.width / 2;
      const centerY = selectedBox.y + selectedBox.height / 2;
      const halfHeight = selectedBox.height / 2;
      
      const rotateAngleRad = selectedBox.rotation * Math.PI / 180;
      const topEdgeX = centerX;
      const topEdgeY = centerY - halfHeight;
      
      const rotatedTopX = centerX + (topEdgeX - centerX) * Math.cos(rotateAngleRad) - (topEdgeY - centerY) * Math.sin(rotateAngleRad);
      const rotatedTopY = centerY + (topEdgeX - centerX) * Math.sin(rotateAngleRad) + (topEdgeY - centerY) * Math.cos(rotateAngleRad);
      
      const rotateHandleX = rotatedTopX - rotateHandleDistance * Math.sin(rotateAngleRad);
      const rotateHandleY = rotatedTopY - rotateHandleDistance * Math.cos(rotateAngleRad);
      
      if (Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= rotateHandleRadius) {
        setIsRotating(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    for (let i = 0; i < cropBoxes.length; i++) {
      const box = cropBoxes[i];
      
      if (isPointInRotatedRect(x, y, box)) {
        setSelectedCropIndex(i);
        setIsDragging(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    if (editorImgRef.current) {
      const newWidth = 150;
      const newHeight = newWidth * (3.5 / 2.5);
      
      const newBox: CropBoxProps = {
        x: x - newWidth / 2,
        y: y - newHeight / 2,
        width: newWidth,
        height: newHeight,
        rotation: 0
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
    
    if (!isDragging && !isResizing && !isRotating && selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      let cursorStyle = 'default';
      
      const selectedBox = cropBoxes[selectedCropIndex];
      if (selectedBox) {
        const centerX = selectedBox.x + selectedBox.width / 2;
        const centerY = selectedBox.y + selectedBox.height / 2;
        const halfHeight = selectedBox.height / 2;
        const rotateHandleDistance = 20;
        const rotateHandleRadius = 10;
        
        const rotateAngleRad = selectedBox.rotation * Math.PI / 180;
        const topEdgeX = centerX;
        const topEdgeY = centerY - halfHeight;
        
        const rotatedTopX = centerX + (topEdgeX - centerX) * Math.cos(rotateAngleRad) - (topEdgeY - centerY) * Math.sin(rotateAngleRad);
        const rotatedTopY = centerY + (topEdgeX - centerX) * Math.sin(rotateAngleRad) + (topEdgeY - centerY) * Math.cos(rotateAngleRad);
        
        const rotateHandleX = rotatedTopX - rotateHandleDistance * Math.sin(rotateAngleRad);
        const rotateHandleY = rotatedTopY - rotateHandleDistance * Math.cos(rotateAngleRad);
        
        if (Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= rotateHandleRadius) {
          cursorStyle = 'grab';
        }
      }
      
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
        } else if (isPointInRotatedRect(x, y, box)) {
          cursorStyle = 'move';
        }
      });
      
      canvas.style.cursor = cursorStyle;
    }
    
    if (isRotating && selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const selectedBox = {...cropBoxes[selectedCropIndex]};
      const boxCenterX = selectedBox.x + selectedBox.width / 2;
      const boxCenterY = selectedBox.y + selectedBox.height / 2;
      
      const startAngle = Math.atan2(dragStart.y - boxCenterY, dragStart.x - boxCenterX);
      const currentAngle = Math.atan2(y - boxCenterY, x - boxCenterX);
      
      let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...selectedBox,
        rotation: (selectedBox.rotation + angleDiff) % 360
      };
      
      setCropBoxes(newBoxes);
      setDragStart({ x, y });
      
    } else if (isResizing && selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      const newBoxes = [...cropBoxes];
      const box = { ...newBoxes[selectedCropIndex] };
      
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
      
      const minSize = 100;
      if (box.width < minSize) {
        const scale = minSize / box.width;
        box.width = minSize;
        box.height *= scale;
      }
      
      newBoxes[selectedCropIndex] = box;
      setCropBoxes(newBoxes);
      setDragStart({ x, y });
      
    } else if (isDragging && selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      const newBoxes = [...cropBoxes];
      const box = {...newBoxes[selectedCropIndex]};
      
      box.x = Math.max(0, Math.min(canvas.width - box.width, box.x + deltaX));
      box.y = Math.max(0, Math.min(canvas.height - box.height, box.y + deltaY));
      
      newBoxes[selectedCropIndex] = box;
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
