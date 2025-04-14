import React, { forwardRef, useEffect, useState } from 'react';
import { CardDesignState, CardLayer } from './types/cardTypes';

interface CardPreviewCanvasProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses: string;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<CardLayer>) => void;
}

const CardPreviewCanvas = forwardRef<HTMLDivElement, CardPreviewCanvasProps>(
  ({ cardData, layers, activeLayerId, effectClasses, onLayerSelect, onLayerUpdate }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
    const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
    
    // Handle mouse down on layer
    const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
      e.preventDefault();
      if (activeLayerId !== layerId) {
        onLayerSelect(layerId);
      }
      
      setIsDragging(true);
      setDraggedLayerId(layerId);
      setDragStartPos({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    // Handle mouse move for dragging
    useEffect(() => {
      if (!isDragging || !draggedLayerId) return;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!draggedLayerId) return;
        
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;
        
        // Find the layer
        const layer = layers.find(l => l.id === draggedLayerId);
        if (!layer) return;
        
        // Update position
        onLayerUpdate(draggedLayerId, {
          position: {
            x: layer.position.x + dx,
            y: layer.position.y + dy,
            z: layer.position.z
          }
        });
        
        // Reset drag start position
        setDragStartPos({
          x: e.clientX,
          y: e.clientY
        });
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedLayerId(null);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, draggedLayerId, dragStartPos, layers, onLayerUpdate]);
    
    // Render a layer based on its type
    const renderLayer = (layer: CardLayer) => {
      if (!layer.visible) return null;
      
      const layerStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${layer.position.x}px`,
        top: `${layer.position.y}px`,
        zIndex: layer.position.z,
        opacity: layer.opacity,
        transform: `rotate(${layer.rotation}deg)`,
        cursor: 'move',
        width: typeof layer.size.width === 'number' ? `${layer.size.width}px` : layer.size.width,
        height: typeof layer.size.height === 'number' ? `${layer.size.height}px` : layer.size.height,
        border: activeLayerId === layer.id ? '1px solid #3b82f6' : 'none',
      };
      
      switch (layer.type) {
        case 'image':
          return (
            <div
              key={layer.id}
              style={layerStyle}
              onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
              className="group"
            >
              {typeof layer.content === 'string' && (
                <img
                  src={layer.content}
                  alt="Layer"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          );
        
        case 'text':
          return (
            <div
              key={layer.id}
              style={layerStyle}
              onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
              className="group"
            >
              {typeof layer.content === 'string' ? layer.content : 'Text'}
            </div>
          );
        
        case 'shape':
          return (
            <div
              key={layer.id}
              style={{
                ...layerStyle,
                backgroundColor: 'blue'
              }}
              onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
              className="group"
            >
            </div>
          );
        
        default:
          return null;
      }
    };
    
    return (
      <div ref={ref} className="relative w-[250px] h-[350px] mx-auto bg-white overflow-hidden rounded-lg shadow-lg">
        {/* Base card with background color and image */}
        <div 
          className={`absolute inset-0 ${effectClasses}`} 
          style={{
            borderRadius: cardData.borderRadius,
            backgroundColor: cardData.backgroundColor,
            borderColor: cardData.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        />
        
        {/* Main card image if present */}
        {cardData.imageUrl && (
          <img 
            src={cardData.imageUrl} 
            className="absolute inset-0 w-full h-full object-cover"
            alt={cardData.title} 
          />
        )}
        
        {/* Layers */}
        {layers.map(layer => renderLayer(layer))}
      </div>
    );
  }
);

CardPreviewCanvas.displayName = 'CardPreviewCanvas';

export default CardPreviewCanvas;
