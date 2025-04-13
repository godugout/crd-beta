
import React from 'react';
import { CardLayer, CardDesignState } from '../CardCreator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  Trash2 
} from 'lucide-react';

interface CardPreviewSidebarProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses: string;
  onLayerSelect?: (id: string) => void;
  onLayerUpdate?: (id: string, updates: Partial<CardLayer>) => void;
  previewCanvasRef: React.RefObject<HTMLDivElement>;
  hideControls?: boolean;
}

const CardPreviewSidebar: React.FC<CardPreviewSidebarProps> = ({ 
  cardData, 
  layers, 
  activeLayerId, 
  effectClasses,
  onLayerSelect, 
  onLayerUpdate,
  previewCanvasRef,
  hideControls = false
}) => {
  const getLayerTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Text';
      case 'image': return 'Image';
      case 'shape': return 'Shape';
      default: return 'Layer';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={previewCanvasRef}
        className={`relative w-full aspect-[2.5/3.5] mx-auto rounded-lg overflow-hidden shadow-lg ${effectClasses}`}
        style={{ 
          backgroundColor: cardData.backgroundColor,
          borderRadius: cardData.borderRadius,
          border: `1px solid ${cardData.borderColor}`,
        }}
      >
        {cardData.imageUrl && (
          <img 
            src={cardData.imageUrl} 
            alt={cardData.title} 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Render layers */}
        {layers.map((layer) => {
          if (!layer.visible) return null;
          
          // Position and size the layer
          const style = {
            left: `${layer.position.x}%`,
            top: `${layer.position.y}%`,
            zIndex: layer.position.z,
            transform: `rotate(${layer.rotation}deg)`,
            opacity: layer.opacity,
            width: typeof layer.size.width === 'number' ? `${layer.size.width}px` : layer.size.width,
            height: typeof layer.size.height === 'number' ? `${layer.size.height}px` : layer.size.height,
          };
          
          return (
            <div 
              key={layer.id}
              className={`absolute ${layer.id === activeLayerId ? 'ring-2 ring-litmus-green' : ''}`}
              style={style}
              onClick={() => onLayerSelect && onLayerSelect(layer.id)}
            >
              {layer.type === 'text' && (
                <div className="text-white text-shadow">{layer.content as string}</div>
              )}
              {layer.type === 'image' && layer.content && (
                <img 
                  src={layer.content as string} 
                  alt="Layer" 
                  className="w-full h-full object-contain"
                />
              )}
              {layer.type === 'shape' && (
                <div className="w-full h-full bg-litmus-green/50 rounded-lg"></div>
              )}
            </div>
          );
        })}
        
        {/* Card details overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60">
          {cardData.title && (
            <h3 className="text-white text-lg font-bold truncate">{cardData.title}</h3>
          )}
          {cardData.description && (
            <p className="text-white text-xs line-clamp-2">{cardData.description}</p>
          )}
          {cardData.tags && cardData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {cardData.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {cardData.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{cardData.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!hideControls && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Layers</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {layers.length === 0 && (
              <p className="text-sm text-gray-500 italic">No layers added yet</p>
            )}
            
            {layers.map((layer) => (
              <div 
                key={layer.id}
                className={`flex items-center justify-between p-1 rounded text-sm cursor-pointer ${
                  layer.id === activeLayerId ? 'bg-litmus-green/10 border-l-2 border-litmus-green' : 'hover:bg-gray-100'
                }`}
                onClick={() => onLayerSelect && onLayerSelect(layer.id)}
              >
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerUpdate && onLayerUpdate(layer.id, { visible: !layer.visible });
                    }}
                  >
                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </Button>
                  <span className="ml-1">{getLayerTypeLabel(layer.type)}</span>
                </div>
                
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerUpdate && onLayerUpdate(layer.id, { 
                        position: { 
                          ...layer.position, 
                          z: layer.position.z + 1 
                        } 
                      });
                    }}
                  >
                    <ChevronUp size={14} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (layer.position.z > 1) {
                        onLayerUpdate && onLayerUpdate(layer.id, { 
                          position: { 
                            ...layer.position, 
                            z: layer.position.z - 1 
                          } 
                        });
                      }
                    }}
                  >
                    <ChevronDown size={14} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreviewSidebar;
