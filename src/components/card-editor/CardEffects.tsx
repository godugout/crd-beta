
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '../card-editor/cardEffects.css';

export interface EffectOption {
  id: string;
  name: string;
  className: string;
  description: string;
}

const effectOptions: Record<string, EffectOption[]> = {
  finish: [
    { id: 'refractor', name: 'Refractor', className: 'card-refractor-effect', description: 'Rainbow holographic effect' },
    { id: 'prism', name: 'Prism Chrome', className: 'card-prism-effect', description: 'Prismatic shine effect' },
    { id: 'chrome', name: 'Chrome', className: 'card-chrome-effect', description: 'Metallic chrome finish' },
    { id: 'gold', name: 'Gold Foil', className: 'card-gold-effect', description: 'Luxury gold foil finish' },
    { id: 'vintage', name: 'Vintage', className: 'card-vintage-effect', description: 'Aged, nostalgic look' },
  ],
  style: [
    { id: 'standard', name: 'Standard', className: '', description: 'Clean, traditional card style' },
    { id: 'modern', name: 'Modern', className: 'card-style-modern', description: 'Contemporary, sleek design' },
    { id: 'bold', name: 'Bold', className: 'card-style-bold', description: 'High contrast, vibrant look' },
    { id: 'minimal', name: 'Minimal', className: 'card-style-minimal', description: 'Simple, clean aesthetic' },
  ]
};

interface CardEffectsProps {
  selectedEffects: string[];
  onEffectsChange: (effects: string[]) => void;
  imageUrl: string;
}

const CardEffects: React.FC<CardEffectsProps> = ({ selectedEffects, onEffectsChange, imageUrl }) => {
  const [activeTab, setActiveTab] = useState<'finish' | 'style'>('finish');

  const toggleEffect = (effectId: string) => {
    if (selectedEffects.includes(effectId)) {
      // Remove effect
      onEffectsChange(selectedEffects.filter(id => id !== effectId));
    } else {
      // Add effect (limiting to 2 active effects)
      const newEffects = [...selectedEffects];
      if (newEffects.length >= 2) {
        newEffects.shift(); // Remove the oldest effect
      }
      newEffects.push(effectId);
      onEffectsChange(newEffects);
    }
  };

  const getEffectClassNames = () => {
    return selectedEffects
      .map(effectId => {
        const allOptions = [...effectOptions.finish, ...effectOptions.style];
        return allOptions.find(opt => opt.id === effectId)?.className || '';
      })
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Card Effects</h2>
      
      <Tabs 
        defaultValue="finish" 
        className="w-full"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'finish' | 'style')}
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="finish">Card Finish</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="finish" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-3">Select up to 2 effects (currently selected: {selectedEffects.length}/2)</p>
              <div className="grid grid-cols-2 gap-3">
                {effectOptions.finish.map((effect) => (
                  <Button
                    key={effect.id}
                    variant={selectedEffects.includes(effect.id) ? "default" : "outline"}
                    className="flex flex-col items-center justify-center p-4 h-auto"
                    onClick={() => toggleEffect(effect.id)}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {selectedEffects.includes(effect.id) && <Check className="w-4 h-4 mr-1" />}
                      <span className="font-medium">{effect.name}</span>
                    </div>
                    <span className="text-xs text-center">{effect.description}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="mb-2 text-gray-600 text-sm">Live Preview</p>
              <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden border shadow-sm">
                {selectedEffects.map((effectId, index) => {
                  const effect = [...effectOptions.finish, ...effectOptions.style].find(e => e.id === effectId);
                  return effect && (
                    <div key={effectId} className={`absolute inset-0 ${effect.className} z-${10 + index}`}></div>
                  );
                })}
                
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Card preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-3">Select up to 2 styles (currently selected: {selectedEffects.length}/2)</p>
              <div className="grid grid-cols-2 gap-3">
                {effectOptions.style.map((style) => (
                  <Button
                    key={style.id}
                    variant={selectedEffects.includes(style.id) ? "default" : "outline"}
                    className="flex flex-col items-center justify-center p-4 h-auto"
                    onClick={() => toggleEffect(style.id)}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {selectedEffects.includes(style.id) && <Check className="w-4 h-4 mr-1" />}
                      <span className="font-medium">{style.name}</span>
                    </div>
                    <span className="text-xs text-center">{style.description}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="mb-2 text-gray-600 text-sm">Style Preview</p>
              <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden border shadow-sm">
                {selectedEffects.map((effectId, index) => {
                  const effect = [...effectOptions.finish, ...effectOptions.style].find(e => e.id === effectId);
                  return effect && (
                    <div key={effectId} className={`absolute inset-0 ${effect.className} z-${10 + index}`}></div>
                  );
                })}
                
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Card preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardEffects;
