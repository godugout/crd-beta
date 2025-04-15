
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CardLayer } from '@/components/card-creation/types/cardTypes';

interface CardDesignStepProps {
  cardData: any;
  setCardData: (data: any) => void;
  layers: CardLayer[];
  activeLayer: CardLayer | null;
  setActiveLayer: (layerId: string) => void;
  addLayer: (type: 'image' | 'text' | 'shape') => void;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  deleteLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  onContinue: () => void;
}

const CardDesignStep: React.FC<CardDesignStepProps> = ({
  cardData,
  setCardData,
  layers,
  activeLayer,
  setActiveLayer,
  addLayer,
  updateLayer,
  deleteLayer,
  moveLayerUp,
  moveLayerDown,
  onContinue
}) => {
  const handleBorderRadiusChange = (value: string) => {
    setCardData({
      ...cardData,
      borderRadius: value
    });
  };

  const handleColorChange = (field: string, value: string) => {
    setCardData({
      ...cardData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Design Your Card</h2>
      
      <Tabs defaultValue="style">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="style">Card Style</TabsTrigger>
          <TabsTrigger value="frame">Frame & Border</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="p-4 space-y-4">
          <div className="space-y-3">
            <Label htmlFor="card-type">Card Type</Label>
            <select 
              id="card-type"
              value={cardData.cardType}
              onChange={(e) => {
                setCardData({
                  ...cardData,
                  cardType: e.target.value
                });
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="holographic">Holographic</option>
              <option value="refractor">Refractor</option>
              <option value="vintage">Vintage</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="background-color">Background Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-md border" 
                style={{ backgroundColor: cardData.backgroundColor }}
              ></div>
              <Input
                id="background-color"
                type="color"
                value={cardData.backgroundColor}
                onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="frame" className="p-4 space-y-4">
          <div className="space-y-3">
            <Label htmlFor="border-color">Border Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-md border" 
                style={{ backgroundColor: cardData.borderColor }}
              ></div>
              <Input
                id="border-color"
                type="color"
                value={cardData.borderColor}
                onChange={(e) => handleColorChange("borderColor", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="border-radius">Border Radius</Label>
            <div className="flex items-center gap-4">
              <input 
                type="range"
                min="0"
                max="20"
                value={parseInt(cardData.borderRadius)}
                onChange={(e) => handleBorderRadiusChange(`${e.target.value}px`)}
                className="flex-1"
              />
              <span>{parseInt(cardData.borderRadius)}px</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="layers" className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Card Layers</h3>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addLayer('image')}
                >
                  Add Image
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addLayer('text')}
                >
                  Add Text
                </Button>
              </div>
            </div>
            
            {layers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No layers added yet</p>
                <p className="text-sm">Add images or text to overlay on your card</p>
              </div>
            ) : (
              <div className="space-y-2">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-2 border rounded-md ${
                      layer.id === activeLayer?.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        {layer.type === 'image' ? '🖼️' : 'T'}
                      </div>
                      <span>{layer.name || `Layer ${layer.id.substring(0, 4)}`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm" 
                        variant="ghost" 
                        onClick={() => moveLayerUp(layer.id)}
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm" 
                        variant="ghost" 
                        onClick={() => moveLayerDown(layer.id)}
                      >
                        ↓
                      </Button>
                      <Button
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteLayer(layer.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button onClick={onContinue} className="flex items-center gap-2">
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardDesignStep;
