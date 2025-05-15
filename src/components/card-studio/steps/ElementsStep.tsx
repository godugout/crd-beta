
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Square, 
  Circle, 
  Triangle, 
  Image as ImageIcon, 
  Type, 
  Sticker, 
  PlusCircle 
} from 'lucide-react';

interface ElementsStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const ElementsStep: React.FC<ElementsStepProps> = ({ cardData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");
  
  // This function will be expanded when drag and drop functionality is implemented
  const handleAddElement = (type: string) => {
    // For now, just show a console log but this will be expanded later
    console.log(`Adding element of type: ${type}`);
    // We would add a layer to the card data here
  };
  
  const elementTypes = [
    { name: 'Shape', icon: Square, action: () => handleAddElement('shape') },
    { name: 'Text', icon: Type, action: () => handleAddElement('text') },
    { name: 'Image', icon: ImageIcon, action: () => handleAddElement('image') },
    { name: 'Sticker', icon: Sticker, action: () => handleAddElement('sticker') },
  ];
  
  const shapeTypes = [
    { name: 'Rectangle', icon: Square, action: () => handleAddElement('rectangle') },
    { name: 'Circle', icon: Circle, action: () => handleAddElement('circle') },
    { name: 'Triangle', icon: Triangle, action: () => handleAddElement('triangle') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Card Elements</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add and arrange elements on your card
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="elements" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {elementTypes.map((element) => (
              <Button
                key={element.name}
                variant="outline"
                className="flex flex-col h-24 gap-2 items-center justify-center"
                onClick={element.action}
              >
                <element.icon className="h-8 w-8 opacity-70" />
                <span>{element.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-6">
            <Label className="block mb-2">Shapes</Label>
            <div className="grid grid-cols-3 gap-4">
              {shapeTypes.map((shape) => (
                <Button
                  key={shape.name}
                  variant="outline"
                  className="flex flex-col h-20 gap-1 items-center justify-center"
                  onClick={shape.action}
                >
                  <shape.icon className="h-6 w-6 opacity-70" />
                  <span className="text-sm">{shape.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 mt-4 rounded-md">
            <h3 className="text-sm font-medium flex items-center">
              <PlusCircle className="h-4 w-4 mr-1" />
              Pro Tip
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Drag elements onto the card preview to position them exactly where you want.
              Click on an element in the preview to edit its properties.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="stickers" className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div 
                key={`sticker-${index}`}
                className="aspect-square border rounded-md flex items-center justify-center hover:bg-gray-50 cursor-pointer"
              >
                <Sticker className="h-8 w-8 text-gray-400" />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button variant="outline">
              Browse More Stickers
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium mb-1">Coming Soon</h3>
            <p className="text-xs text-gray-500">
              Custom sticker uploads and community sticker marketplace will be available soon!
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="layers" className="space-y-4">
          <div className="border rounded-lg min-h-[200px] bg-gray-50 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-sm text-gray-500 mb-3">
                No layers added yet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('elements')}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Elements
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" disabled>
              Bring Forward
            </Button>
            <Button variant="outline" size="sm" disabled>
              Send Backward
            </Button>
            <Button variant="outline" size="sm" disabled>
              Delete
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElementsStep;
