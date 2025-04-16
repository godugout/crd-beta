
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CardEffect } from '@/hooks/useCardEffects';
import { Sparkles, Palette, Rainbow, Layers, Disc, Wand2, Clock } from 'lucide-react';

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
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>(null);

  // Get icon for effect
  const getEffectIcon = (effectId: string) => {
    switch (effectId) {
      case 'holographic':
        return <Rainbow size={18} />;
      case 'refractor':
        return <Palette size={18} />;
      case 'prismatic':
        return <Sparkles size={18} />;
      case 'chrome':
        return <Layers size={18} />;
      case 'goldFoil':
        return <Wand2 size={18} />;
      case 'mojo':
        return <Disc size={18} />;
      case 'vintage':
        return <Clock size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  // Toggle expanded state for effect
  const toggleExpand = (effectId: string) => {
    setExpandedEffectId(prev => prev === effectId ? null : effectId);
  };

  return (
    <div className="p-4 text-white h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Card Effects</h3>
        <p className="text-sm text-gray-400">Apply visual effects to enhance your card</p>
      </div>

      <div className="space-y-3">
        {effects.map(effect => (
          <div 
            key={effect.id} 
            className="bg-black/30 rounded-lg p-3"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(effect.id)}
            >
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  {getEffectIcon(effect.id)}
                </div>
                <div>
                  <h4 className="font-medium">{effect.name}</h4>
                </div>
              </div>
              <Switch 
                checked={effect.active} 
                onCheckedChange={() => onToggleEffect(effect.id)}
                onClick={e => e.stopPropagation()}
              />
            </div>
            
            {(expandedEffectId === effect.id && effect.active) && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`intensity-${effect.id}`} className="text-sm">
                        Intensity
                      </Label>
                      <span className="text-xs">{Math.round(effect.intensity * 100)}%</span>
                    </div>
                    <Slider 
                      id={`intensity-${effect.id}`}
                      min={0}
                      max={1}
                      step={0.05}
                      value={[effect.intensity]}
                      onValueChange={([value]) => onUpdateIntensity(effect.id, value)}
                    />
                  </div>
                  
                  {effect.hue !== undefined && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`hue-${effect.id}`} className="text-sm">
                          Color Hue
                        </Label>
                        <span className="text-xs">{effect.hue}°</span>
                      </div>
                      <Slider 
                        id={`hue-${effect.id}`}
                        min={0}
                        max={360}
                        step={5}
                        value={[effect.hue]}
                        onValueChange={([value]) => onUpdateIntensity(effect.id, value)}
                        className="hue-slider"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffectsPanel;
