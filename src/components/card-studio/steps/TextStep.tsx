
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const TextStep: React.FC<TextStepProps> = ({ cardData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<string>("content");
  
  // Get design metadata from card data or use default values
  const designMetadata = cardData.designMetadata || {
    textStyle: {
      titleFont: 'Inter',
      titleSize: '24px',
      titleColor: '#000000',
      titleAlignment: 'center',
      descriptionFont: 'Inter',
      descriptionSize: '16px',
      descriptionColor: '#333333',
    }
  };
  
  const textStyle = designMetadata.textStyle || {};
  
  const handleTextStyleChange = (key: string, value: string) => {
    onUpdate({
      designMetadata: {
        ...designMetadata,
        textStyle: {
          ...designMetadata.textStyle,
          [key]: value
        }
      }
    });
  };
  
  const handleContentChange = (key: string, value: string) => {
    onUpdate({
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Text & Content</h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize the text content and style of your card
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="card-title">Card Title</Label>
            <Input
              id="card-title"
              value={cardData.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder="Enter card title"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              value={cardData.description || ''}
              onChange={(e) => handleContentChange('description', e.target.value)}
              placeholder="Enter card description"
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="card-player">Player Name</Label>
              <Input
                id="card-player"
                value={cardData.player || ''}
                onChange={(e) => handleContentChange('player', e.target.value)}
                placeholder="Player name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="card-team">Team</Label>
              <Input
                id="card-team"
                value={cardData.team || ''}
                onChange={(e) => handleContentChange('team', e.target.value)}
                placeholder="Team name"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="card-year">Year</Label>
            <Input
              id="card-year"
              value={cardData.year || ''}
              onChange={(e) => handleContentChange('year', e.target.value)}
              placeholder="Year"
              className="mt-1 w-32"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div>
            <Label htmlFor="title-font">Title Font</Label>
            <Select
              value={textStyle.titleFont || 'Inter'}
              onValueChange={(value) => handleTextStyleChange('titleFont', value)}
            >
              <SelectTrigger id="title-font">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title-color">Title Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  id="title-color"
                  value={textStyle.titleColor || '#000000'}
                  onChange={(e) => handleTextStyleChange('titleColor', e.target.value)}
                  className="w-10 h-10 p-1"
                />
                <Input
                  type="text"
                  value={textStyle.titleColor || '#000000'}
                  onChange={(e) => handleTextStyleChange('titleColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="title-size">Title Size</Label>
              <Select
                value={textStyle.titleSize || '24px'}
                onValueChange={(value) => handleTextStyleChange('titleSize', value)}
              >
                <SelectTrigger id="title-size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16px">Small (16px)</SelectItem>
                  <SelectItem value="20px">Medium (20px)</SelectItem>
                  <SelectItem value="24px">Large (24px)</SelectItem>
                  <SelectItem value="32px">Extra Large (32px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Title Alignment</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant={textStyle.titleAlignment === 'left' ? 'default' : 'outline'}
                size="icon"
                onClick={() => handleTextStyleChange('titleAlignment', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={textStyle.titleAlignment === 'center' ? 'default' : 'outline'}
                size="icon"
                onClick={() => handleTextStyleChange('titleAlignment', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={textStyle.titleAlignment === 'right' ? 'default' : 'outline'}
                size="icon"
                onClick={() => handleTextStyleChange('titleAlignment', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <Label>Text Effects</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Glow</h3>
                <p className="text-xs text-gray-500">Add a subtle glow around text</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Shadow</h3>
                <p className="text-xs text-gray-500">Add depth with text shadow</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Outline</h3>
                <p className="text-xs text-gray-500">Add outline to text</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Gradient</h3>
                <p className="text-xs text-gray-500">Gradient colored text</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Text Tips</h3>
            <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
              <li>Keep your title concise for better readability</li>
              <li>Use contrast colors between text and background</li>
              <li>Maintain consistent font usage across your cards</li>
              <li>Consider the overall card theme when styling text</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextStep;
