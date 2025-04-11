
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CardLayer } from './CardCreator';

interface CardLayersPanelProps {
  layers: CardLayer[];
  activeLayerId?: string;
  onLayerSelect: (id: string) => void;
  onLayerUpdate: (id: string, layer: Partial<CardLayer>) => void;
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
  // Find active layer
  const activeLayer = layers.find(layer => layer.id === activeLayerId);
  
  // Create new text layer
  const handleAddTextLayer = () => {
    onAddLayer({
      type: 'text',
      content: 'Text Layer',
      position: { x: 10, y: 10, z: layers.length + 1 },
      size: { width: 80, height: 20 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    });
  };
  
  // Create new shape layer
  const handleAddShapeLayer = () => {
    // Create a simple circle SVG
    const circleSvg = (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#4299E1" />
      </svg>
    );
    
    onAddLayer({
      type: 'shape',
      content: circleSvg,
      position: { x: 35, y: 35, z: layers.length + 1 },
      size: { width: 30, height: 30 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Layers</h3>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddTextLayer}
            >
              Add Text
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddShapeLayer}
            >
              Add Shape
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {layers.length === 0 ? (
            <div className="text-sm text-gray-500 italic">
              No layers yet. Add an image, text, or shape.
            </div>
          ) : (
            layers.map((layer, index) => (
              <div 
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  layer.id === activeLayerId ? 'bg-primary/10 border-primary border' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${layer.visible ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm capitalize">
                    {layer.type} {index + 1}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerUp(layer.id);
                    }}
                    disabled={index === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6"/>
                    </svg>
                    <span className="sr-only">Move Up</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerDown(layer.id);
                    }}
                    disabled={index === layers.length - 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                    <span className="sr-only">Move Down</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {activeLayer && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium mb-4">Layer Properties</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="layer-visible">Visible</Label>
              <Switch
                id="layer-visible"
                checked={activeLayer.visible}
                onCheckedChange={(checked) => onLayerUpdate(activeLayer.id, { visible: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="layer-opacity">Opacity</Label>
                <span className="text-sm text-gray-500">
                  {Math.round(activeLayer.opacity * 100)}%
                </span>
              </div>
              <Slider
                id="layer-opacity"
                value={[activeLayer.opacity]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => onLayerUpdate(activeLayer.id, { opacity: value[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="layer-rotation">Rotation</Label>
                <span className="text-sm text-gray-500">{activeLayer.rotation}°</span>
              </div>
              <Slider
                id="layer-rotation"
                value={[activeLayer.rotation]}
                min={0}
                max={360}
                step={5}
                onValueChange={(value) => onLayerUpdate(activeLayer.id, { rotation: value[0] })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="layer-width">Width (%)</Label>
                <Input
                  id="layer-width"
                  type="number"
                  min={1}
                  max={100}
                  value={activeLayer.size.width}
                  onChange={(e) => onLayerUpdate(activeLayer.id, { 
                    size: { ...activeLayer.size, width: Number(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="layer-height">Height (%)</Label>
                <Input
                  id="layer-height"
                  type="number"
                  min={1}
                  max={100}
                  value={activeLayer.size.height}
                  onChange={(e) => onLayerUpdate(activeLayer.id, { 
                    size: { ...activeLayer.size, height: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
            
            {activeLayer.type === 'text' && typeof activeLayer.content === 'string' && (
              <div className="space-y-2">
                <Label htmlFor="layer-text">Text Content</Label>
                <Input
                  id="layer-text"
                  value={activeLayer.content}
                  onChange={(e) => onLayerUpdate(activeLayer.id, { content: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardLayersPanel;
