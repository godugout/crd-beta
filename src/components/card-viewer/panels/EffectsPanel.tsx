
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CardEffect } from '@/hooks/useCardEffects';
import { Label } from '@/components/ui/label';
import { Sparkles, Waves, Circle, Star } from 'lucide-react';

interface EffectsPanelProps {
  effects: CardEffect[];
  onToggleEffect: (effectId: string) => void;
  onUpdateIntensity: (effectId: string, intensity: number) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  effects,
  onToggleEffect,
  onUpdateIntensity
}) => {
  // Helper function to get appropriate icon for each effect
  const getEffectIcon = (effectType: string) => {
    switch (effectType.toLowerCase()) {
      case 'holographic':
        return <Sparkles className="h-4 w-4" />;
      case 'refractor':
        return <Waves className="h-4 w-4" />;
      case 'chrome':
        return <Circle className="h-4 w-4" />;
      case 'goldfoil':
        return <Star className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Card Effects</h3>
      
      <div className="space-y-6">
        {effects.map((effect) => (
          <div key={effect.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getEffectIcon(effect.id)}
                <Label htmlFor={`effect-${effect.id}`} className="font-medium">
                  {effect.name}
                </Label>
              </div>
              <Switch
                id={`effect-${effect.id}`}
                checked={effect.enabled}
                onCheckedChange={() => onToggleEffect(effect.id)}
              />
            </div>
            
            {effect.enabled && (
              <div className="pt-1 pl-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Intensity</span>
                  <span className="text-xs text-gray-500">
                    {Math.round((effect.settings.intensity || 0) * 100)}%
                  </span>
                </div>
                <Slider
                  value={[effect.settings.intensity || 0]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => onUpdateIntensity(effect.id, value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {effects.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No effects available for this card
        </div>
      )}
    </div>
  );
};

export default EffectsPanel;
