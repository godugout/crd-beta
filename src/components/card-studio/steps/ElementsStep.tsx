
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Image, Text, Shapes, Sticker, Move } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ElementsStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const ElementsStep: React.FC<ElementsStepProps> = ({ cardData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<string>("stickers");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Sample stickers for demonstration
  const SAMPLE_STICKERS = [
    { id: 'sticker1', name: 'Star', imageUrl: '/placeholder-card.png' },
    { id: 'sticker2', name: 'Trophy', imageUrl: '/placeholder-card.png' },
    { id: 'sticker3', name: 'Fire', imageUrl: '/placeholder-card.png' },
    { id: 'sticker4', name: 'Sparkle', imageUrl: '/placeholder-card.png' },
    { id: 'sticker5', name: 'Lightning', imageUrl: '/placeholder-card.png' },
    { id: 'sticker6', name: 'Crown', imageUrl: '/placeholder-card.png' },
  ];
  
  // Sample shapes
  const SAMPLE_SHAPES = [
    { id: 'shape1', name: 'Circle', type: 'circle' },
    { id: 'shape2', name: 'Square', type: 'square' },
    { id: 'shape3', name: 'Triangle', type: 'triangle' },
    { id: 'shape4', name: 'Hexagon', type: 'hexagon' },
    { id: 'shape5', name: 'Star', type: 'star' },
  ];

  const handleAddElement = (type: string, content: string) => {
    // In a real implementation, this would add a new element to the card layers
    console.log(`Adding ${type} element:`, content);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Card Elements</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add stickers, text, and shapes to enhance your card
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="shapes">Shapes</TabsTrigger>
        </TabsList>
        
        {/* Stickers Tab */}
        <TabsContent value="stickers" className="space-y-4">
          <ScrollArea className="h-64 border rounded-md p-4">
            <div className="grid grid-cols-3 gap-4">
              {SAMPLE_STICKERS.map((sticker) => (
                <div 
                  key={sticker.id}
                  className="aspect-square border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAddElement('sticker', sticker.id)}
                >
                  <img 
                    src={sticker.imageUrl} 
                    alt={sticker.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <Button className="w-full" onClick={() => handleAddElement('sticker', 'custom')}>
            <Plus className="h-4 w-4 mr-2" /> Add Custom Sticker
          </Button>
        </TabsContent>
        
        {/* Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Input 
                id="text-content"
                placeholder="Enter text to add to card"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="text-color">Text Color</Label>
                <Input 
                  type="color" 
                  id="text-color" 
                  value="#000000" 
                  className="h-10"
                />
              </div>
              
              <div>
                <Label htmlFor="text-size">Text Size</Label>
                <Slider
                  id="text-size"
                  min={8}
                  max={72}
                  step={1}
                  defaultValue={[24]}
                />
              </div>
            </div>
            
            <Button onClick={() => handleAddElement('text', 'Sample Text')}>
              <Text className="h-4 w-4 mr-2" /> Add Text
            </Button>
          </div>
        </TabsContent>
        
        {/* Shapes Tab */}
        <TabsContent value="shapes" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {SAMPLE_SHAPES.map((shape) => (
              <div 
                key={shape.id}
                className="aspect-square border rounded-md flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-50"
                onClick={() => handleAddElement('shape', shape.type)}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  {/* Simple shape preview would go here */}
                </div>
                <span className="text-xs mt-2">{shape.name}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shape-color">Shape Color</Label>
              <Input 
                type="color" 
                id="shape-color" 
                value="#4C6EF5" 
                className="h-10"
              />
            </div>
            
            <div>
              <Label htmlFor="shape-opacity">Opacity</Label>
              <Slider
                id="shape-opacity"
                min={0}
                max={100}
                step={1}
                defaultValue={[100]}
              />
            </div>
          </div>
          
          <Button onClick={() => handleAddElement('shape', 'custom')}>
            <Shapes className="h-4 w-4 mr-2" /> Add Shape
          </Button>
        </TabsContent>
      </Tabs>
      
      {/* Element list - in a real app would show currently added elements */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Added Elements</h3>
        <div className="border rounded-md p-2 min-h-[100px] bg-gray-50">
          <p className="text-gray-400 text-sm text-center pt-8">
            No elements added yet. Use the tabs above to add elements.
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-md p-4 text-sm text-blue-600">
        <h3 className="font-medium mb-1">Pro Tip</h3>
        <p>
          You can drag elements directly onto the card preview to position them precisely.
          Use the handles to resize or rotate elements.
        </p>
      </div>
    </div>
  );
};

export default ElementsStep;
