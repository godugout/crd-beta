
import React from 'react';
import { ArrowUp, ArrowDown, Plus, Trash, Image, Type, Square, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardLayer } from './CardCreator';

interface CardLayersPanelProps {
  layers: CardLayer[];
  activeLayerId?: string;
  onLayerSelect: (id: string) => void;
  onLayerUpdate: (id: string, updates: Partial<CardLayer>) => void;
  onAddLayer: (layer: Omit<CardLayer, 'id'>) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayerUp: (id: string) => void;
  onMoveLayerDown: (id: string) => void;
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
  const handleAddImageLayer = () => {
    // This would typically open a file picker
    onAddLayer({
      type: 'image',
      content: 'https://via.placeholder.com/300',
      position: { x: 50, y: 50, z: layers.length },
      size: { width: 50, height: 50 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    });
  };

  const handleAddTextLayer = () => {
    onAddLayer({
      type: 'text',
      content: 'New Text Layer',
      position: { x: 100, y: 100, z: layers.length },
      size: { width: 200, height: 50 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    });
  };

  const handleAddShapeLayer = () => {
    onAddLayer({
      type: 'shape',
      content: '#48BB78', // Color
      position: { x: 150, y: 150, z: layers.length },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    });
  };

  const toggleLayerVisibility = (id: string, isCurrentlyVisible: boolean) => {
    onLayerUpdate(id, { visible: !isCurrentlyVisible });
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} />;
      case 'text': return <Type size={16} />;
      case 'shape': return <Square size={16} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Layers</h3>
        <p className="text-sm text-gray-500">
          Manage the elements that make up your card design.
        </p>
      </div>

      {/* Layer stack */}
      <div className="space-y-2">
        {layers.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">No layers added yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {[...layers].reverse().map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  layer.id === activeLayerId ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-white rounded border">
                    {getLayerIcon(layer.type)}
                  </div>
                  <span className="text-sm truncate max-w-[150px]">
                    {layer.type === 'text' ? layer.content : `${layer.type} Layer`}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id, layer.visible);
                    }}
                  >
                    {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerUp(layer.id);
                    }}
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerDown(layer.id);
                    }}
                  >
                    <ArrowDown size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add layer controls */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={handleAddImageLayer}
        >
          <Image size={16} className="mr-1" />
          Image
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={handleAddTextLayer}
        >
          <Type size={16} className="mr-1" />
          Text
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={handleAddShapeLayer}
        >
          <Square size={16} className="mr-1" />
          Shape
        </Button>
      </div>

      {/* Help text */}
      <div className="text-xs text-gray-500 mt-4">
        <p>Tip: Click and drag layers in the preview to position them.</p>
      </div>
    </div>
  );
};

export default CardLayersPanel;
