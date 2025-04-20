
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Trash, Move } from 'lucide-react';

interface Layer {
  id: string;
  type: string;
  visible?: boolean;
  name?: string;
}

interface LayersPanelProps {
  layers: Layer[];
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
  onLayerDelete: (id: string) => void;
  onLayerReorder: (fromIndex: number, toIndex: number) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  onLayerUpdate,
  onLayerDelete,
  onLayerReorder
}) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        {layers.map((layer, index) => (
          <Card key={layer.id} className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 cursor-move text-gray-400" />
                <span className="text-sm">{layer.name || `Layer ${index + 1}`}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLayerUpdate(layer.id, { visible: !layer.visible })}
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLayerDelete(layer.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default LayersPanel;
