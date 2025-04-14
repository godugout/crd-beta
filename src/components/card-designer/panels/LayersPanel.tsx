
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Image, Type, Square, ChevronUp, ChevronDown, Trash2, Eye, EyeOff, Copy, CopyPlus } from 'lucide-react';
import { CardLayer } from '@/components/card-creation/CardCreator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface LayersPanelProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onAddLayer: (layer: Omit<CardLayer, 'id'>) => void;
  onUpdateLayer: (id: string, updates: Partial<CardLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayerUp: (id: string) => void;
  onMoveLayerDown: (id: string) => void;
  onDuplicateLayer?: (id: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onUpdateLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onDuplicateLayer
}) => {
  const handleAddLayer = (type: 'image' | 'text' | 'shape') => {
    const newLayer: Omit<CardLayer, 'id'> = {
      type,
      content: type === 'text' ? 'New Text' : (type === 'image' ? '' : {}),
      position: { x: 50, y: 50, z: layers.length + 1 },
      size: { width: type === 'text' ? 'auto' : 100, height: type === 'text' ? 'auto' : 100 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    };
    
    onAddLayer(newLayer);
  };
  
  const toggleLayerVisibility = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      onUpdateLayer(layerId, { visible: !layer.visible });
    }
  };
  
  const duplicateLayer = (layerId: string) => {
    if (onDuplicateLayer) {
      onDuplicateLayer(layerId);
    } else {
      const layer = layers.find(l => l.id === layerId);
      if (layer) {
        onAddLayer({
          ...layer,
          position: {
            ...layer.position,
            x: layer.position.x + 10,
            y: layer.position.y + 10,
            z: layers.length + 1
          }
        });
      }
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      {/* Add Layer Options */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAddLayer('image')}
          className="flex gap-1"
        >
          <Image className="h-4 w-4" />
          <span>Image</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAddLayer('text')}
          className="flex gap-1"
        >
          <Type className="h-4 w-4" />
          <span>Text</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAddLayer('shape')}
          className="flex gap-1"
        >
          <Square className="h-4 w-4" />
          <span>Shape</span>
        </Button>
      </div>
      
      {/* Layers List */}
      {layers.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-2 pr-2">
            {[...layers].reverse().map((layer) => (
              <div 
                key={layer.id} 
                className={`flex items-center gap-2 p-2 rounded border ${activeLayerId === layer.id ? 'bg-gray-100 border-gray-300' : 'border-gray-200'}`}
                onClick={() => onSelectLayer(layer.id)}
              >
                {/* Layer Icon */}
                <div className="flex-shrink-0">
                  {layer.type === 'image' && <Image className="h-4 w-4" />}
                  {layer.type === 'text' && <Type className="h-4 w-4" />}
                  {layer.type === 'shape' && <Square className="h-4 w-4" />}
                </div>
                
                {/* Layer Name */}
                <div className="flex-1 truncate">
                  <span className="text-sm font-medium">
                    {layer.type === 'text' && typeof layer.content === 'string' 
                      ? (layer.content.length > 15 
                        ? layer.content.substring(0, 15) + '...' 
                        : layer.content)
                      : `${layer.type.charAt(0).toUpperCase() + layer.type.slice(1)} Layer`
                    }
                  </span>
                </div>
                
                {/* Layer Controls */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                  >
                    {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerUp(layer.id);
                    }}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerDown(layer.id);
                    }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CopyPlus className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => duplicateLayer(layer.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteLayer(layer.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No layers added yet</p>
          <p className="text-sm">Add a layer to get started</p>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
