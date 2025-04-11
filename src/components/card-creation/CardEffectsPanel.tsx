
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CardEffect } from './hooks/useCardEffectsStack';

interface CardEffectsPanelProps {
  effectStack: CardEffect[];
  onAddEffect: (effectName: string) => void;
  onRemoveEffect: (effectId: string) => void;
  onUpdateSettings: (effectId: string, settings: any) => void;
}

const AVAILABLE_EFFECTS = [
  { name: 'Holographic', description: 'Classic rainbow pattern that shifts with light angle' },
  { name: 'Refractor', description: 'Prismatic effect with light diffraction' },
  { name: 'Chrome', description: 'Metallic chrome finish with reflections' },
  { name: 'Gold', description: 'Luxury gold foil effect that catches light' },
  { name: 'Vintage', description: 'Nostalgic worn texture and color fading' },
  { name: 'Spectral', description: 'Advanced hologram with multiple layers' },
  { name: 'Electric', description: 'Dynamic glow with light pulses' },
  { name: 'Prismatic', description: 'Color-shifting rainbow refraction' }
];

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({ 
  effectStack, 
  onAddEffect, 
  onRemoveEffect,
  onUpdateSettings
}) => {
  // Get active effect names for filtering available effects
  const activeEffectNames = effectStack.map(effect => effect.name);
  
  // Filter available effects to show only those not already active
  const availableEffects = AVAILABLE_EFFECTS.filter(
    effect => !activeEffectNames.includes(effect.name)
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Active Effects</h3>
        
        {effectStack.length === 0 ? (
          <div className="text-sm text-gray-500 italic">
            No effects applied. Add an effect below.
          </div>
        ) : (
          <div className="space-y-4">
            {effectStack.map((effect) => (
              <div key={effect.id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{effect.name}</Badge>
                    <Switch 
                      checked={effect.settings.enabled || false}
                      onCheckedChange={(checked) => 
                        onUpdateSettings(effect.id, { ...effect.settings, enabled: checked })
                      }
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveEffect(effect.id)}
                    className="h-8 w-8 p-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
                
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Intensity</Label>
                      <span className="text-xs text-gray-500">
                        {effect.settings.intensity.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[effect.settings.intensity]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => 
                        onUpdateSettings(effect.id, { ...effect.settings, intensity: value[0] })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Speed</Label>
                      <span className="text-xs text-gray-500">
                        {effect.settings.speed.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[effect.settings.speed]}
                      min={0.1}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => 
                        onUpdateSettings(effect.id, { ...effect.settings, speed: value[0] })
                      }
                    />
                  </div>
                  
                  {/* Additional settings specific to effect type */}
                  {effect.name === 'Holographic' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs">Rainbow Strength</Label>
                        <span className="text-xs text-gray-500">
                          {(effect.settings.rainbowStrength || 1).toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[effect.settings.rainbowStrength || 1]}
                        min={0}
                        max={2}
                        step={0.1}
                        onValueChange={(value) => 
                          onUpdateSettings(effect.id, { ...effect.settings, rainbowStrength: value[0] })
                        }
                      />
                    </div>
                  )}
                  
                  {effect.name === 'Refractor' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs">Refraction Angle</Label>
                        <span className="text-xs text-gray-500">
                          {(effect.settings.angle || 45)}°
                        </span>
                      </div>
                      <Slider
                        value={[effect.settings.angle || 45]}
                        min={0}
                        max={90}
                        step={5}
                        onValueChange={(value) => 
                          onUpdateSettings(effect.id, { ...effect.settings, angle: value[0] })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium mb-2">Available Effects</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {availableEffects.map((effect) => (
            <Button
              key={effect.name}
              variant="outline"
              className="h-auto justify-start flex-col items-start p-3"
              onClick={() => onAddEffect(effect.name)}
            >
              <span className="font-medium">{effect.name}</span>
              <span className="text-xs text-gray-500 mt-1 text-left">
                {effect.description}
              </span>
            </Button>
          ))}
          
          {availableEffects.length === 0 && (
            <div className="col-span-2 text-sm text-gray-500 italic">
              All effects have been added.
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium mb-2">Effect Combinations</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-auto text-xs"
            onClick={() => {
              onAddEffect('Holographic');
              onAddEffect('Refractor');
            }}
            disabled={
              activeEffectNames.includes('Holographic') && 
              activeEffectNames.includes('Refractor')
            }
          >
            Holographic Refractor
          </Button>
          <Button
            variant="outline"
            className="h-auto text-xs"
            onClick={() => {
              onAddEffect('Chrome');
              onAddEffect('Gold');
            }}
            disabled={
              activeEffectNames.includes('Chrome') && 
              activeEffectNames.includes('Gold')
            }
          >
            Gold Chrome
          </Button>
          <Button
            variant="outline"
            className="h-auto text-xs"
            onClick={() => {
              onAddEffect('Vintage');
              onAddEffect('Holographic');
            }}
            disabled={
              activeEffectNames.includes('Vintage') && 
              activeEffectNames.includes('Holographic')
            }
          >
            Vintage Holographic
          </Button>
          <Button
            variant="outline"
            className="h-auto text-xs"
            onClick={() => {
              onAddEffect('Spectral');
              onAddEffect('Electric');
            }}
            disabled={
              activeEffectNames.includes('Spectral') && 
              activeEffectNames.includes('Electric')
            }
          >
            Electric Spectral
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardEffectsPanel;
