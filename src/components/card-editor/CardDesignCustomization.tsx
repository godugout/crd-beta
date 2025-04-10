
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { CardStyle } from './types';

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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">Card Effect</Label>
          <RadioGroup 
            value={cardStyle.effect}
            onValueChange={handleEffectChange}
            className="grid grid-cols-2 gap-2 mt-2"
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
      </div>
      
      <div>
        <Label className="text-base font-semibold block mb-4">Preview</Label>
        {imageUrl ? (
          <div 
            className="aspect-[2.5/3.5] max-w-xs mx-auto border-2 overflow-hidden shadow-md" 
            style={{ 
              borderRadius: cardStyle.borderRadius,
              borderColor: cardStyle.borderColor || '#48BB78'
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
          <div className="aspect-[2.5/3.5] max-w-xs mx-auto border border-dashed rounded-lg flex items-center justify-center bg-gray-50">
            <p className="text-gray-400">Upload an image to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDesignCustomization;
