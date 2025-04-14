
import React, { useState } from 'react';
import { CardLayer } from '@/components/card-creation/CardCreator';
import EffectsEngine from '../card-effects/EffectsEngine';

interface CardDesignerCanvasProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses: string;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<CardLayer>) => void;
}

const CardDesignerCanvas: React.FC<CardDesignerCanvasProps> = ({
  layers,
  activeLayerId,
  effectClasses,
  onSelectLayer,
  onUpdateLayer
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  
  // Standard trading card aspect ratio (2.5:3.5)
  const cardWidth = 250;
  const cardHeight = 350;
  
  const handleLayerClick = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onSelectLayer(layerId);
  };
  
  const handleDragStart = (e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (activeLayerId !== layerId) {
      onSelectLayer(layerId);
    }
    
    setIsDragging(true);
    setDragStartPos({
      x: e.clientX,
      y: e.clientY
    });
    
    // Add event listeners for drag
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };
  
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !activeLayerId) return;
    
    const layer = layers.find(l => l.id === activeLayerId);
    if (!layer) return;
    
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    
    onUpdateLayer(activeLayerId, {
      position: {
        ...layer.position,
        x: layer.position.x + dx,
        y: layer.position.y + dy
      }
    });
    
    setDragStartPos({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };
  
  const renderLayer = (layer: CardLayer) => {
    if (!layer.visible) return null;
    
    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${layer.position.x}px`,
      top: `${layer.position.y}px`,
      zIndex: layer.position.z,
      opacity: layer.opacity,
      transform: `rotate(${layer.rotation}deg)`,
      cursor: isDragging ? 'grabbing' : 'grab',
      width: typeof layer.size.width === 'number' ? `${layer.size.width}px` : layer.size.width,
      height: typeof layer.size.height === 'number' ? `${layer.size.height}px` : layer.size.height,
    };
    
    const isActive = layer.id === activeLayerId;
    
    // Add border and controls if the layer is active
    const activeLayerStyle: React.CSSProperties = isActive ? {
      outline: '1px solid #3b82f6',
      outlineOffset: '2px',
    } : {};
    
    const combinedStyle = { ...layerStyle, ...activeLayerStyle };
    
    switch (layer.type) {
      case 'image':
        return (
          <div
            key={layer.id}
            style={combinedStyle}
            onClick={(e) => handleLayerClick(e, layer.id)}
            onMouseDown={(e) => handleDragStart(e, layer.id)}
            className="group"
          >
            {typeof layer.content === 'string' && (
              <img
                src={layer.content}
                alt={`Layer ${layer.id}`}
                className="w-full h-full object-contain"
                draggable={false}
              />
            )}
            
            {isActive && (
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border-2 border-blue-500 border-dashed rounded pointer-events-none"></div>
            )}
          </div>
        );
      
      case 'text':
        return (
          <div
            key={layer.id}
            style={combinedStyle}
            onClick={(e) => handleLayerClick(e, layer.id)}
            onMouseDown={(e) => handleDragStart(e, layer.id)}
            className="group min-w-[40px] min-h-[24px] px-1"
          >
            {typeof layer.content === 'string' ? layer.content : 'Text'}
            
            {isActive && (
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border-2 border-blue-500 border-dashed rounded pointer-events-none"></div>
            )}
          </div>
        );
      
      case 'shape':
        return (
          <div
            key={layer.id}
            style={{
              ...combinedStyle,
              backgroundColor: typeof layer.content === 'object' && (layer.content as any).color ? (layer.content as any).color : 'rgba(59, 130, 246, 0.5)'
            }}
            onClick={(e) => handleLayerClick(e, layer.id)}
            onMouseDown={(e) => handleDragStart(e, layer.id)}
            className="group"
          >
            {isActive && (
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border-2 border-blue-500 border-dashed rounded pointer-events-none"></div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Convert the effectClasses string to an array of effect names for EffectsEngine
  const effectNames = effectClasses.split(' ').map(cls => {
    // Extract effect name from class name (e.g., 'card-holographic' -> 'Holographic')
    const match = cls.match(/card-([a-z-]+)/);
    if (match && match[1]) {
      // Convert kebab case to title case (e.g., 'cracked-ice' -> 'Cracked Ice')
      return match[1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return '';
  }).filter(Boolean);
  
  return (
    <div 
      className="relative bg-white shadow-lg overflow-hidden"
      style={{ width: cardWidth, height: cardHeight, borderRadius: '8px' }}
    >
      {/* Card background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200"></div>
      
      {/* Safe zone indicator */}
      <div className="absolute inset-4 border border-blue-300 border-dashed opacity-50 pointer-events-none"></div>
      
      {/* Bleed area indicator */}
      <div className="absolute -inset-2 border border-red-300 border-dashed opacity-50 pointer-events-none"></div>
      
      {/* Effects Engine */}
      <EffectsEngine 
        effects={effectNames}
        isInteractive={true}
        intensity={0.8}
      />
      
      {/* Render all layers */}
      {layers.map(renderLayer)}
    </div>
  );
};

export default CardDesignerCanvas;
