
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardEffect } from '../hooks/useCardEffectsStack';

interface EffectSettingsProps {
  effect: CardEffect;
  onUpdateSettings: (id: string, settings: any) => void;
}

const EffectSettings: React.FC<EffectSettingsProps> = ({ effect, onUpdateSettings }) => {
  switch (effect.name.toLowerCase()) {
    case 'refractor':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm">Intensity</label>
              <span className="text-xs text-gray-500">{effect.settings.intensity}</span>
            </div>
            <Select
              value={String(effect.settings.intensity || 'medium')}
              onValueChange={(value) => onUpdateSettings(effect.id, { intensity: value })}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subtle">Subtle</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="intense">Intense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm">Angle</label>
              <span className="text-xs text-gray-500">{effect.settings.angle}°</span>
            </div>
            <Slider
              value={[effect.settings.angle || 45]}
              min={0}
              max={360}
              step={5}
              onValueChange={(value) => onUpdateSettings(effect.id, { angle: value[0] })}
            />
          </div>
        </div>
      );
      
    case 'holographic':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm">Pattern</label>
              <span className="text-xs text-gray-500">{effect.settings.pattern}</span>
            </div>
            <Select
              value={String(effect.settings.pattern || 'lines')}
              onValueChange={(value) => onUpdateSettings(effect.id, { pattern: value })}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lines">Lines</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="waves">Waves</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm">Animation Speed</label>
              <span className="text-xs text-gray-500">{effect.settings.speed}</span>
            </div>
            <Slider
              value={[effect.settings.speed || 0.5]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(value) => onUpdateSettings(effect.id, { speed: value[0] })}
            />
          </div>
        </div>
      );
      
    case 'glossy':
    case 'matte':
    case 'foil':
    case 'shadow':
    default:
      return (
        <div className="text-sm text-gray-500 italic">
          Settings for this effect type will be available soon.
        </div>
      );
  }
};

export default EffectSettings;
