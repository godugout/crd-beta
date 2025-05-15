import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ArrowUp, ArrowDown, Trash, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { CardLayer } from '@/lib/types/cardTypes';

export interface LayersPanelProps {
  layers: CardLayer[];
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayerUp: (id: string) => void;
  onMoveLayerDown: (id: string) => void;
  onUpdateLayer?: (id: string, updates: Partial<CardLayer>) => void;
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
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Layers</CardTitle>
      </CardHeader>
      
      <CardContent className="p-2">
        {layers.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            No layers added yet
          </div>
        ) : (
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {[...layers].sort((a, b) => b.zIndex - a.zIndex).map(layer => (
              <div 
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${activeLayerId === layer.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                onClick={() => onSelectLayer(layer.id)}
              >
                <div className="flex items-center gap-2">
                  {layer.type === 'image' && <img src={layer.imageUrl} alt="" className="w-6 h-6 object-cover" />}
                  {layer.type === 'text' && <span className="text-xs font-mono px-1 border rounded">{layer.content.substring(0, 10)}{layer.content.length > 10 ? '...' : ''}</span>}
                  {layer.type === 'shape' && <div className="w-4 h-4" style={{backgroundColor: layer.color}}></div>}
                  <span className="text-sm truncate max-w-[100px]">{layer.type} {layers.findIndex(l => l.id === layer.id) + 1}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLayerVisibility(layer.id);
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
                      onToggleLayerLock(layer.id);
                    }}
                  >
                    {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
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
                    <ArrowUp className="h-3 w-3" />
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
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LayersPanel;
