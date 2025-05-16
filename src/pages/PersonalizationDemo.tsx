
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import RecommendationEngine from '@/components/personalization/RecommendationEngine';
import { PersonalizationProvider } from '@/context/PersonalizationContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardTemplate } from '@/lib/types/templateTypes';
import { CardEffect } from '@/lib/types/cardTypes';
import { CardElement } from '@/lib/types/cardElements';
import { mockTemplates } from '@/data/mockTemplates';
import { premiumEffects } from '@/hooks/card-effects/utils';

// Mock card elements for demonstration
const mockElements: CardElement[] = [
  {
    id: 'element-1',
    name: 'Baseball',
    description: 'Sports ball sticker',
    type: 'sticker',
    category: 'sports',
    url: '/elements/baseball.png',
    thumbnailUrl: '/elements/baseball-thumb.png',
    tags: ['sports', 'ball', 'baseball']
  },
  {
    id: 'element-2',
    name: 'Trophy',
    description: 'Gold trophy sticker',
    type: 'badge',
    category: 'awards',
    url: '/elements/trophy.png',
    thumbnailUrl: '/elements/trophy-thumb.png',
    tags: ['award', 'achievement', 'trophy']
  },
  {
    id: 'element-3',
    name: 'Star Frame',
    description: 'Star-shaped decorative frame',
    type: 'frame',
    category: 'decorative',
    url: '/elements/star-frame.png',
    thumbnailUrl: '/elements/star-frame-thumb.png',
    tags: ['frame', 'star', 'decoration']
  }
];

const PersonalizationDemo: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('recommendations');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<CardEffect[]>([]);
  const [selectedElements, setSelectedElements] = useState<CardElement[]>([]);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [cardData, setCardData] = useState({
    imageUrl: '/lovable-uploads/236e3ad9-f7c2-4e5b-b29a-ca52a49ff3ed.png',
    title: 'Sample Card',
    tags: ['sports', 'baseball', 'athlete'],
    templateId: ''
  });

  const handleTemplateSelect = (template: CardTemplate) => {
    setSelectedTemplate(template);
    setCardData(prev => ({
      ...prev,
      templateId: template.id
    }));
  };

  const handleEffectSelect = (effect: CardEffect) => {
    setSelectedEffects(prev => {
      // Don't add duplicates
      if (prev.some(e => e.id === effect.id)) return prev;
      return [...prev, effect];
    });
  };

  const handleElementSelect = (element: CardElement) => {
    setSelectedElements(prev => {
      // Don't add duplicates
      if (prev.some(e => e.id === element.id)) return prev;
      return [...prev, element];
    });
  };

  const handleColorPaletteSelect = (colors: string[]) => {
    setColorPalette(colors);
  };

  return (
    <PersonalizationProvider>
      <PageLayout
        title="Personalization System"
        description="Card personalization and recommendation engine"
      >
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card preview section */}
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Card Design</CardTitle>
                  <CardDescription>Your current card design</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="aspect-[2.5/3.5] w-full max-w-xs bg-gray-100 rounded-lg overflow-hidden relative">
                    <img 
                      src={cardData.imageUrl}
                      alt="Card preview"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Show selected elements */}
                    {selectedElements.map((element, index) => (
                      <div 
                        key={element.id}
                        className="absolute"
                        style={{ 
                          top: `${20 + index * 15}%`, 
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '30%',
                          height: 'auto',
                          zIndex: 10 + index
                        }}
                      >
                        <img
                          src={element.url}
                          alt={element.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                    
                    {/* Show selected color palette */}
                    {colorPalette.length > 0 && (
                      <div className="absolute bottom-2 left-2 right-2 bg-white/80 p-2 rounded flex space-x-1">
                        {colorPalette.map((color, index) => (
                          <div 
                            key={index}
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 w-full">
                    <h3 className="font-medium text-lg">{cardData.title}</h3>
                    {selectedTemplate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Template: {selectedTemplate.name}
                      </p>
                    )}
                    
                    {selectedEffects.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium">Applied Effects:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedEffects.map(effect => (
                            <span 
                              key={effect.id}
                              className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5"
                            >
                              {effect.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recommendations section */}
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>Suggestions based on your image and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecommendationEngine
                    cardData={cardData}
                    availableTemplates={mockTemplates}
                    availableEffects={premiumEffects}
                    availableElements={mockElements}
                    onSelectTemplate={handleTemplateSelect}
                    onSelectEffect={handleEffectSelect}
                    onSelectElement={handleElementSelect}
                    onGenerateColorPalette={handleColorPaletteSelect}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </PersonalizationProvider>
  );
};

export default PersonalizationDemo;
