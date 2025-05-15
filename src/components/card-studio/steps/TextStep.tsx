
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from '@/components/ui/color-picker';
import { FontBold, FontItalic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  onContinue?: () => void;
}

const TextStep: React.FC<TextStepProps> = ({ 
  cardData, 
  onUpdate, 
  onContinue 
}) => {
  // Access text style from design metadata or provide defaults
  const designMetadata = cardData.designMetadata || {};
  const textStyle = designMetadata.textStyle || {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333',
  };
  
  // Handle standard text field updates
  const handleTextChange = (field: 'title' | 'description', value: string) => {
    onUpdate({ [field]: value });
  };
  
  // Handle player info updates
  const handlePlayerInfoChange = (field: 'player' | 'team' | 'year', value: string) => {
    onUpdate({ [field]: value });
  };
  
  // Handle text style updates
  const handleTextStyleChange = (property: string, value: string) => {
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
  
  // Handle tag updates
  const handleTagsChange = (rawTags: string) => {
    // Convert comma-separated string to array
    const tagArray = rawTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    onUpdate({ tags: tagArray });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Card Text</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add and customize text for your card
        </p>
      </div>
      
      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content">Card Content</TabsTrigger>
          <TabsTrigger value="player">Player Info</TabsTrigger>
          <TabsTrigger value="styling">Text Styling</TabsTrigger>
        </TabsList>
        
        {/* Card Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="card-title">Card Title</Label>
            <Input
              id="card-title"
              placeholder="Enter card title"
              value={cardData.title || ''}
              onChange={(e) => handleTextChange('title', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              placeholder="Enter card description"
              value={cardData.description || ''}
              onChange={(e) => handleTextChange('description', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="card-tags">Tags</Label>
            <Input
              id="card-tags"
              placeholder="Enter tags separated by commas"
              value={cardData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: baseball, vintage, rare
            </p>
          </div>
        </TabsContent>
        
        {/* Player Info Tab */}
        <TabsContent value="player" className="space-y-4">
          <div>
            <Label htmlFor="player-name">Player Name</Label>
            <Input
              id="player-name"
              placeholder="Enter player name"
              value={cardData.player || ''}
              onChange={(e) => handlePlayerInfoChange('player', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="team-name">Team</Label>
            <Input
              id="team-name"
              placeholder="Enter team name"
              value={cardData.team || ''}
              onChange={(e) => handlePlayerInfoChange('team', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              placeholder="Enter year"
              value={cardData.year || ''}
              onChange={(e) => handlePlayerInfoChange('year', e.target.value)}
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Advanced Player Stats</h3>
            <p className="text-xs text-gray-500">
              Additional player statistics can be added in the advanced editor mode.
            </p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Open Advanced Editor
            </Button>
          </div>
        </TabsContent>
        
        {/* Text Styling Tab */}
        <TabsContent value="styling" className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Title Styling</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title-font">Font Family</Label>
                <Select
                  value={textStyle.fontFamily || 'sans-serif'}
                  onValueChange={(value) => handleTextStyleChange('fontFamily', value)}
                >
                  <SelectTrigger id="title-font">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title-color">Title Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <div className="w-10 h-10">
                      <Input
                        type="color"
                        id="title-color"
                        className="h-full"
                        value={textStyle.titleColor || '#000000'}
                        onChange={(e) => handleTextStyleChange('titleColor', e.target.value)}
                      />
                    </div>
                    <Input
                      type="text"
                      value={textStyle.titleColor || '#000000'}
                      onChange={(e) => handleTextStyleChange('titleColor', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Title Weight</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      variant={textStyle.titleWeight === 'normal' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleTextStyleChange('titleWeight', 'normal')}
                    >
                      Normal
                    </Button>
                    <Button
                      variant={textStyle.titleWeight === 'bold' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleTextStyleChange('titleWeight', 'bold')}
                    >
                      <FontBold className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Title Alignment</Label>
                <div className="flex space-x-2 mt-1">
                  <Button
                    variant={textStyle.titleAlignment === 'left' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleTextStyleChange('titleAlignment', 'left')}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={textStyle.titleAlignment === 'center' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleTextStyleChange('titleAlignment', 'center')}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={textStyle.titleAlignment === 'right' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleTextStyleChange('titleAlignment', 'right')}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Description Styling</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="desc-font">Font Family</Label>
                <Select
                  value={textStyle.descriptionFont || 'sans-serif'}
                  onValueChange={(value) => handleTextStyleChange('descriptionFont', value)}
                >
                  <SelectTrigger id="desc-font">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="desc-color">Description Color</Label>
                <div className="flex space-x-2 mt-1">
                  <div className="w-10 h-10">
                    <Input
                      type="color"
                      id="desc-color"
                      className="h-full"
                      value={textStyle.descriptionColor || '#333333'}
                      onChange={(e) => handleTextStyleChange('descriptionColor', e.target.value)}
                    />
                  </div>
                  <Input
                    type="text"
                    value={textStyle.descriptionColor || '#333333'}
                    onChange={(e) => handleTextStyleChange('descriptionColor', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="text-shadows" className="text-sm font-medium">Text Shadows</Label>
              <Switch id="text-shadows" />
            </div>
            <p className="text-xs text-gray-500">
              Enable drop shadows for improved readability on light backgrounds
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextStep;
