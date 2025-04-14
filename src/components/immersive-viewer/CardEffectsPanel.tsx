import React from 'react';
import { X, Lightbulb, Sparkles, Rainbow, RefreshCw, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface CardEffectsPanelProps {
  activeEffects: string[];
  onToggleEffect: (effect: string) => void;
  effectIntensity: {
    refractor: number;
    holographic: number;
    shimmer: number;
    vintage: number;
    gold: number;
  };
  onEffectIntensityChange: (effect: string, value: number) => void;
  onClose: () => void;
}

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({
  activeEffects,
  onToggleEffect,
  effectIntensity,
  onEffectIntensityChange,
  onClose
}) => {
  const availableEffects = [
    { 
      id: 'Holographic',
      name: 'Holographic',
      description: 'Creates a rainbow holographic effect on the card surface',
      icon: <Rainbow size={20} />,
      intensity: effectIntensity.holographic
    },
    { 
      id: 'Refractor',
      name: 'Refractor',
      description: 'Adds a prismatic refractor pattern with light diffraction',
      icon: <Palette size={20} />,
      intensity: effectIntensity.refractor
    },
    { 
      id: 'Shimmer',
      name: 'Shimmer',
      description: 'Light shimmer effect that reacts to movement',
      icon: <Sparkles size={20} />,
      intensity: effectIntensity.shimmer
    },
    { 
      id: 'Gold Foil',
      name: 'Gold Foil',
      description: 'Adds a premium gold foil effect to card elements',
      icon: <Lightbulb size={20} />,
      intensity: effectIntensity.gold
    },
    { 
      id: 'Vintage',
      name: 'Vintage',
      description: 'Classic vintage filter with aged paper and wear effects',
      icon: <RefreshCw size={20} />,
      intensity: effectIntensity.vintage
    }
  ];

  return (
    <div className="p-6 mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Visual Effects</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-400 text-sm">
          Customize visual effects to create unique card presentations.
          Combine multiple effects for impressive results.
        </p>
        
        {availableEffects.map((effect) => (
          <div key={effect.id} className="bg-gray-800/60 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="mr-3 text-blue-400">
                  {effect.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">{effect.name}</h3>
                  <p className="text-gray-400 text-xs">{effect.description}</p>
                </div>
              </div>
              
              <Switch 
                checked={activeEffects.includes(effect.id)} 
                onCheckedChange={() => onToggleEffect(effect.id)}
              />
            </div>
            
            {activeEffects.includes(effect.id) && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-300 text-sm">Intensity</Label>
                  <span className="text-gray-400 text-xs">{Math.round(effect.intensity * 100)}%</span>
                </div>
                <Slider
                  value={[effect.intensity * 100]}
                  max={100}
                  step={1}
                  onValueChange={value => onEffectIntensityChange(effect.id, value[0] / 100)}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-center text-gray-500 text-xs">
            <p className="mb-1">Effects render differently based on card type and lighting conditions.</p>
            <p>More effects can be unlocked in the premium version.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEffectsPanel;
