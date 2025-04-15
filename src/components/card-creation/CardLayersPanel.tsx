
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardLayer } from './types/cardTypes';
import { Eye, EyeOff, Image, Type, Square, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CardLayersPanelProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  onLayerSelect: (id: string) => void;
  onLayerUpdate: (id: string, updates: Partial<CardLayer>) => void;
  onAddLayer: (type: 'image' | 'text' | 'shape') => void;
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
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Layers</h3>
        <div className="flex space-x-1">
          <Button
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-1"
            onClick={() => onAddLayer('text')}
          >
            <Type size={16} />
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-1"
            onClick={() => onAddLayer('image')}
          >
            <Image size={16} />
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-1"
            onClick={() => onAddLayer('shape')}
          >
            <Square size={16} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-1">
        <Accordion type="single" collapsible defaultValue="layers">
          <AccordionItem value="layers" className="border-0">
            <AccordionTrigger className="py-2 px-3 hover:bg-gray-100 rounded-md">
              <span className="text-sm font-medium">Layer List ({layers.length})</span>
            </AccordionTrigger>
            <AccordionContent>
              {layers.length === 0 ? (
                <div className="text-sm text-gray-500 py-2 px-3">
                  No layers added yet
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {layers.map((layer) => (
                    <div 
                      key={layer.id}
                      className={`
                        flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer
                        ${activeLayerId === layer.id ? 'bg-gray-100' : ''}
                      `}
                      onClick={() => onLayerSelect(layer.id)}
                    >
                      <div className="flex items-center gap-2">
                        {/* Layer type icon */}
                        <span className="flex-none">
                          {layer.type === 'text' && <Type size={14} />}
                          {layer.type === 'image' && <Image size={14} />}
                          {layer.type === 'shape' && <Square size={14} />}
                        </span>
                        
                        {/* Layer name/content */}
                        <span className="text-sm truncate max-w-[100px]">
                          {layer.type === 'text' ? 
                            (typeof layer.content === 'string' ? layer.content : 'Text') : 
                            `${layer.type.charAt(0).toUpperCase() + layer.type.slice(1)} Layer`
                          }
                        </span>
                      </div>
                      
                      {/* Layer actions */}
                      <div className="flex items-center gap-1">
                        {/* Visibility toggle */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLayerUpdate(layer.id, { visible: !layer.visible });
                          }}
                        >
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </Button>
                        
                        {/* Move Up */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveLayerUp(layer.id);
                          }}
                        >
                          <ChevronUp size={14} />
                        </Button>
                        
                        {/* Move Down */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveLayerDown(layer.id);
                          }}
                        >
                          <ChevronDown size={14} />
                        </Button>
                        
                        {/* Delete */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLayer(layer.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default CardLayersPanel;
