
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles,
  Zap,
  Chrome,
  Gem,
  Star,
  Clock,
  Flashlight,
  Circle
} from 'lucide-react';
import { toast } from 'sonner';

interface VisualEffectsSectionProps {
  activeEffect: string;
  effectIntensity: number;
  onEffectChange: (effectId: string) => void;
  onIntensityChange: (intensity: number) => void;
}

const VisualEffectsSection: React.FC<VisualEffectsSectionProps> = ({
  activeEffect,
  effectIntensity,
  onEffectChange,
  onIntensityChange
}) => {
  const visualEffects = [
    { 
      id: 'holographic', 
      name: 'Holographic', 
      icon: Star,
      description: 'Rainbow iridescent finish'
    },
    { 
      id: 'galaxy', 
      name: 'Galaxy', 
      icon: Circle,
      description: 'Deep space with stars'
    },
    { 
      id: 'refractor', 
      name: 'Refractor', 
      icon: Gem,
      description: 'Prismatic light effects'
    },
    { 
      id: 'foil', 
      name: 'Foil', 
      icon: Sparkles,
      description: 'Metallic shine finish'
    },
    { 
      id: 'chrome', 
      name: 'Chrome', 
      icon: Chrome,
      description: 'Mirror-like reflection'
    },
    { 
      id: 'prismatic', 
      name: 'Prismatic', 
      icon: Zap,
      description: 'Rainbow spectrum dispersal'
    },
    { 
      id: 'vintage', 
      name: 'Vintage', 
      icon: Clock,
      description: 'Aged, weathered look'
    },
    { 
      id: 'neon', 
      name: 'Neon', 
      icon: Flashlight,
      description: 'Glowing edge highlights'
    },
  ];

  const handleEffectToggle = (effectId: string) => {
    onEffectChange(effectId);
    const effect = visualEffects.find(e => e.id === effectId);
    toast.success(`Applied ${effect?.name} effect`);
  };

  const getCurrentEffect = () => {
    return visualEffects.find(e => e.id === activeEffect);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Visual Effects</h3>
        <p className="text-sm text-gray-400 mb-4">Choose a premium effect for your card</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {visualEffects.map((effect) => {
          const IconComponent = effect.icon;
          const isActive = activeEffect === effect.id;
          
          return (
            <Button
              key={effect.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => handleEffectToggle(effect.id)}
              className={`h-20 flex-col gap-2 p-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-lg shadow-blue-600/25' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600 hover:border-gray-500'
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{effect.name}</span>
              <span className="text-xs opacity-75 text-center leading-tight">
                {effect.description}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Effect Intensity */}
      <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-white capitalize font-medium">
              {getCurrentEffect()?.name || activeEffect} Intensity
            </Label>
            <p className="text-xs text-gray-400 mt-1">
              {getCurrentEffect()?.description || 'Adjust the effect strength'}
            </p>
          </div>
          <span className="text-sm text-blue-400 font-medium">{effectIntensity}%</span>
        </div>
        <Slider
          value={[effectIntensity]}
          min={0}
          max={100}
          step={5}
          onValueChange={([value]) => onIntensityChange(value)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtle</span>
          <span>Intense</span>
        </div>
      </div>
    </div>
  );
};

export default VisualEffectsSection;
