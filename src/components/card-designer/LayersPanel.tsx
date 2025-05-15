
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, LockClosed, Unlock, ChevronUp, ChevronDown } from 'lucide-react';
import { CardLayer } from '@/components/card-creation/types/cardTypes';

interface LayersPanelProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayerUp: (id: string) => void;
  onMoveLayerDown: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<CardLayer>) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onUpdateLayer
}) => {
  const getLayerTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'text': return '🔤';
      case 'shape': return '⬜';
      case 'effect': return '✨';
      default: return '📑';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Layers</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-1 p-2">
        {layers.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No layers added yet
          </div>
        )}
        
        {layers.sort((a, b) => b.zIndex - a.zIndex).map(layer => (
          <div 
            key={layer.id}
            className={`flex items-center p-2 rounded ${activeLayerId === layer.id ? 'bg-accent' : 'hover:bg-muted'}`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <div className="mr-2">{getLayerTypeIcon(layer.type)}</div>
            
            <div className="flex-1 overflow-hidden mr-2">
              <div className="truncate text-sm">
                {layer.type === 'text' ? (String(layer.content).substring(0, 20) || 'Text Layer') : `${layer.type} Layer`}
              </div>
            </div>
            
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateLayer(layer.id, { visible: !layer.visible });
                }}
              >
                {layer.visible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateLayer(layer.id, { locked: !layer.locked });
                }}
              >
                {layer.locked ? <LockClosed className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
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
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayer(layer.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LayersPanel;
