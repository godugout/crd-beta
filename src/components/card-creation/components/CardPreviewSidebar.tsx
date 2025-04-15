
import React from 'react';
import { CardDesignState, CardLayer } from '../types/cardTypes';

interface CardPreviewSidebarProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses: string;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<CardLayer>) => void;
  previewCanvasRef: React.RefObject<HTMLDivElement>;
  hideControls?: boolean;
}

const CardPreviewSidebar: React.FC<CardPreviewSidebarProps> = ({
  cardData,
  layers,
  effectClasses,
  previewCanvasRef,
  hideControls = false
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-sm font-medium mb-2">Preview</div>
      
      <div 
        ref={previewCanvasRef}
        className={`relative aspect-[2.5/3.5] w-full rounded-lg overflow-hidden border ${effectClasses}`} 
        style={{
          borderRadius: cardData.borderRadius,
          borderColor: cardData.borderColor,
          backgroundColor: cardData.backgroundColor,
        }}
      >
        {cardData.imageUrl ? (
          <img 
            src={cardData.imageUrl} 
            alt="Card preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No image uploaded
          </div>
        )}
        
        {/* Render layers */}
        {layers.map(layer => {
          if (!layer.visible) return null;

          // Different rendering based on layer type
          switch (layer.type) {
            case 'text':
              return (
                <div 
                  key={layer.id}
                  className="absolute text-white text-shadow-sm"
                  style={{
                    top: `${layer.position?.y ?? layer.y}%`,
                    left: `${layer.position?.x ?? layer.x}%`,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                    opacity: layer.opacity,
                    zIndex: layer.position?.z ?? 1,
                  }}
                >
                  {typeof layer.content === 'string' ? layer.content : ''}
                </div>
              );
            
            case 'image':
              return (
                <div 
                  key={layer.id}
                  className="absolute"
                  style={{
                    top: `${layer.position?.y ?? layer.y}%`,
                    left: `${layer.position?.x ?? layer.x}%`,
                    width: layer.size?.width ?? layer.width,
                    height: layer.size?.height ?? layer.height,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                    opacity: layer.opacity,
                    zIndex: layer.position?.z ?? 1,
                  }}
                >
                  {layer.content && (
                    <img 
                      src={typeof layer.content === 'string' ? layer.content : layer.imageUrl} 
                      alt="Layer" 
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              );
            
            case 'shape':
              return (
                <div 
                  key={layer.id}
                  className="absolute bg-white"
                  style={{
                    top: `${layer.position?.y ?? layer.y}%`,
                    left: `${layer.position?.x ?? layer.x}%`,
                    width: layer.size?.width ?? layer.width,
                    height: layer.size?.height ?? layer.height,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                    opacity: layer.opacity,
                    zIndex: layer.position?.z ?? 1,
                    backgroundColor: layer.color,
                  }}
                >
                  {/* Shape content would be rendered here */}
                </div>
              );
              
            default:
              return null;
          }
        })}
      </div>
      
      {!hideControls && (
        <div className="mt-4">
          <div className="text-xs text-gray-500">
            {layers.length} layers • {effectClasses ? 'Effects applied' : 'No effects'}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreviewSidebar;
