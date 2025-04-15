import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CardEffect } from '@/components/card-creation/types/cardTypes';

interface CardEffectsStepProps {
  effectStack: CardEffect[];
  addEffect: (name: string, settings?: any) => void;
  removeEffect: (id: string) => void;
  updateEffectSettings: (id: string, settings: any) => void;
  onContinue: () => void;
}

const AVAILABLE_EFFECTS = [
  { name: 'Holographic', description: 'Rainbow holographic pattern effect' },
  { name: 'Refractor', description: 'Prismatic light refraction effect' },
  { name: 'Gold Foil', description: 'Metallic gold foil accents' },
  { name: 'Chrome', description: 'Reflective chrome finish' },
  { name: 'Vintage', description: 'Worn vintage card appearance' },
  { name: 'Electric', description: 'Dynamic electric energy effects' },
  { name: 'Spectral', description: 'Ghostly transparency effect' }
];

const CardEffectsStep: React.FC<CardEffectsStepProps> = ({
  effectStack,
  addEffect,
  removeEffect,
  updateEffectSettings,
  onContinue
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  
  const handleAddEffect = (effectName: string) => {
    addEffect(effectName);
    setSelectedEffect(effectName);
  };
  
  const isEffectApplied = (name: string) => {
    return effectStack.some(effect => effect.name === name);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Add Special Effects</h2>
      <p className="text-gray-500">
        Enhance your card with special visual effects to make it unique
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_EFFECTS.map((effect) => {
          const isApplied = isEffectApplied(effect.name);
          
          return (
            <Card 
              key={effect.name} 
              className={`cursor-pointer transition-all ${
                isApplied 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/30'
              }`}
              onClick={() => setSelectedEffect(effect.name)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{effect.name}</h3>
                  <p className="text-sm text-gray-500">{effect.description}</p>
                </div>
                
                <Button 
                  size="sm" 
                  variant={isApplied ? 'destructive' : 'outline'} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isApplied) {
                      const effectToRemove = effectStack.find(e => e.name === effect.name);
                      if (effectToRemove) {
                        removeEffect(effectToRemove.id);
                      }
                    } else {
                      handleAddEffect(effect.name);
                    }
                  }}
                >
                  {isApplied ? 'Remove' : (
                    <>
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {effectStack.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Applied Effects</h3>
          <div className="space-y-3">
            {effectStack.map((effect) => (
              <div 
                key={effect.id} 
                className="bg-gray-50 p-3 rounded-md border flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium">{effect.name}</h4>
                  {selectedEffect === effect.name && (
                    <div className="mt-3 p-2 bg-white rounded border">
                      <p className="text-sm">Effect settings will be configurable here</p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => removeEffect(effect.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button onClick={onContinue} className="flex items-center gap-2">
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardEffectsStep;
