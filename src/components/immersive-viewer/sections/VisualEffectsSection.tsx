
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles,
  Zap,
  Chrome,
  Gem,
  Rainbow,
  Clock,
  Flashlight,
  Stars
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
    { id: 'holographic', name: 'Holographic', icon: Rainbow },
    { id: 'refractor', name: 'Refractor', icon: Gem },
    { id: 'foil', name: 'Foil', icon: Sparkles },
    { id: 'chrome', name: 'Chrome', icon: Chrome },
    { id: 'prismatic', name: 'Prismatic', icon: Zap },
    { id: 'vintage', name: 'Vintage', icon: Clock },
    { id: 'neon', name: 'Neon', icon: Flashlight },
    { id: 'galaxy', name: 'Galaxy', icon: Stars },
  ];

  const handleEffectToggle = (effectId: string) => {
    onEffectChange(effectId);
    toast.success(`Applied ${effectId} effect`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Visual Effects</h3>
      <div className="grid grid-cols-2 gap-3">
        {visualEffects.map((effect) => {
          const IconComponent = effect.icon;
          const isActive = activeEffect === effect.id;
          
          return (
            <Button
              key={effect.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => handleEffectToggle(effect.id)}
              className={`h-16 flex-col gap-2 ${
                isActive 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600'
              }`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-xs">{effect.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Effect Intensity */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-white capitalize">{activeEffect}</Label>
          <span className="text-sm text-gray-400">{effectIntensity}%</span>
        </div>
        <Slider
          value={[effectIntensity]}
          min={0}
          max={100}
          step={1}
          onValueChange={([value]) => onIntensityChange(value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VisualEffectsSection;
