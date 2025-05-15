
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Slider
} from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DesignStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const DesignStep: React.FC<DesignStepProps> = ({ cardData, onUpdate }) => {
  // Initialize designMetadata with all required properties
  const designMetadata = cardData.designMetadata || {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '8px',
      borderColor: '#000000',
      frameColor: '#000000',
      frameWidth: 2,
      shadowColor: 'rgba(0,0,0,0.2)',
    },
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#333333',
    },
    cardMetadata: {
      category: 'standard',
      series: 'base',
      cardType: 'player',
    },
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: false,
    }
  };

  // Access current style settings with defaults
  const cardStyle = designMetadata.cardStyle || {};
  
  const handleStyleChange = (key: string, value: string | number) => {
    onUpdate({
      designMetadata: {
        ...designMetadata,
        cardStyle: {
          ...designMetadata.cardStyle,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Card Design</h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose a template and customize the appearance of your card
        </p>
      </div>
      
      <Tabs defaultValue="template">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {/* Template Tab */}
        <TabsContent value="template" className="space-y-4">
          <div>
            <Label htmlFor="card-template">Card Template</Label>
            <Select 
              value={cardStyle.template || 'classic'} 
              onValueChange={(value) => handleStyleChange('template', value)}
            >
              <SelectTrigger id="card-template">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 border rounded-lg p-4 text-center hover:bg-gray-200 cursor-pointer">
              <div className="aspect-[2.5/3.5] rounded-lg bg-white border-2 mb-2"></div>
              <p className="text-sm font-medium">Classic</p>
            </div>
            <div className="bg-gray-100 border rounded-lg p-4 text-center hover:bg-gray-200 cursor-pointer">
              <div className="aspect-[2.5/3.5] rounded-lg bg-white border border-gray-300 shadow-md mb-2"></div>
              <p className="text-sm font-medium">Modern</p>
            </div>
            <div className="bg-gray-100 border rounded-lg p-4 text-center hover:bg-gray-200 cursor-pointer">
              <div className="aspect-[2.5/3.5] rounded-lg bg-amber-50 border-2 border-amber-800 mb-2"></div>
              <p className="text-sm font-medium">Vintage</p>
            </div>
            <div className="bg-gray-100 border rounded-lg p-4 text-center hover:bg-gray-200 cursor-pointer">
              <div className="aspect-[2.5/3.5] rounded-lg bg-white mb-2"></div>
              <p className="text-sm font-medium">Minimalist</p>
            </div>
          </div>
        </TabsContent>
        
        {/* Style Tab */}
        <TabsContent value="style" className="space-y-4">
          <div>
            <Label htmlFor="border-radius">Border Radius</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="border-radius"
                min={0}
                max={20}
                step={1}
                defaultValue={[parseInt(cardStyle.borderRadius || '8') || 8]}
                onValueChange={(value) => handleStyleChange('borderRadius', `${value[0]}px`)}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12">
                {parseInt(cardStyle.borderRadius || '8') || 8}px
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="border-color">Border Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="color"
                  id="border-color"
                  value={cardStyle.borderColor || '#000000'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="w-10 h-10 p-1"
                />
                <Input
                  type="text"
                  value={cardStyle.borderColor || '#000000'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="frame-color">Frame Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="color"
                  id="frame-color"
                  value={cardStyle.frameColor || '#000000'}
                  onChange={(e) => handleStyleChange('frameColor', e.target.value)}
                  className="w-10 h-10 p-1"
                />
                <Input
                  type="text"
                  value={cardStyle.frameColor || '#000000'}
                  onChange={(e) => handleStyleChange('frameColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="frame-width">Frame Width</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="frame-width"
                min={0}
                max={10}
                step={1}
                defaultValue={[cardStyle.frameWidth || 2]}
                onValueChange={(value) => handleStyleChange('frameWidth', value[0])}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12">
                {cardStyle.frameWidth || 2}px
              </span>
            </div>
          </div>
        </TabsContent>
        
        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label htmlFor="effect-type">Effect Type</Label>
            <Select 
              value={cardStyle.effect || 'none'} 
              onValueChange={(value) => handleStyleChange('effect', value)}
            >
              <SelectTrigger id="effect-type">
                <SelectValue placeholder="Select effect" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="shadow">Shadow</SelectItem>
                <SelectItem value="glow">Glow</SelectItem>
                <SelectItem value="inner-shadow">Inner Shadow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="shadow-color">Shadow Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="color"
                id="shadow-color"
                value={(cardStyle.shadowColor || 'rgba(0,0,0,0.2)').replace(/[^#\w]/g, '') || '#000000'}
                onChange={(e) => handleStyleChange('shadowColor', e.target.value)}
                className="w-10 h-10 p-1"
              />
              <Input
                type="text"
                value={cardStyle.shadowColor || 'rgba(0,0,0,0.2)'}
                onChange={(e) => handleStyleChange('shadowColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Advanced Template Settings</h3>
            <p className="text-xs text-gray-500">
              These settings control detailed aspects of your card's appearance. 
              Changes here will override template defaults.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignStep;
