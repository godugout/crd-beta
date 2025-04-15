
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { CardLayer } from './CardCreator';

interface CardLayersPanelProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<CardLayer>) => void;
  onAddLayer: (type: 'image' | 'text' | 'shape') => void;
  onDeleteLayer: (layerId: string) => void;
  onMoveLayerUp: (layerId: string) => void;
  onMoveLayerDown: (layerId: string) => void;
}

const CardLayersPanel: React.FC<CardLayersPanelProps> = ({
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerUpdate,
  onAddLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown
}) => {
  // Render layer content preview based on type
  const renderLayerContent = (layer: CardLayer) => {
    switch (layer.type) {
      case 'image':
        return typeof layer.content === 'string' ? (
          <div className="w-6 h-6 rounded overflow-hidden">
            <img src={layer.content} alt="Layer" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        );
      case 'text':
        return <span>{typeof layer.content === 'string' ? layer.content : 'Text'}</span>;
      case 'shape':
        return <div className="w-6 h-6 bg-blue-500 rounded"></div>;
      default:
        return <div className="w-6 h-6 bg-gray-200 rounded"></div>;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium mb-3">Layers</h3>
      
      <div className="space-y-2 mb-4">
        {layers.length === 0 ? (
          <div className="text-center py-3 text-gray-400 border border-dashed rounded-md">
            No layers added yet
          </div>
        ) : (
          layers.map((layer) => (
            <div 
              key={layer.id}
              className={`flex items-center p-2 cursor-pointer rounded-md ${activeLayerId === layer.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex-1 flex items-center space-x-2">
                {layer.visible ? (
                  <Eye 
                    className="h-4 w-4 text-gray-500 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerUpdate(layer.id, { visible: false });
                    }}
                  />
                ) : (
                  <EyeOff 
                    className="h-4 w-4 text-gray-300 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerUpdate(layer.id, { visible: true });
                    }}
                  />
                )}
                <div className="flex-1">
                  {renderLayerContent(layer)}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayerUp(layer.id);
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
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
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAddLayer('text')}
        >
          Add Text
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAddLayer('image')}
        >
          Add Image
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAddLayer('shape')}
        >
          Add Shape
        </Button>
      </div>
    </div>
  );
};

export default CardLayersPanel;
