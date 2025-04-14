
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Image, Award, Sticker, Triangle, Circle, Square, Star } from 'lucide-react';

interface ElementsPanelProps {
  onAddElement: (element: { url: string; type: 'image' | 'shape' | 'icon'; name: string }) => void;
  sportType?: string;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ onAddElement, sportType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Demo elements - in a real app, these would come from a proper asset library
  const backgrounds = [
    { url: '/assets/backgrounds/field.jpg', name: 'Sports Field' },
    { url: '/assets/backgrounds/stadium.jpg', name: 'Stadium' },
    { url: '/assets/backgrounds/abstract.jpg', name: 'Abstract' },
    { url: '/assets/backgrounds/gradient.jpg', name: 'Gradient' }
  ];
  
  const icons = [
    { url: '/assets/icons/trophy.svg', name: 'Trophy' },
    { url: '/assets/icons/medal.svg', name: 'Medal' },
    { url: '/assets/icons/star.svg', name: 'Star' },
    { url: '/assets/icons/flame.svg', name: 'Flame' },
    { url: '/assets/icons/shield.svg', name: 'Shield' },
    { url: '/assets/icons/crown.svg', name: 'Crown' }
  ];
  
  const logos = [
    { url: '/assets/logos/team1.svg', name: 'Team Logo 1' },
    { url: '/assets/logos/team2.svg', name: 'Team Logo 2' },
    { url: '/assets/logos/team3.svg', name: 'Team Logo 3' }
  ];
  
  const shapes = [
    { shape: 'rectangle', name: 'Rectangle' },
    { shape: 'circle', name: 'Circle' },
    { shape: 'triangle', name: 'Triangle' },
    { shape: 'hexagon', name: 'Hexagon' },
    { shape: 'star', name: 'Star' }
  ];

  // For now, we'll use placeholder images if assets don't exist yet
  const imagePlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30,40 L70,40 L70,60 L30,60 Z' fill='%23e0e0e0'/%3E%3C/svg%3E";
  
  const handleAddShape = (shape: string) => {
    // In a real app, we might generate SVG paths or use specialized shape components
    onAddElement({
      url: shape, // This would actually be an identifier for the shape
      type: 'shape',
      name: `${shape.charAt(0).toUpperCase() + shape.slice(1)} Shape`
    });
  };
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium text-lg">Design Elements</h3>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search elements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Tabs defaultValue="backgrounds">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="backgrounds">
            <Image className="h-4 w-4 mr-1" /> BG
          </TabsTrigger>
          <TabsTrigger value="icons">
            <Award className="h-4 w-4 mr-1" /> Icons
          </TabsTrigger>
          <TabsTrigger value="logos">
            <Sticker className="h-4 w-4 mr-1" /> Logos
          </TabsTrigger>
          <TabsTrigger value="shapes">
            <Triangle className="h-4 w-4 mr-1" /> Shapes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="backgrounds" className="mt-4 max-h-[400px] overflow-auto">
          <div className="grid grid-cols-2 gap-2">
            {backgrounds.map((bg, index) => (
              <div 
                key={`bg-${index}`}
                className="aspect-[3/4] relative border rounded-md cursor-pointer overflow-hidden"
                onClick={() => onAddElement({...bg, type: 'image'})}
              >
                <img 
                  src={bg.url || imagePlaceholder} 
                  alt={bg.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = imagePlaceholder)}
                />
                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 py-1 px-2">
                  <span className="text-xs text-white truncate block">{bg.name}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="icons" className="mt-4 max-h-[400px] overflow-auto">
          <div className="grid grid-cols-3 gap-2">
            {icons.map((icon, index) => (
              <div 
                key={`icon-${index}`}
                className="aspect-square relative border rounded-md cursor-pointer overflow-hidden p-2 flex flex-col items-center justify-center"
                onClick={() => onAddElement({...icon, type: 'icon'})}
              >
                <div className="flex-1 flex items-center justify-center">
                  <img 
                    src={icon.url || imagePlaceholder} 
                    alt={icon.name} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => (e.currentTarget.src = imagePlaceholder)}
                  />
                </div>
                <span className="text-xs text-center truncate block mt-1">{icon.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="logos" className="mt-4 max-h-[400px] overflow-auto">
          <div className="grid grid-cols-2 gap-2">
            {logos.map((logo, index) => (
              <div 
                key={`logo-${index}`}
                className="aspect-video relative border rounded-md cursor-pointer overflow-hidden p-2 flex items-center justify-center"
                onClick={() => onAddElement({...logo, type: 'image'})}
              >
                <img 
                  src={logo.url || imagePlaceholder} 
                  alt={logo.name} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => (e.currentTarget.src = imagePlaceholder)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="shapes" className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            <div 
              className="aspect-square border rounded-md cursor-pointer flex items-center justify-center"
              onClick={() => handleAddShape('rectangle')}
            >
              <Square className="h-10 w-10 text-muted-foreground" />
            </div>
            <div 
              className="aspect-square border rounded-md cursor-pointer flex items-center justify-center"
              onClick={() => handleAddShape('circle')}
            >
              <Circle className="h-10 w-10 text-muted-foreground" />
            </div>
            <div 
              className="aspect-square border rounded-md cursor-pointer flex items-center justify-center"
              onClick={() => handleAddShape('triangle')}
            >
              <Triangle className="h-10 w-10 text-muted-foreground" />
            </div>
            <div 
              className="aspect-square border rounded-md cursor-pointer flex items-center justify-center"
              onClick={() => handleAddShape('star')}
            >
              <Star className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 pt-4 border-t">
        <Button variant="outline" className="w-full" size="sm">
          Upload Custom Element
        </Button>
      </div>
    </div>
  );
};

export default ElementsPanel;
