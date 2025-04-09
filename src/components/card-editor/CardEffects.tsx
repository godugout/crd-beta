
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
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
  selectedEffect: string;
  onEffectChange: (effect: string) => void;
  imageUrl: string;
}

const CardEffects: React.FC<CardEffectsProps> = ({ selectedEffect, onEffectChange, imageUrl }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Card Effects</h2>
      
      <Tabs defaultValue="finish" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="finish">Card Finish</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="finish" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <RadioGroup 
                value={selectedEffect} 
                onValueChange={onEffectChange}
                className="space-y-3"
              >
                {effectOptions.finish.map((effect) => (
                  <div key={effect.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={effect.id} id={effect.id} className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor={effect.id} className="font-medium">
                        {effect.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{effect.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="flex flex-col">
              <p className="mb-2 text-gray-600 text-sm">Preview</p>
              <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden border shadow-sm">
                <div className={`absolute inset-0 ${
                  effectOptions.finish.find(e => e.id === selectedEffect)?.className || ''
                }`}></div>
                
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
              <RadioGroup 
                value={selectedEffect.startsWith('style-') ? selectedEffect : 'style-standard'} 
                onValueChange={(value) => onEffectChange(`style-${value}`)}
                className="space-y-3"
              >
                {effectOptions.style.map((style) => (
                  <div key={style.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={style.id} id={style.id} className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor={style.id} className="font-medium">
                        {style.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="flex flex-col">
              <p className="mb-2 text-gray-600 text-sm">Style Preview</p>
              <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden border shadow-sm">
                <div className={`absolute inset-0 ${
                  effectOptions.style.find(e => `style-${e.id}` === selectedEffect)?.className || ''
                }`}></div>
                
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
