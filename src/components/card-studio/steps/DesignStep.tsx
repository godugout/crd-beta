
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorPicker from '@/components/ui/color-picker';

interface DesignStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const BORDER_RADIUS_OPTIONS = [
  { value: '0px', label: 'None' },
  { value: '4px', label: 'Small' },
  { value: '8px', label: 'Medium' },
  { value: '16px', label: 'Large' },
  { value: '24px', label: 'Extra Large' },
  { value: '9999px', label: 'Full' },
];

const TEMPLATE_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'premium', label: 'Premium' },
];

const EFFECT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'shadow', label: 'Shadow' },
  { value: 'glow', label: 'Glow' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'chrome', label: 'Chrome' },
];

const DesignStep: React.FC<DesignStepProps> = ({ cardData, onUpdate }) => {
  // Ensure we have design metadata
  const designMetadata = cardData.designMetadata || {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '8px',
      borderColor: '#000000',
      backgroundColor: '#FFFFFF',
      shadowColor: 'rgba(0,0,0,0.2)',
      frameWidth: 2,
      frameColor: '#000000'
    },
    textStyle: {
      fontFamily: 'Inter',
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#333333'
    },
    cardMetadata: {
      category: 'general',
      series: 'base',
      cardType: 'standard'
    },
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: false,
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 1,
      editionNumber: 1
    }
  };

  // Get card style with fallback
  const cardStyle = designMetadata.cardStyle || {};

  // Handle card style changes
  const handleStyleChange = (property: keyof typeof cardStyle, value: any) => {
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
      <h2 className="text-xl font-semibold">Card Design</h2>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="borders">Borders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Background Color</Label>
                  <div className="w-24">
                    <Input 
                      type="text" 
                      value={cardStyle.backgroundColor || '#FFFFFF'} 
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <ColorPicker 
                  color={cardStyle.backgroundColor || '#FFFFFF'}
                  onChange={(color) => handleStyleChange('backgroundColor', color)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Card Effect</Label>
                <Select 
                  value={cardStyle.effect || 'none'}
                  onValueChange={(value) => handleStyleChange('effect', value)}
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
            </div>
            
            {cardStyle.effect !== 'none' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Shadow Color</Label>
                  <div className="w-24">
                    <Input 
                      type="text" 
                      value={cardStyle.shadowColor || 'rgba(0,0,0,0.2)'} 
                      onChange={(e) => handleStyleChange('shadowColor', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <ColorPicker 
                  color={cardStyle.shadowColor || 'rgba(0,0,0,0.2)'}
                  onChange={(color) => handleStyleChange('shadowColor', color)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="template" className="space-y-4">
          <div className="space-y-2">
            <Label>Template Style</Label>
            <Select 
              value={cardStyle.template || 'classic'}
              onValueChange={(value) => handleStyleChange('template', value)}
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
            <p className="text-xs text-gray-500 mt-1">
              Template affects the overall look and feel of your card
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="borders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Select 
                value={cardStyle.borderRadius || '8px'}
                onValueChange={(value) => handleStyleChange('borderRadius', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select radius" />
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
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Border Color</Label>
                <div className="w-24">
                  <Input 
                    type="text" 
                    value={cardStyle.borderColor || '#000000'} 
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <ColorPicker 
                color={cardStyle.borderColor || '#000000'}
                onChange={(color) => handleStyleChange('borderColor', color)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frame Width</Label>
              <Input 
                type="number" 
                value={cardStyle.frameWidth || 2} 
                onChange={(e) => handleStyleChange('frameWidth', parseInt(e.target.value))}
                min="0"
                max="20"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Frame Color</Label>
                <div className="w-24">
                  <Input 
                    type="text" 
                    value={cardStyle.frameColor || '#000000'} 
                    onChange={(e) => handleStyleChange('frameColor', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <ColorPicker 
                color={cardStyle.frameColor || '#000000'}
                onChange={(color) => handleStyleChange('frameColor', color)}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignStep;
