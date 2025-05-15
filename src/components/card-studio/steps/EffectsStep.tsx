
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface EffectsStepProps {
  effects: string[];
  onUpdate: (effects: string[]) => void;
}

// Available effects for cards
const AVAILABLE_EFFECTS = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow holographic effect that changes with viewing angle',
    preview: '🌈',
    premium: false,
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    description: 'Metallic gold foil accents',
    preview: '✨',
    premium: false,
  },
  {
    id: 'silver-foil',
    name: 'Silver Foil',
    description: 'Metallic silver foil accents',
    preview: '⚪',
    premium: false,
  },
  {
    id: 'gloss',
    name: 'Gloss Finish',
    description: 'Shiny high-gloss finish',
    preview: '💎',
    premium: false,
  },
  {
    id: 'matte',
    name: 'Matte Finish',
    description: 'Smooth matte finish with reduced glare',
    preview: '🔲',
    premium: false,
  },
  {
    id: 'prismatic',
    name: 'Prismatic',
    description: 'Advanced rainbow prismatic effect',
    preview: '🌟',
    premium: true,
  },
  {
    id: 'refractor',
    name: 'Refractor',
    description: 'Refractor pattern with light diffusion',
    preview: '📱',
    premium: true,
  },
];

const EffectsStep: React.FC<EffectsStepProps> = ({ effects, onUpdate }) => {
  const [intensity, setIntensity] = useState(50);
  
  // Toggle an effect on or off
  const toggleEffect = (effectId: string) => {
    if (effects.includes(effectId)) {
      onUpdate(effects.filter(id => id !== effectId));
    } else {
      onUpdate([...effects, effectId]);
    }
  };
  
  // Check if an effect is active
  const isEffectActive = (effectId: string) => {
    return effects.includes(effectId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Special Effects</h2>
      
      <p className="text-sm text-gray-600">
        Add special effects to make your card stand out. These effects will be visible when viewing your card.
      </p>
      
      {/* Effects list */}
      <div className="space-y-3">
        {AVAILABLE_EFFECTS.map(effect => (
          <Card 
            key={effect.id}
            className={`transition-all ${isEffectActive(effect.id) ? 'border-primary' : ''}`}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{effect.preview}</div>
                <div>
                  <h3 className="font-medium flex items-center">
                    {effect.name}
                    {effect.premium && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">
                        PREMIUM
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500">{effect.description}</p>
                </div>
              </div>
              
              <Switch 
                checked={isEffectActive(effect.id)} 
                onCheckedChange={() => toggleEffect(effect.id)} 
                disabled={effect.premium && effects.length >= 2}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Intensity control */}
      {effects.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <Label>Effect Intensity</Label>
            <span className="text-sm">{intensity}%</span>
          </div>
          <Slider
            value={[intensity]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => setIntensity(value)}
          />
          <p className="text-xs text-gray-500">
            Adjust the intensity of all selected effects.
          </p>
        </div>
      )}
      
      {/* Selected effects summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Selected Effects</h3>
        {effects.length > 0 ? (
          <ul className="space-y-1">
            {effects.map(effectId => {
              const effect = AVAILABLE_EFFECTS.find(e => e.id === effectId);
              return (
                <li key={effectId} className="text-sm flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  {effect?.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 flex items-center">
            <X className="h-4 w-4 text-gray-400 mr-2" />
            No effects selected
          </p>
        )}
      </div>
    </div>
  );
};

export default EffectsStep;
