
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CardEffectsPanelProps {
  activeEffects: string[];
  onToggleEffect: (effectId: string) => void;
  effectIntensity: Record<string, number>;
  onEffectIntensityChange: (effect: string, value: number) => void;
  onClose?: () => void;
}

const AVAILABLE_EFFECTS = [
  {
    id: 'Holographic',
    name: 'Holographic',
    description: 'Rainbow reflective pattern',
    default: 0.5
  },
  {
    id: 'Refractor',
    name: 'Refractor',
    description: 'Light bending prismatic effect',
    default: 0.5
  },
  {
    id: 'Chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish',
    default: 0.6
  },
  {
    id: 'Shimmer',
    name: 'Shimmer',
    description: 'Subtle shimmering effect',
    default: 0.4
  },
  {
    id: 'Vintage',
    name: 'Vintage',
    description: 'Aged vintage look',
    default: 0.7
  },
  {
    id: 'Gold Foil',
    name: 'Gold Foil',
    description: 'Gold foil accents',
    default: 0.5
  }
];

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({
  activeEffects,
  onToggleEffect,
  effectIntensity,
  onEffectIntensityChange,
  onClose
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Card Effects</h3>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {AVAILABLE_EFFECTS.map((effect) => (
          <div key={effect.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={activeEffects.includes(effect.id)} 
                  onCheckedChange={() => onToggleEffect(effect.id)} 
                  id={`toggle-${effect.id}`}
                />
                <Label htmlFor={`toggle-${effect.id}`} className="cursor-pointer">
                  {effect.name}
                </Label>
              </div>
              <span className="text-xs text-gray-400">{effect.description}</span>
            </div>
            
            {activeEffects.includes(effect.id) && (
              <div className="pl-10">
                <Slider 
                  value={[effectIntensity[effect.id] || effect.default]} 
                  min={0} 
                  max={1} 
                  step={0.01} 
                  onValueChange={(values) => onEffectIntensityChange(effect.id, values[0])} 
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Subtle</span>
                  <span>Intense</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardEffectsPanel;
