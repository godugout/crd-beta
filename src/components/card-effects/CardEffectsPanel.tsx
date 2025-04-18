
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CardEffectsPanelProps {
  activeEffects: string[];
  onToggleEffect: (effect: string) => void;
  onClearEffects: () => void;
  onApplyAllEffects: () => void;
  effectIntensities?: Record<string, number>;
  onIntensityChange?: (effect: string, intensity: number) => void;
}

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({
  activeEffects,
  onToggleEffect,
  onClearEffects,
  onApplyAllEffects,
  effectIntensities = {},
  onIntensityChange
}) => {
  // Available card effects
  const availableEffects = [
    {
      id: 'Holographic',
      label: 'Holographic',
      description: 'Rainbow prism effect that shifts as the card moves'
    },
    {
      id: 'Shimmer',
      label: 'Shimmer',
      description: 'Subtle metallic shimmer across the card surface'
    },
    {
      id: 'Refractor',
      label: 'Refractor',
      description: 'Light-refracting pattern that creates a 3D depth effect'
    },
    {
      id: 'Vintage',
      label: 'Vintage',
      description: 'Aged patina with subtle texture and color shifting'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Card Effects</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearEffects}
          >
            Clear All
          </Button>
          <Button 
            size="sm" 
            onClick={onApplyAllEffects}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Apply All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {availableEffects.map((effect) => (
          <div 
            key={effect.id}
            className={cn(
              "p-4 border rounded-lg transition-all",
              activeEffects.includes(effect.id) 
                ? "bg-purple-900/40 border-purple-500/50" 
                : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{effect.label}</h4>
                <p className="text-xs text-gray-400">{effect.description}</p>
              </div>
              <Switch
                checked={activeEffects.includes(effect.id)}
                onCheckedChange={() => onToggleEffect(effect.id)}
              />
            </div>

            {activeEffects.includes(effect.id) && onIntensityChange && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${effect.id}-intensity`} className="w-16 text-xs">
                    Intensity
                  </Label>
                  <Slider
                    id={`${effect.id}-intensity`}
                    min={0}
                    max={100}
                    step={1}
                    value={[effectIntensities[effect.id] || 50]}
                    onValueChange={(values) => onIntensityChange(effect.id, values[0])}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right">
                    {effectIntensities[effect.id] || 50}%
                  </span>
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
