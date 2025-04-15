
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock 
} from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: 'image' | 'text' | 'shape';
}

interface LayerControlsProps {
  layers: Layer[];
  activeLayerId: string | null;
  onLayerSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({
  layers,
  activeLayerId,
  onLayerSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock
}) => {
  if (layers.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p>No layers yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Layers ({layers.length})</h4>
      
      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {layers.map((layer) => (
          <div 
            key={layer.id}
            className={`flex items-center justify-between py-1.5 px-2 rounded ${
              activeLayerId === layer.id 
                ? 'bg-primary/10 border border-primary/30' 
                : 'hover:bg-accent'
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                {layer.visible ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>
              
              <div className="text-sm truncate max-w-[120px]">
                {layer.name}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(layer.id);
                }}
                className="text-muted-foreground hover:text-foreground"
                title={layer.locked ? "Unlock layer" : "Lock layer"}
              >
                {layer.locked ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Unlock className="h-3.5 w-3.5" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp(layer.id);
                }}
                className="text-muted-foreground hover:text-foreground"
                title="Move up"
                disabled={layers.indexOf(layer) === 0}
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown(layer.id);
                }}
                className="text-muted-foreground hover:text-foreground"
                title="Move down"
                disabled={layers.indexOf(layer) === layers.length - 1}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(layer.id);
                }}
                className="text-muted-foreground hover:text-foreground"
                title="Duplicate layer"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(layer.id);
                }}
                className="text-muted-foreground hover:text-destructive"
                title="Delete layer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between pt-2 border-t">
        <Button variant="outline" size="sm">
          Flatten
        </Button>
        <Button size="sm">
          Add Layer
        </Button>
      </div>
    </div>
  );
};
