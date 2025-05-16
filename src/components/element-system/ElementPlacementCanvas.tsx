
import React, { useState, useRef, useEffect } from 'react';
import { CardElement } from '@/lib/types/cardElements';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';

interface ElementPosition {
  x: number;
  y: number;
  z?: number;
  rotation?: number; // Added rotation property
}

interface ElementPlacementCanvasProps {
  selectedElements: CardElement[];
  initialPositions?: Record<string, ElementPosition>;
  canvasWidth?: number;
  canvasHeight?: number;
  onElementsChange?: (elements: CardElement[]) => void;
}

const ElementPlacementCanvas: React.FC<ElementPlacementCanvasProps> = ({
  selectedElements = [],
  initialPositions = {},
  canvasWidth = 800,
  canvasHeight = 600,
  onElementsChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elementPositions, setElementPositions] = useState<Record<string, ElementPosition>>(initialPositions);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Ensure we have positions for all selected elements
  useEffect(() => {
    const newPositions = { ...elementPositions };
    let updated = false;
    
    selectedElements.forEach(element => {
      if (!newPositions[element.id]) {
        // Initialize position for new element
        newPositions[element.id] = {
          x: Math.random() * (canvasWidth / 2) + canvasWidth / 4,
          y: Math.random() * (canvasHeight / 2) + canvasHeight / 4,
          z: Object.keys(newPositions).length,
          rotation: 0
        };
        updated = true;
      }
    });
    
    if (updated) {
      setElementPositions(newPositions);
    }
  }, [selectedElements]);
  
  // Handle element selection
  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveElementId(elementId);
  };
  
  // Handle canvas click (deselect element)
  const handleCanvasClick = () => {
    setActiveElementId(null);
  };
  
  // Start dragging an element
  const handleMouseDown = (elementId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only process left clicks
    
    e.stopPropagation();
    setActiveElementId(elementId);
    setIsDragging(true);
    
    const element = document.getElementById(`element-${elementId}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !activeElementId || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - canvasRect.left - dragOffset.x) / zoom;
    const newY = (e.clientY - canvasRect.top - dragOffset.y) / zoom;
    
    // Update position
    setElementPositions(prev => ({
      ...prev,
      [activeElementId]: {
        ...prev[activeElementId],
        x: Math.max(0, Math.min(canvasWidth, newX)),
        y: Math.max(0, Math.min(canvasHeight, newY))
      }
    }));
  };
  
  // End dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Rotate active element
  const rotateElement = () => {
    if (!activeElementId) return;
    
    setElementPositions(prev => ({
      ...prev,
      [activeElementId]: {
        ...prev[activeElementId],
        rotation: ((prev[activeElementId].rotation || 0) + 45) % 360
      }
    }));
    
    toast.info(`Rotated element by 45 degrees`);
  };
  
  // Delete active element
  const deleteElement = () => {
    if (!activeElementId) return;
    
    // Find the element to get its name for the toast
    const element = selectedElements.find(el => el.id === activeElementId);
    
    // Remove from positions
    const newPositions = { ...elementPositions };
    delete newPositions[activeElementId];
    setElementPositions(newPositions);
    
    // Update selected elements if callback provided
    if (onElementsChange) {
      onElementsChange(selectedElements.filter(el => el.id !== activeElementId));
    }
    
    setActiveElementId(null);
    
    toast.success(`${element?.name || 'Element'} removed from canvas`);
  };
  
  // Zoom controls
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {selectedElements.length} element{selectedElements.length !== 1 ? 's' : ''} available
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={zoomOut} disabled={zoom <= 0.5}>
            <ZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          
          <span className="flex items-center px-2">
            {Math.round(zoom * 100)}%
          </span>
          
          <Button size="sm" variant="outline" onClick={zoomIn} disabled={zoom >= 2}>
            <ZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
          
          {activeElementId && (
            <>
              <Button size="sm" variant="outline" onClick={rotateElement}>
                <RotateCw className="h-4 w-4 mr-1" />
                Rotate
              </Button>
              
              <Button size="sm" variant="destructive" onClick={deleteElement}>
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden"
        style={{ 
          width: '100%', 
          height: `${canvasHeight}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            margin: '0 auto'
          }}
        >
          {selectedElements.map(element => {
            const position = elementPositions[element.id] || { x: 50, y: 50, z: 0, rotation: 0 };
            
            return (
              <div
                id={`element-${element.id}`}
                key={element.id}
                className={`absolute cursor-grab transition-shadow ${
                  activeElementId === element.id 
                    ? 'ring-2 ring-blue-500 shadow-lg z-10' 
                    : ''
                }`}
                style={{ 
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  zIndex: activeElementId === element.id ? 100 : (position.z || 0),
                  transform: `rotate(${position.rotation || 0}deg)`,
                  transformOrigin: 'center center'
                }}
                onClick={(e) => handleElementClick(element.id, e)}
                onMouseDown={(e) => handleMouseDown(element.id, e)}
              >
                <img 
                  src={element.imageUrl} 
                  alt={element.name}
                  className="max-w-[150px] max-h-[150px] pointer-events-none"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedElements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No elements selected. Add elements from the library to place them on the canvas.
        </div>
      )}
    </div>
  );
};

export default ElementPlacementCanvas;
