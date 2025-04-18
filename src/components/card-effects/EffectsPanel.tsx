
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Layers, Settings } from 'lucide-react';
import LightingControls from '@/components/card-viewer/LightingControls';
import { useCardLighting } from '@/hooks/useCardLighting';

interface EffectsPanelProps {
  availableEffects: string[];
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  onToggleEffect: (effectId: string) => void;
  onAdjustIntensity: (effectId: string, intensity: number) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  availableEffects,
  activeEffects,
  effectIntensities,
  onToggleEffect,
  onAdjustIntensity
}) => {
  // Initialize lighting controls
  const {
    lightingSettings,
    lightingPreset,
    isUserCustomized,
    applyPreset,
    updateLightingSetting,
    toggleDynamicLighting
  } = useCardLighting('studio');

  // Effect categories for organization
  const categories = [
    { 
      id: 'premium', 
      name: 'Premium Effects',
      effects: ['Holographic', 'Refractor', 'Chrome']
    },
    { 
      id: 'special', 
      name: 'Special Effects',
      effects: ['Gold Foil', 'Embossed']
    },
    { 
      id: 'basic', 
      name: 'Basic Effects',
      effects: ['Vintage', 'Matte', 'Scratch Resistant']
    }
  ];

  // Get normalized effect ID
  const getEffectId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Card Effects</h3>
      
      <Tabs defaultValue="effects">
        <TabsList className="mb-4">
          <TabsTrigger value="effects" className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" /> 
            Effects
          </TabsTrigger>
          <TabsTrigger value="lighting" className="flex items-center">
            <Layers className="w-4 h-4 mr-2" /> 
            Lighting
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" /> 
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="effects" className="space-y-6">
          {categories.map(category => (
            <div key={category.id} className="space-y-3">
              <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500">
                {category.name}
              </h4>
              
              <div className="space-y-4">
                {category.effects.filter(effect => availableEffects.includes(effect))
                  .map(effect => {
                    const effectId = getEffectId(effect);
                    const isActive = activeEffects.includes(effectId);
                    const intensity = effectIntensities[effectId] || 1;
                    
                    return (
                      <div key={effectId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch 
                              id={`effect-${effectId}`}
                              checked={isActive}
                              onCheckedChange={() => onToggleEffect(effectId)}
                            />
                            <Label htmlFor={`effect-${effectId}`} className="cursor-pointer">
                              {effect}
                            </Label>
                          </div>
                          
                          {category.id === 'premium' && (
                            <Badge variant="secondary" className="text-xs">Premium</Badge>
                          )}
                        </div>
                        
                        {isActive && (
                          <div className="pl-7">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Intensity</span>
                              <span className="text-gray-500">{(intensity * 100).toFixed(0)}%</span>
                            </div>
                            <Slider
                              defaultValue={[intensity]}
                              max={1}
                              step={0.01}
                              onValueChange={([value]) => onAdjustIntensity(effectId, value)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="lighting">
          <LightingControls
            settings={lightingSettings}
            onUpdateSettings={(settings) => updateLightingSetting(settings)}
            onApplyPreset={applyPreset}
            onToggleDynamicLighting={toggleDynamicLighting}
            isUserCustomized={isUserCustomized}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="space-y-4">
            <h4 className="font-medium">Performance Settings</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-quality">High Quality Lighting</Label>
                <Switch 
                  id="high-quality"
                  checked={lightingSettings.envMapIntensity > 0.5}
                  onCheckedChange={(checked) => updateLightingSetting({
                    envMapIntensity: checked ? 1.0 : 0.3
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="dynamic-shadows">Dynamic Shadows</Label>
                <Switch 
                  id="dynamic-shadows"
                  checked={lightingSettings.useDynamicLighting}
                  onCheckedChange={toggleDynamicLighting}
                />
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Turning off advanced lighting features may improve performance on lower-end devices.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EffectsPanel;
