
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export interface CardStyle {
  effect: string;
  brightness: number;
  contrast: number;
  saturation: number;
  borderWidth: number;
  borderRadius: string; // String type to match Card interface
  borderColor: string;
  backgroundColor: string;
}

interface CardDesignCustomizationProps {
  imageUrl: string;
  cardStyle: CardStyle;
  setCardStyle: React.Dispatch<React.SetStateAction<CardStyle>>;
}

const CardDesignCustomization: React.FC<CardDesignCustomizationProps> = ({
  imageUrl,
  cardStyle,
  setCardStyle
}) => {
  const handleEffectChange = (value: string) => {
    setCardStyle((prev) => ({ ...prev, effect: value }));
  };

  const handleBrightnessChange = (value: number[]) => {
    setCardStyle((prev) => ({ ...prev, brightness: value[0] }));
  };

  const handleContrastChange = (value: number[]) => {
    setCardStyle((prev) => ({ ...prev, contrast: value[0] }));
  };

  const handleSaturationChange = (value: number[]) => {
    setCardStyle((prev) => ({ ...prev, saturation: value[0] }));
  };

  const handleBorderWidthChange = (value: number[]) => {
    setCardStyle((prev) => ({ ...prev, borderWidth: value[0] }));
  };

  const handleBorderRadiusChange = (value: string) => {
    setCardStyle((prev) => ({ ...prev, borderRadius: value }));
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardStyle((prev) => ({ ...prev, borderColor: e.target.value }));
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardStyle((prev) => ({ ...prev, backgroundColor: e.target.value }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Card Design Customization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="effect">Card Effect</Label>
            <Select
              value={cardStyle.effect}
              onValueChange={handleEffectChange}
            >
              <SelectTrigger id="effect" className="w-full">
                <SelectValue placeholder="Select effect" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="refractor">Refractor</SelectItem>
                <SelectItem value="prism">Prism</SelectItem>
                <SelectItem value="chrome">Chrome</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="image">Image Adjustments</TabsTrigger>
              <TabsTrigger value="border">Border & Background</TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="brightness">Brightness</Label>
                    <span className="text-sm text-gray-500">{cardStyle.brightness}%</span>
                  </div>
                  <Slider
                    id="brightness"
                    min={0}
                    max={200}
                    step={1}
                    value={[cardStyle.brightness]}
                    onValueChange={handleBrightnessChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="contrast">Contrast</Label>
                    <span className="text-sm text-gray-500">{cardStyle.contrast}%</span>
                  </div>
                  <Slider
                    id="contrast"
                    min={0}
                    max={200}
                    step={1}
                    value={[cardStyle.contrast]}
                    onValueChange={handleContrastChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="saturation">Saturation</Label>
                    <span className="text-sm text-gray-500">{cardStyle.saturation}%</span>
                  </div>
                  <Slider
                    id="saturation"
                    min={0}
                    max={200}
                    step={1}
                    value={[cardStyle.saturation]}
                    onValueChange={handleSaturationChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="border" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="border-width">Border Width</Label>
                    <span className="text-sm text-gray-500">{cardStyle.borderWidth}px</span>
                  </div>
                  <Slider
                    id="border-width"
                    min={0}
                    max={10}
                    step={1}
                    value={[cardStyle.borderWidth]}
                    onValueChange={handleBorderWidthChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <Select
                    value={cardStyle.borderRadius}
                    onValueChange={handleBorderRadiusChange}
                  >
                    <SelectTrigger id="border-radius" className="w-full">
                      <SelectValue placeholder="Select border radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0px">None (0px)</SelectItem>
                      <SelectItem value="4px">Small (4px)</SelectItem>
                      <SelectItem value="8px">Medium (8px)</SelectItem>
                      <SelectItem value="12px">Large (12px)</SelectItem>
                      <SelectItem value="16px">Extra Large (16px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="border-color">Border Color</Label>
                    <div className="flex">
                      <Input
                        id="border-color"
                        type="color"
                        value={cardStyle.borderColor}
                        onChange={handleBorderColorChange}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        type="text"
                        value={cardStyle.borderColor}
                        onChange={handleBorderColorChange}
                        className="flex-1 ml-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="flex">
                      <Input
                        id="background-color"
                        type="color"
                        value={cardStyle.backgroundColor}
                        onChange={handleBackgroundColorChange}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        type="text"
                        value={cardStyle.backgroundColor}
                        onChange={handleBackgroundColorChange}
                        className="flex-1 ml-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div 
              className="w-full aspect-[2.5/3.5] rounded overflow-hidden"
              style={{ 
                borderWidth: `${cardStyle.borderWidth}px`,
                borderColor: cardStyle.borderColor,
                borderStyle: 'solid',
                borderRadius: cardStyle.borderRadius,
                backgroundColor: cardStyle.backgroundColor
              }}
            >
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Card preview" 
                  className="w-full h-full object-cover"
                  style={{ 
                    filter: `brightness(${cardStyle.brightness}%) contrast(${cardStyle.contrast}%) saturate(${cardStyle.saturation}%)`
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDesignCustomization;
