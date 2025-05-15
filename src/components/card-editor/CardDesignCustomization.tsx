
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { CardStyle } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CardDesignCustomizationProps {
  imageUrl: string;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
}

const CardDesignCustomization: React.FC<CardDesignCustomizationProps> = ({
  imageUrl,
  cardStyle,
  setCardStyle
}) => {
  const [activeTab, setActiveTab] = useState<string>("style");
  
  const handleEffectChange = (effect: string) => {
    setCardStyle({
      ...cardStyle,
      effect
    });
  };
  
  const handleBorderRadiusChange = (value: number[]) => {
    const radius = `${value[0]}px`;
    setCardStyle({
      ...cardStyle,
      borderRadius: radius
    });
  };
  
  const handleBorderColorChange = (color: string) => {
    setCardStyle({
      ...cardStyle,
      borderColor: color
    });
  };
  
  const handleBackgroundColorChange = (color: string) => {
    setCardStyle({
      ...cardStyle,
      backgroundColor: color
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Card Effect</Label>
            <RadioGroup 
              value={cardStyle.effect}
              onValueChange={handleEffectChange}
              className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="classic" id="effect-classic" />
                <Label htmlFor="effect-classic" className="cursor-pointer">Classic</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="holographic" id="effect-holo" />
                <Label htmlFor="effect-holo" className="cursor-pointer">Holographic</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="chrome" id="effect-chrome" />
                <Label htmlFor="effect-chrome" className="cursor-pointer">Chrome</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="refractor" id="effect-refractor" />
                <Label htmlFor="effect-refractor" className="cursor-pointer">Refractor</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="vintage" id="effect-vintage" />
                <Label htmlFor="effect-vintage" className="cursor-pointer">Vintage</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="gold" id="effect-gold" />
                <Label htmlFor="effect-gold" className="cursor-pointer">Gold Foil</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Border Radius</Label>
              <span className="text-sm">{cardStyle.borderRadius}</span>
            </div>
            <Slider
              defaultValue={[parseInt(cardStyle.borderRadius)]}
              min={0}
              max={24}
              step={2}
              onValueChange={handleBorderRadiusChange}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-6">
          <div className="space-y-2">
            <Label>Border Color</Label>
            <ColorPicker 
              color={cardStyle.borderColor || '#48BB78'}
              onChange={handleBorderColorChange}
              colors={['#48BB78', '#F97316', '#2563EB', '#8B5CF6', '#EC4899', '#FFFFFF', '#000000']}
              className="mt-1"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker 
              color={cardStyle.backgroundColor || '#FFFFFF'}
              onChange={handleBackgroundColorChange}
              colors={['#FFFFFF', '#F2FCE2', '#FEC6A1', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#111827']}
              className="mt-1"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Label className="text-base font-semibold block mb-4">Preview</Label>
        <div className="flex items-center justify-center">
          {imageUrl ? (
            <div 
              className="aspect-[2.5/3.5] max-w-[240px] mx-auto border-2 overflow-hidden shadow-md" 
              style={{ 
                borderRadius: cardStyle.borderRadius,
                borderColor: cardStyle.borderColor || '#48BB78',
                backgroundColor: cardStyle.backgroundColor || 'transparent',
              }}
            >
              <img
                src={imageUrl}
                alt="Card preview"
                className="w-full h-full object-cover"
                style={{ 
                  borderRadius: `calc(${cardStyle.borderRadius} - 2px)`,
                  filter: cardStyle.effect === 'vintage' ? 'sepia(0.5)' : 
                         cardStyle.effect === 'chrome' ? 'contrast(1.1) brightness(1.1)' : 'none'
                }}
              />
            </div>
          ) : (
            <div className="aspect-[2.5/3.5] max-w-[240px] mx-auto border border-dashed rounded-lg flex items-center justify-center bg-gray-50 text-center p-4">
              <p className="text-gray-400">Upload an image to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDesignCustomization;
