
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardEffect } from '@/components/card-creation/hooks/useCardEffectsStack';
import { premiumEffects } from '@/hooks/card-effects/utils';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface EffectsPanelProps {
  effectStack: CardEffect[];
  onAddEffect: (name: string) => void;
  onRemoveEffect: (id: string) => void;
  onUpdateEffectSettings: (id: string, settings: any) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  effectStack,
  onAddEffect,
  onRemoveEffect,
  onUpdateEffectSettings,
}) => {
  const effectCategories = {
    holographic: 'Holographic Effects',
    refractor: 'Refractor Effects',
    foil: 'Foil Effects',
    texture: 'Texture Effects',
    special: 'Special Effects',
  };

  // Group effects by category
  const effectsByCategory: Record<string, typeof premiumEffects[keyof typeof premiumEffects][]> = {};
  
  Object.values(premiumEffects).forEach(effect => {
    if (!effectsByCategory[effect.category]) {
      effectsByCategory[effect.category] = [];
    }
    effectsByCategory[effect.category].push(effect);
  });

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium text-lg">Card Effects</h3>
      
      {/* Active Effects */}
      <div>
        <h4 className="text-sm font-medium mb-2">Active Effects</h4>
        {effectStack.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4 text-center bg-gray-50 rounded-md">
            No effects applied
          </div>
        ) : (
          <div className="space-y-2">
            {effectStack.map(effect => (
              <div key={effect.id} className="border rounded-md p-3 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{effect.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveEffect(effect.id)}
                    className="h-8 w-8 p-0 text-muted-foreground"
                  >
                    &times;
                  </Button>
                </div>
                
                {/* Effect settings */}
                <div className="mt-2">
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor={`intensity-${effect.id}`} className="text-xs">
                          Intensity
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(effect.settings.intensity * 100)}%
                        </span>
                      </div>
                      <Slider
                        id={`intensity-${effect.id}`}
                        value={[effect.settings.intensity * 100]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          onUpdateEffectSettings(effect.id, {
                            ...effect.settings,
                            intensity: value[0] / 100
                          });
                        }}
                      />
                    </div>
                    
                    {effect.settings.animationEnabled !== undefined && (
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`animation-${effect.id}`} className="text-xs">
                          Animation
                        </Label>
                        <Switch
                          id={`animation-${effect.id}`}
                          checked={effect.settings.animationEnabled}
                          onCheckedChange={(checked) => {
                            onUpdateEffectSettings(effect.id, {
                              ...effect.settings,
                              animationEnabled: checked
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Available Effects */}
      <div>
        <h4 className="text-sm font-medium mb-2">Available Effects</h4>
        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(effectsByCategory).map(([category, effects]) => (
            <div key={category} className="mb-4">
              <h5 className="text-xs uppercase text-muted-foreground mb-2">
                {effectCategories[category as keyof typeof effectCategories] || category}
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {effects.map(effect => {
                  const isActive = effectStack.some(e => e.name === effect.name);
                  return (
                    <Button
                      key={effect.id}
                      variant={isActive ? "secondary" : "outline"}
                      size="sm"
                      className="justify-start"
                      disabled={isActive}
                      onClick={() => onAddEffect(effect.name)}
                    >
                      {effect.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default EffectsPanel;
