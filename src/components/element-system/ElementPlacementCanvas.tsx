
import React, { useRef, useEffect, useState } from 'react';
import { CardElement } from '@/lib/types/cardElements';
import { placementEngine } from '@/lib/elements/PlacementEngine';

interface ElementPlacementCanvasProps {
  elements: CardElement[];
  onElementSelect: (element: CardElement | null) => void;
  onElementMove: (element: CardElement, newPosition: { x: number; y: number }) => void;
  onElementResize: (element: CardElement, newSize: { width: number; height: number }) => void;
  onElementRotate: (element: CardElement, newRotation: number) => void;
  selectedElementId: string | null;
  canvasWidth?: number;
  canvasHeight?: number;
  gridSize?: number;
  showGrid?: boolean;
  snapToGrid?: boolean;
}

const ElementPlacementCanvas: React.FC<ElementPlacementCanvasProps> = ({
  elements,
  onElementSelect,
  onElementMove,
  onElementResize,
  onElementRotate,
  selectedElementId,
  canvasWidth = 400,
  canvasHeight = 560,
  gridSize = 10,
  showGrid = true,
  snapToGrid = true,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const [rotateStartAngle, setRotateStartAngle] = useState(0);
  
  // Initialize the placement engine with the canvas element
  useEffect(() => {
    if (canvasRef.current) {
      placementEngine.setCanvas(canvasRef.current);
      placementEngine.setGridSize(gridSize);
    }
  }, [gridSize]);
  
  // Get selected element
  const selectedElement = elements.find(el => el.id === selectedElementId) || null;
  
  // Handle mouse down on element
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    element: CardElement
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Select the element
    onElementSelect(element);
    
    // Check if clicking on a resize handle
    if ((event.target as HTMLElement).classList.contains('resize-handle')) {
      setIsResizing(true);
      setResizeStartPos({ x: mouseX, y: mouseY });
      setResizeStartSize({ width: element.size.width, height: element.size.height });
      return;
    }
    
    // Check if clicking on a rotation handle
    if ((event.target as HTMLElement).classList.contains('rotate-handle')) {
      setIsRotating(true);
      
      // Calculate angle between element center and mouse position
      const elementCenterX = element.position.x;
      const elementCenterY = element.position.y;
      const startAngle = Math.atan2(mouseY - elementCenterY, mouseX - elementCenterX);
      
      setRotateStartAngle(startAngle - (element.position.rotation * Math.PI / 180));
      return;
    }
    
    // Normal dragging
    setIsDragging(true);
    setDragOffset({
      x: mouseX - element.position.x,
      y: mouseY - element.position.y,
    });
  };
  
  // Handle mouse move
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && !isResizing && !isRotating) return;
    if (!selectedElement) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Handle dragging
    if (isDragging) {
      let newX = mouseX - dragOffset.x;
      let newY = mouseY - dragOffset.y;
      
      // Apply snap to grid
      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }
      
      onElementMove(selectedElement, { x: newX, y: newY });
    }
    
    // Handle resizing
    else if (isResizing) {
      const deltaX = mouseX - resizeStartPos.x;
      const deltaY = mouseY - resizeStartPos.y;
      
      // Calculate new size (maintain aspect ratio if shift key is pressed)
      let newWidth = resizeStartSize.width + deltaX;
      let newHeight = resizeStartSize.height + deltaY;
      
      if (event.shiftKey && selectedElement.size.aspectRatio > 0) {
        // Maintain aspect ratio
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / selectedElement.size.aspectRatio;
        } else {
          newWidth = newHeight * selectedElement.size.aspectRatio;
        }
      }
      
      // Apply minimum size
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      // Apply snap to grid for size
      if (snapToGrid) {
        newWidth = Math.round(newWidth / gridSize) * gridSize;
        newHeight = Math.round(newHeight / gridSize) * gridSize;
      }
      
      onElementResize(selectedElement, { width: newWidth, height: newHeight });
    }
    
    // Handle rotating
    else if (isRotating) {
      const elementCenterX = selectedElement.position.x;
      const elementCenterY = selectedElement.position.y;
      
      // Calculate current angle
      const angle = Math.atan2(mouseY - elementCenterY, mouseX - elementCenterX);
      
      // Convert radians to degrees and normalize to 0-360
      let degrees = ((angle - rotateStartAngle) * 180 / Math.PI) % 360;
      if (degrees < 0) degrees += 360;
      
      // Snap to 15 degree increments if shift is pressed
      if (event.shiftKey) {
        degrees = Math.round(degrees / 15) * 15;
      }
      
      onElementRotate(selectedElement, degrees);
    }
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };
  
  // Handle canvas click (deselect)
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains('canvas-container')) {
      onElementSelect(null);
    }
  };
  
  // Render the grid lines
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const gridLines = [];
    
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasHeight}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasWidth}
          y2={y}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
      );
    }
    
    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={canvasWidth}
        height={canvasHeight}
      >
        {gridLines}
      </svg>
    );
  };
  
  // Render elements
  const renderElements = () => {
    return elements.map(element => {
      const isSelected = element.id === selectedElementId;
      
      // Generate element style
      const style: React.CSSProperties = {
        position: 'absolute',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        transform: `translate(-50%, -50%) rotate(${element.position.rotation}deg)`,
        opacity: element.style?.opacity ?? 1,
        zIndex: element.position.z,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: isSelected ? '2px solid #3b82f6' : 'none',
        boxShadow: isSelected ? '0 0 0 1px rgba(59, 130, 246, 0.5)' : 'none'
      };
      
      // Generate content based on element type
      let content;
      switch (element.type) {
        case 'sticker':
        case 'logo':
        case 'badge':
          content = (
            <img 
              src={element.assetUrl} 
              alt={element.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              draggable={false}
            />
          );
          break;
          
        case 'frame':
          // For frames, we can have different styles based on frameType
          content = (
            <img 
              src={element.assetUrl} 
              alt={element.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                pointerEvents: 'none' 
              }}
              draggable={false}
            />
          );
          break;
          
        case 'overlay':
          // For overlays, apply the blend mode
          content = (
            <img 
              src={element.assetUrl} 
              alt={element.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                pointerEvents: 'none',
                mixBlendMode: (element.style?.blendMode as any) || 'normal'
              }}
              draggable={false}
            />
          );
          break;
      }
      
      return (
        <div
          key={element.id}
          className="element"
          style={style}
          onMouseDown={(e) => handleMouseDown(e, element)}
        >
          {content}
          
          {/* Render controls for selected element */}
          {isSelected && (
            <>
              {/* Resize handles */}
              <div 
                className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-white border border-blue-500 rounded-full cursor-se-resize -mr-2 -mb-2"
                onMouseDown={(e) => handleMouseDown(e, element)}
              />
              
              {/* Rotation handle */}
              <div 
                className="rotate-handle absolute top-0 left-1/2 w-4 h-4 bg-white border border-blue-500 rounded-full cursor-grab -translate-x-1/2 -mt-8"
                style={{ transform: 'translateX(-50%)' }}
                onMouseDown={(e) => handleMouseDown(e, element)}
              />
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div
      ref={canvasRef}
      className="canvas-container relative bg-white shadow-md overflow-hidden"
      style={{ width: canvasWidth, height: canvasHeight }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {renderGrid()}
      {renderElements()}
    </div>
  );
};

export default ElementPlacementCanvas;
