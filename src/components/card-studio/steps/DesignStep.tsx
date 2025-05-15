import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '@/components/ui/color-picker';

interface DesignStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const TEMPLATE_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'bold', label: 'Bold' },
];

const BORDER_RADIUS_OPTIONS = [
  { value: '0px', label: 'Square' },
  { value: '4px', label: 'Slightly Rounded' },
  { value: '8px', label: 'Rounded' },
  { value: '16px', label: 'Very Rounded' },
  { value: '24px', label: 'Pill' },
];

const EFFECT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'holographic', label: 'Holographic' },
  { value: 'gold-foil', label: 'Gold Foil' },
  { value: 'silver-foil', label: 'Silver Foil' },
  { value: 'gloss', label: 'Gloss' },
  { value: 'matte', label: 'Matte' },
];

const DEFAULT_CARD_STYLE = {
  template: 'classic',
  effect: 'none',
  borderRadius: '8px',
  borderWidth: 2,
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  shadowColor: 'rgba(0,0,0,0.2)',
  frameWidth: 2,
  frameColor: '#000000',
};

const DesignStep: React.FC<DesignStepProps> = ({ cardData, onUpdate }) => {
  // Ensure we have default design metadata
  const designMetadata = cardData.designMetadata || {
    cardStyle: DEFAULT_CARD_STYLE,
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#333333',
    },
    cardMetadata: {
      category: 'general',
      series: 'base',
      cardType: 'standard',
    },
    marketMetadata: {
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 1,
      editionNumber: 1,
    }
  };

  // Ensure cardStyle is never undefined
  const cardStyle = designMetadata.cardStyle || DEFAULT_CARD_STYLE;

  // Handle updates to card style properties
  const handleCardStyleChange = (property: keyof typeof cardStyle, value: any) => {
    onUpdate({
      designMetadata: {
        ...designMetadata,
        cardStyle: {
          ...cardStyle,
          [property]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Design Your Card</h2>
      
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="border">Border</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-2">
            <Label>Card Template</Label>
            <Select 
              value={cardStyle.template || 'classic'}
              onValueChange={(value) => handleCardStyleChange('template', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Select 
              value={cardStyle.borderRadius || '8px'}
              onValueChange={(value) => handleCardStyleChange('borderRadius', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select border radius" />
              </SelectTrigger>
              <SelectContent>
                {BORDER_RADIUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="border" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Border Color</Label>
              <div className="w-24">
                <Input 
                  type="text" 
                  value={cardStyle.borderColor || '#000000'} 
                  onChange={(e) => handleCardStyleChange('borderColor', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <ColorPicker 
              color={cardStyle.borderColor || '#000000'}
              onChange={(color) => handleCardStyleChange('borderColor', color)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Frame Color</Label>
              <div className="w-24">
                <Input 
                  type="text" 
                  value={cardStyle.frameColor || '#000000'} 
                  onChange={(e) => handleCardStyleChange('frameColor', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <ColorPicker 
              color={cardStyle.frameColor || '#000000'}
              onChange={(color) => handleCardStyleChange('frameColor', color)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Frame Width</Label>
              <span className="text-sm">{cardStyle.frameWidth || 2}px</span>
            </div>
            <Slider
              value={[cardStyle.frameWidth || 2]}
              min={0}
              max={10}
              step={1}
              onValueChange={([value]) => handleCardStyleChange('frameWidth', value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-4">
          <div className="space-y-2">
            <Label>Card Effect</Label>
            <Select 
              value={cardStyle.effect || 'none'}
              onValueChange={(value) => handleCardStyleChange('effect', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select effect" />
              </SelectTrigger>
              <SelectContent>
                {EFFECT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Shadow Color</Label>
              <div className="w-24">
                <Input 
                  type="text" 
                  value={cardStyle.shadowColor || 'rgba(0,0,0,0.2)'} 
                  onChange={(e) => handleCardStyleChange('shadowColor', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <ColorPicker 
              color={cardStyle.shadowColor || 'rgba(0,0,0,0.2)'}
              onChange={(color) => handleCardStyleChange('shadowColor', color)}
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignStep;
