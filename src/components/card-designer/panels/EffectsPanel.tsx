
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardEffect } from '@/components/card-creation/types/cardTypes';
import { Info, X } from 'lucide-react';

interface EffectsPanelProps {
  effectStack: CardEffect[];
  onAddEffect: (name: string) => void;
  onRemoveEffect: (id: string) => void;
  onUpdateEffectSettings: (id: string, settings: any) => void;
}

// Available effects for the user to choose from
const AVAILABLE_EFFECTS = [
  { name: 'Holographic', description: 'Rainbow holographic effect', premium: false },
  { name: 'Chrome', description: 'Shiny chrome finish', premium: false },
  { name: 'Refractor', description: 'Light-refracting pattern', premium: false },
  { name: 'Prizm', description: 'Colorful prismatic effect', premium: true },
  { name: 'Gold', description: 'Gold foil finish', premium: true },
  { name: 'Cracked Ice', description: 'Fractured ice pattern', premium: true }
];

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  effectStack,
  onAddEffect,
  onRemoveEffect,
  onUpdateEffectSettings
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  
  const handleAddEffect = () => {
    if (!selectedEffect) return;
    onAddEffect(selectedEffect);
    setSelectedEffect(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Card Effects</h3>
        <p className="text-xs text-gray-500">Enhance your card with special effects</p>
      </div>
      
      <div className="space-y-3">
        {effectStack.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-26rem)]">
            <div className="space-y-3 pr-2">
              {effectStack.map(effect => (
                <div 
                  key={effect.id} 
                  className="bg-white border rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                      <h4 className="font-medium">{effect.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500"
                      onClick={() => onRemoveEffect(effect.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs">Intensity</span>
                        <span className="text-xs">{effect.settings.intensity || 1.0}</span>
                      </div>
                      <Slider
                        value={[effect.settings.intensity || 1.0]}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        onValueChange={([value]) => onUpdateEffectSettings(effect.id, { intensity: value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs">Speed</span>
                        <span className="text-xs">{effect.settings.speed || 1.0}</span>
                      </div>
                      <Slider
                        value={[effect.settings.speed || 1.0]}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        onValueChange={([value]) => onUpdateEffectSettings(effect.id, { speed: value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No effects applied</p>
            <p className="text-xs text-gray-400">Select an effect below to add it</p>
          </div>
        )}
      </div>
      
      <div className="space-y-3 pt-2 border-t">
        <h4 className="text-sm font-medium">Available Effects</h4>
        
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_EFFECTS.map(effect => (
            <div
              key={effect.name}
              onClick={() => setSelectedEffect(selectedEffect === effect.name ? null : effect.name)}
              className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                selectedEffect === effect.name ? 'border-primary bg-primary/10' : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm">{effect.name}</span>
                {effect.premium && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1 rounded">PRO</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button
          className="w-full"
          disabled={!selectedEffect}
          onClick={handleAddEffect}
        >
          Add Effect
        </Button>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg flex gap-2 text-sm text-blue-700 items-start mt-4">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>Effects can be layered and combined to create unique visuals for your card.</p>
      </div>
    </div>
  );
};

export default EffectsPanel;
