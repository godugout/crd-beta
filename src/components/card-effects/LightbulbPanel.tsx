
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Paintbrush, Stars, Wand2 } from 'lucide-react';

interface LightbulbPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEffect: (effect: string) => void;
}

const LightbulbPanel: React.FC<LightbulbPanelProps> = ({
  isOpen,
  onClose,
  onApplyEffect
}) => {
  if (!isOpen) return null;

  const suggestedEffects = [
    {
      name: 'Holographic',
      description: 'Add a premium rainbow holographic effect',
      icon: <Stars className="w-4 h-4" />
    },
    {
      name: 'Refractor',
      description: 'Create a prismatic light-refracting pattern',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      name: 'Gold Foil',
      description: 'Apply elegant gold foil accents',
      icon: <Paintbrush className="w-4 h-4" />
    }
  ];

  const suggestions = [
    {
      title: 'Enhance Card Value',
      tips: [
        'Add holographic effects to rare cards',
        'Use gold foil for premium editions',
        'Apply refractor patterns for special editions'
      ]
    },
    {
      title: 'Improve Visibility',
      tips: [
        'Adjust contrast for better readability',
        'Highlight key card statistics',
        'Use complementary colors'
      ]
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-background border-l shadow-lg p-4 animate-in slide-in-from-right">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-500" />
          Creative Tools
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>

      <Tabs defaultValue="effects">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="effects" className="mt-4">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {suggestedEffects.map((effect) => (
                <Card key={effect.name} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {effect.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{effect.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {effect.description}
                      </p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => onApplyEffect(effect.name)}
                      >
                        Apply Effect
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-4">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {suggestions.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h4 className="font-medium">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.tips.map((tip, index) => (
                      <li key={index} className="flex gap-2 items-start text-sm">
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LightbulbPanel;
