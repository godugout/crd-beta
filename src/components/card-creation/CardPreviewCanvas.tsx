
import React, { forwardRef, useEffect, useState } from 'react';
import { CardDesignState, CardLayer } from './CardCreator';

interface CardPreviewCanvasProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayerId?: string;
  onLayerSelect: (id: string) => void;
  onLayerUpdate: (id: string, updates: Partial<CardLayer>) => void;
  effectClasses: string;
}

const CardPreviewCanvas = forwardRef<HTMLDivElement, CardPreviewCanvasProps>(
  ({ cardData, layers, activeLayerId, onLayerSelect, onLayerUpdate, effectClasses }, ref) => {
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Standard trading card dimensions (2.5" x 3.5" in pixels at 300dpi)
    const cardWidth = 750;
    const cardHeight = 1050;

    // Handle layer drag start
    const handleLayerMouseDown = (e: React.MouseEvent, layer: CardLayer) => {
      if (e.button !== 0) return; // Only left mouse button
      
      e.stopPropagation();
      
      // Select the layer
      onLayerSelect(layer.id);
      
      // Get mouse position relative to card
      const cardRect = (e.currentTarget.parentNode as HTMLElement).getBoundingClientRect();
      const offsetX = e.clientX - (cardRect.left + (layer.position.x * scale));
      const offsetY = e.clientY - (cardRect.top + (layer.position.y * scale));
      
      setIsDragging(true);
      setDragOffset({ x: offsetX, y: offsetY });
    };

    // Handle layer drag
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeLayerId) return;
      
      const cardRect = (ref as React.RefObject<HTMLDivElement>).current?.getBoundingClientRect();
      if (!cardRect) return;
      
      // Get new position
      const newX = (e.clientX - cardRect.left - dragOffset.x) / scale;
      const newY = (e.clientY - cardRect.top - dragOffset.y) / scale;
      
      // Update layer position
      onLayerUpdate(activeLayerId, {
        position: { 
          x: Math.max(0, Math.min(cardWidth - 50, newX)),
          y: Math.max(0, Math.min(cardHeight - 50, newY)),
          z: 0 
        }
      });
    };

    // Handle layer drag end
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Setup global event listeners
    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, activeLayerId, dragOffset, scale]);

    return (
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        {/* Card preview container */}
        <div 
          ref={ref}
          className={`relative bg-white overflow-hidden ${effectClasses}`}
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: cardData.borderRadius,
            border: `8px solid ${cardData.borderColor}`,
            backgroundColor: cardData.backgroundColor,
            transform: `scale(${scale})`,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.2s ease'
          }}
        >
          {/* Background image if available */}
          {cardData.imageUrl && !layers.some(layer => layer.type === 'image') && (
            <img 
              src={cardData.imageUrl}
              alt={cardData.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Render all layers */}
          {layers.map((layer) => {
            // Skip hidden layers
            if (!layer.visible) return null;
            
            const isActive = layer.id === activeLayerId;
            
            // Render based on layer type
            switch (layer.type) {
              case 'image':
                return (
                  <div
                    key={layer.id}
                    className={`absolute cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                    style={{
                      left: layer.position.x,
                      top: layer.position.y,
                      width: layer.size.width + '%',
                      height: layer.size.height + '%',
                      opacity: layer.opacity,
                      transform: `rotate(${layer.rotation}deg)`,
                      zIndex: layer.position.z,
                    }}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                  >
                    <img
                      src={layer.content as string}
                      alt="Layer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              
              case 'text':
                return (
                  <div
                    key={layer.id}
                    className={`absolute cursor-move ${isActive ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      left: layer.position.x,
                      top: layer.position.y,
                      opacity: layer.opacity,
                      transform: `rotate(${layer.rotation}deg)`,
                      zIndex: layer.position.z,
                    }}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                  >
                    <div className="text-xl font-bold">
                      {layer.content}
                    </div>
                  </div>
                );
              
              case 'shape':
                return (
                  <div
                    key={layer.id}
                    className={`absolute cursor-move ${isActive ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      left: layer.position.x,
                      top: layer.position.y,
                      width: layer.size.width,
                      height: layer.size.height,
                      opacity: layer.opacity,
                      transform: `rotate(${layer.rotation}deg)`,
                      zIndex: layer.position.z,
                      backgroundColor: typeof layer.content === 'string' ? layer.content : 'black',
                      borderRadius: '4px'
                    }}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                  />
                );
                
              default:
                return null;
            }
          })}
          
          {/* Card title */}
          {cardData.title && (
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <h3 className="text-xl font-bold text-white text-shadow-sm bg-black/30 py-1">
                {cardData.title}
              </h3>
            </div>
          )}
        </div>
        
        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={() => setScale(s => Math.max(0.1, s - 0.1))}
            className="bg-white p-2 rounded-full shadow-md"
          >
            -
          </button>
          <button 
            onClick={() => setScale(1)} 
            className="bg-white p-2 rounded-md shadow-md text-sm"
          >
            {Math.round(scale * 100)}%
          </button>
          <button 
            onClick={() => setScale(s => Math.min(2, s + 0.1))}
            className="bg-white p-2 rounded-full shadow-md"
          >
            +
          </button>
        </div>
      </div>
    );
  }
);

CardPreviewCanvas.displayName = "CardPreviewCanvas";

export default CardPreviewCanvas;
