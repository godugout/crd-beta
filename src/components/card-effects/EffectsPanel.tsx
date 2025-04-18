
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EffectsPanelProps {
  availableEffects: string[];
  activeEffects: string[];
  onToggleEffect: (effectName: string) => void;
  effectIntensities: Record<string, number>;
  onAdjustIntensity: (effectName: string, intensity: number) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  availableEffects,
  activeEffects,
  onToggleEffect,
  effectIntensities,
  onAdjustIntensity
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Card Effects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {availableEffects.map((effect) => (
            <Button
              key={effect}
              variant={activeEffects.includes(effect) ? "default" : "outline"}
              onClick={() => onToggleEffect(effect)}
              className="justify-start"
            >
              <span className={activeEffects.includes(effect) ? "text-primary-foreground" : ""}>
                {effect}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="pt-4 space-y-6">
          <h3 className="text-sm font-medium mb-2">Effect Intensity</h3>
          
          {activeEffects.map((effect) => (
            <div key={`${effect}-intensity`} className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={`${effect}-intensity`} className="text-sm font-medium">
                  {effect}
                </label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(effectIntensities[effect] * 100)}%
                </span>
              </div>
              <Slider
                id={`${effect}-intensity`}
                min={0}
                max={1}
                step={0.01}
                value={[effectIntensities[effect] || 0.5]}
                onValueChange={(value) => onAdjustIntensity(effect, value[0])}
              />
            </div>
          ))}
          
          {activeEffects.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Select effects to adjust their intensity
            </p>
          )}
        </div>
        
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Auto-Rotate</span>
            <Switch id="auto-rotate" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EffectsPanel;
