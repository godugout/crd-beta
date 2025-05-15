
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Image, Type, Square, Sticker } from 'lucide-react';
import { toastUtils } from '@/lib/utils/toast-utils';

interface ElementsStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const ElementsStep: React.FC<ElementsStepProps> = ({ cardData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("images");

  const handleAddElement = (type: string) => {
    // This is a placeholder - we'll implement the actual element adding functionality in a future enhancement
    toastUtils.info(
      `Adding ${type}`,
      "Element functionality will be implemented in a future update"
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Add Elements</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="shapes">Shapes</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Add images to your card design</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('image')}
              >
                <Image className="h-8 w-8 text-primary" />
                <span>Upload Image</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('logo')}
              >
                <Image className="h-8 w-8 text-primary" />
                <span>Add Logo</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="text">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Add text elements to your card</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('heading')}
              >
                <Type className="h-8 w-8 text-primary" />
                <span>Heading</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('paragraph')}
              >
                <Type className="h-8 w-8 text-primary" />
                <span>Paragraph</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="shapes">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Add shapes to your card design</p>
            
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('rectangle')}
              >
                <Square className="h-6 w-6 text-primary" />
                <span className="text-xs">Rectangle</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('circle')}
              >
                <div className="h-6 w-6 rounded-full border-2 border-primary"></div>
                <span className="text-xs">Circle</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('line')}
              >
                <div className="h-0 w-6 border-t-2 border-primary"></div>
                <span className="text-xs">Line</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stickers">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Add stickers and badges to your card</p>
            
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('badge')}
              >
                <Sticker className="h-6 w-6 text-primary" />
                <span className="text-xs">Badge</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('star')}
              >
                <div className="h-6 w-6 text-primary">★</div>
                <span className="text-xs">Star</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleAddElement('emoji')}
              >
                <div className="h-6 w-6 text-primary">🏆</div>
                <span className="text-xs">Emoji</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
        <h3 className="text-amber-800 text-sm font-medium mb-1">Coming Soon</h3>
        <p className="text-amber-700 text-xs">
          The full element editor with drag-and-drop support will be available in an upcoming update.
          Check back soon for enhanced card creation features!
        </p>
      </div>
    </div>
  );
};

export default ElementsStep;
