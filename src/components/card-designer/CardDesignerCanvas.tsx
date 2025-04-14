
import React from 'react';
import { CardLayer } from '@/components/card-creation/types/cardTypes';

interface CardDesignerCanvasProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses?: string;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<CardLayer>) => void;
}

const CardDesignerCanvas: React.FC<CardDesignerCanvasProps> = ({
  layers,
  activeLayerId,
  effectClasses = '',
  onSelectLayer,
  onUpdateLayer
}) => {
  // Card dimensions (using standard trading card aspect ratio)
  const cardWidth = 400; // Base width in pixels
  const cardHeight = 560; // Base height (using 2.5" x 3.5" ratio)
  
  // Render a layer based on its type and content
  const renderLayer = (layer: CardLayer) => {
    if (!layer.visible) return null;
    
    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${layer.position.x}%`,
      top: `${layer.position.y}%`,
      zIndex: layer.position.z,
      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
      opacity: layer.opacity,
      width: typeof layer.size.width === 'number' ? `${layer.size.width}px` : layer.size.width,
      height: typeof layer.size.height === 'number' ? `${layer.size.height}px` : layer.size.height
    };
    
    // Common props for interactive elements
    const commonProps = {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectLayer(layer.id);
      },
      className: `layer ${activeLayerId === layer.id ? 'active-layer' : ''}`
    };
    
    switch (layer.type) {
      case 'image':
        return (
          <div
            key={layer.id}
            style={layerStyle}
            {...commonProps}
          >
            <img
              src={layer.content as string}
              alt="Layer"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
            {activeLayerId === layer.id && (
              <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
            )}
          </div>
        );
        
      case 'text':
        const textStyle: React.CSSProperties = {
          fontFamily: layer.textStyle?.fontFamily || 'sans-serif',
          fontSize: `${layer.textStyle?.fontSize || 16}px`,
          fontWeight: layer.textStyle?.fontWeight || 'normal',
          color: layer.textStyle?.color || '#000000',
          textAlign: (layer.textStyle?.textAlign as any) || 'left',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        };
        
        return (
          <div
            key={layer.id}
            style={{...layerStyle, ...textStyle}}
            {...commonProps}
          >
            {layer.content as string}
            {activeLayerId === layer.id && (
              <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
            )}
          </div>
        );
        
      case 'shape':
        // Simple shape rendering - in a real app, this would be more sophisticated
        return (
          <div
            key={layer.id}
            style={{
              ...layerStyle,
              backgroundColor: '#e2e2e2', // Default shape color
              border: '1px solid #d0d0d0'
            }}
            {...commonProps}
          >
            {activeLayerId === layer.id && (
              <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className={`card-canvas ${effectClasses}`}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}
      onClick={() => onSelectLayer('')}
    >
      {/* Safe zone indicator */}
      <div 
        className="safe-zone pointer-events-none"
        style={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          border: '1px dashed rgba(0,0,0,0.2)',
          zIndex: 0
        }}
      />
      
      {/* Render layers in z-index order */}
      {[...layers].sort((a, b) => a.position.z - b.position.z).map(renderLayer)}
    </div>
  );
};

export default CardDesignerCanvas;
