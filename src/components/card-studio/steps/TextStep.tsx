
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import ColorPicker from '@/components/ui/color-picker';

interface TextStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const FONT_FAMILY_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
];

const FONT_SIZE_OPTIONS = [
  { value: '12px', label: 'Small' },
  { value: '16px', label: 'Medium' },
  { value: '20px', label: 'Large' },
  { value: '24px', label: 'X-Large' },
  { value: '32px', label: 'XX-Large' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
];

const DEFAULT_TEXT_STYLE = {
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#000000',
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333',
};

const TextStep: React.FC<TextStepProps> = ({ cardData, onUpdate }) => {
  // Ensure we have design metadata with text style
  const designMetadata = cardData.designMetadata || {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '8px',
      borderColor: '#000000',
      backgroundColor: '#FFFFFF',
      shadowColor: 'rgba(0,0,0,0.2)',
      frameWidth: 2,
      frameColor: '#000000',
    },
    textStyle: DEFAULT_TEXT_STYLE,
    cardMetadata: {},
    marketMetadata: {}
  };

  // Get text style with fallback
  const textStyle = designMetadata.textStyle || DEFAULT_TEXT_STYLE;

  // Handle text style changes
  const handleTextStyleChange = (property: keyof typeof textStyle, value: any) => {
    onUpdate({
      designMetadata: {
        ...designMetadata,
        textStyle: {
          ...textStyle,
          [property]: value
        }
      }
    });
  };

  // Handle text content changes
  const handleTextChange = (property: 'title' | 'description', value: string) => {
    onUpdate({ [property]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Text & Typography</h2>
      
      {/* Text content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Card Title</Label>
          <Input
            id="title"
            value={cardData.title || ''}
            onChange={(e) => handleTextChange('title', e.target.value)}
            placeholder="Enter card title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={cardData.description || ''}
            onChange={(e) => handleTextChange('description', e.target.value)}
            placeholder="Brief description of the card"
          />
        </div>
      </div>
      
      <Tabs defaultValue="font" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="font">Font</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="font" className="space-y-4">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select 
              value={textStyle.fontFamily || 'Inter'}
              onValueChange={(value) => handleTextStyleChange('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Title Color</Label>
              <div className="w-24">
                <Input 
                  type="text" 
                  value={textStyle.titleColor || '#000000'} 
                  onChange={(e) => handleTextStyleChange('titleColor', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <ColorPicker 
              color={textStyle.titleColor || '#000000'}
              onChange={(color) => handleTextStyleChange('titleColor', color)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select 
              value={textStyle.fontSize || '16px'}
              onValueChange={(value) => handleTextStyleChange('fontSize', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Title Alignment</Label>
            <ToggleGroup 
              type="single" 
              value={textStyle.titleAlignment || 'center'}
              onValueChange={(value) => {
                if (value) handleTextStyleChange('titleAlignment', value);
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="left">
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-4">          
          <div className="space-y-2">
            <Label>Font Weight</Label>
            <Select 
              value={textStyle.titleWeight || 'bold'}
              onValueChange={(value) => handleTextStyleChange('titleWeight', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Description Color</Label>
              <div className="w-24">
                <Input 
                  type="text" 
                  value={textStyle.descriptionColor || '#333333'} 
                  onChange={(e) => handleTextStyleChange('descriptionColor', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <ColorPicker 
              color={textStyle.descriptionColor || '#333333'}
              onChange={(color) => handleTextStyleChange('descriptionColor', color)}
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextStep;
