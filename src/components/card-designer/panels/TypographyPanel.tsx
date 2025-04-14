
import React from 'react';
import { CardLayer } from '@/components/card-creation/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Plus, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TypographyPanelProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  onUpdateLayer: (id: string, updates: Partial<CardLayer>) => void;
  onAddTextLayer: () => void;
}

const TypographyPanel: React.FC<TypographyPanelProps> = ({
  layers,
  activeLayerId,
  onUpdateLayer,
  onAddTextLayer
}) => {
  const activeLayer = layers.find(layer => layer.id === activeLayerId);
  const isTextLayer = activeLayer?.type === 'text';
  
  // Popular font families for card designs
  const fontFamilies = [
    { value: 'Inter, sans-serif', label: 'Inter (Sans)' },
    { value: 'Arial, sans-serif', label: 'Arial (Sans)' },
    { value: 'Georgia, serif', label: 'Georgia (Serif)' },
    { value: 'Impact, sans-serif', label: 'Impact (Display)' },
    { value: 'Courier New, monospace', label: 'Courier (Mono)' },
    { value: 'Verdana, sans-serif', label: 'Verdana (Sans)' },
    { value: 'Times New Roman, serif', label: 'Times (Serif)' }
  ];
  
  // Font weights
  const fontWeights = [
    { value: '400', label: 'Regular (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'Semibold (600)' },
    { value: '700', label: 'Bold (700)' },
    { value: '800', label: 'Extrabold (800)' }
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium text-lg">Typography</h3>
      
      <Button 
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={onAddTextLayer}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Text Layer
      </Button>
      
      {isTextLayer ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="text-content">Text Content</Label>
            <Input
              id="text-content"
              value={activeLayer.content as string}
              onChange={(e) => onUpdateLayer(activeLayerId!, { content: e.target.value })}
              placeholder="Enter text"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select
              value={(activeLayer.textStyle?.fontFamily || fontFamilies[0].value) as string}
              onValueChange={(value) => onUpdateLayer(activeLayerId!, { 
                textStyle: { ...activeLayer.textStyle, fontFamily: value } 
              })}
            >
              <SelectTrigger id="font-family" className="mt-1">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="font-size">Font Size</Label>
            <div className="flex items-center gap-4 mt-1">
              <Slider
                id="font-size"
                value={[activeLayer.textStyle?.fontSize || 16]}
                min={8}
                max={72}
                step={1}
                onValueChange={(value) => onUpdateLayer(activeLayerId!, { 
                  textStyle: { ...activeLayer.textStyle, fontSize: value[0] } 
                })}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm">
                {activeLayer.textStyle?.fontSize || 16}px
              </span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="font-weight">Font Weight</Label>
            <Select
              value={(activeLayer.textStyle?.fontWeight || fontWeights[0].value) as string}
              onValueChange={(value) => onUpdateLayer(activeLayerId!, { 
                textStyle: { ...activeLayer.textStyle, fontWeight: value } 
              })}
            >
              <SelectTrigger id="font-weight" className="mt-1">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map(weight => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex mt-1">
              <Input
                type="color"
                value={activeLayer.textStyle?.color || "#000000"}
                onChange={(e) => onUpdateLayer(activeLayerId!, { 
                  textStyle: { ...activeLayer.textStyle, color: e.target.value } 
                })}
                className="w-12 h-9 p-1 rounded-l-md"
              />
              <Input
                type="text"
                value={activeLayer.textStyle?.color || "#000000"}
                onChange={(e) => onUpdateLayer(activeLayerId!, { 
                  textStyle: { ...activeLayer.textStyle, color: e.target.value } 
                })}
                className="flex-1 rounded-l-none"
              />
            </div>
          </div>
          
          <div>
            <Label className="mb-1 block">Text Alignment</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={activeLayer.textStyle?.textAlign === 'left' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => onUpdateLayer(activeLayerId!, { 
                  textStyle: { ...activeLayer.textStyle, textAlign: 'left' } 
                })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={activeLayer.textStyle?.textAlign === 'center' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => onUpdateLayer(activeLayerId!, { 
                  textStyle: { ...activeLayer.textStyle, textAlign: 'center' } 
                })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={activeLayer.textStyle?.textAlign === 'right' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => onUpdateLayer(activeLayerId!, { 
                  textStyle: { ...activeLayer.textStyle, textAlign: 'right' } 
                })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <Type className="h-12 w-12 mx-auto opacity-20" />
          <p className="mt-2">Select a text layer to edit its properties</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={onAddTextLayer}
          >
            Add Text Layer
          </Button>
        </div>
      )}
    </div>
  );
};

export default TypographyPanel;
