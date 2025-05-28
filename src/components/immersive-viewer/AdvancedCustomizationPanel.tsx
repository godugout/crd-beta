
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Save, Sun, Moon, Building, Sparkles } from 'lucide-react';

interface AdvancedCustomizationPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onSaveRemix: (settings: any) => void;
  activeEffects: string[];
  onEffectsChange: (effects: string[]) => void;
  effectIntensities: Record<string, number>;
  onEffectIntensityChange: (effect: string, intensity: number) => void;
  materialSettings: any;
  onMaterialChange: (changes: any) => void;
  lightingSettings: any;
  onLightingChange: (changes: any) => void;
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
}

const AdvancedCustomizationPanel: React.FC<AdvancedCustomizationPanelProps> = ({
  card,
  isOpen,
  onClose,
  onSaveRemix,
  activeEffects,
  onEffectsChange,
  effectIntensities,
  onEffectIntensityChange,
  materialSettings,
  onMaterialChange,
  lightingSettings,
  onLightingChange,
  environmentType,
  onEnvironmentChange
}) => {
  const [lightingMode, setLightingMode] = useState<'easy' | 'advanced'>('easy');

  // Environment presets for easy mode
  const environmentPresets = [
    { 
      value: 'studio', 
      label: 'Studio', 
      description: 'Clean, professional lighting',
      icon: Building,
      color: 'bg-blue-100 text-blue-700'
    },
    { 
      value: 'natural', 
      label: 'Natural', 
      description: 'Soft, daylight appearance',
      icon: Sun,
      color: 'bg-yellow-100 text-yellow-700'
    },
    { 
      value: 'dramatic', 
      label: 'Dramatic', 
      description: 'High contrast, moody lighting',
      icon: Moon,
      color: 'bg-purple-100 text-purple-700'
    },
    { 
      value: 'gallery', 
      label: 'Gallery', 
      description: 'Museum-style presentation',
      icon: Sparkles,
      color: 'bg-emerald-100 text-emerald-700'
    }
  ];

  const availableEffects = [
    'holographic', 'refractor', 'foil', 'chrome', 'prismatic', 'vintage', 'neon', 'galaxy'
  ];

  const handleEffectToggle = (effect: string) => {
    const newEffects = activeEffects.includes(effect)
      ? activeEffects.filter(e => e !== effect)
      : [...activeEffects, effect];
    onEffectsChange(newEffects);
  };

  const handleSave = () => {
    onSaveRemix({
      effects: activeEffects,
      effectSettings: effectIntensities,
      materialSettings,
      lightingSettings,
      environmentType
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 z-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Customize Card</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Card Effects */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Visual Effects</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableEffects.map((effect) => (
              <Button
                key={effect}
                variant={activeEffects.includes(effect) ? "default" : "outline"}
                size="sm"
                onClick={() => handleEffectToggle(effect)}
                className="justify-start capitalize"
              >
                {effect}
              </Button>
            ))}
          </div>
          
          {/* Effect Intensities */}
          {activeEffects.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-white">Effect Intensity</h4>
              {activeEffects.map((effect) => (
                <div key={effect} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-white capitalize">{effect}</Label>
                    <span className="text-sm text-gray-400">
                      {Math.round((effectIntensities[effect] || 0.5) * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[effectIntensities[effect] || 0.5]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={([value]) => onEffectIntensityChange(effect, value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lighting Controls */}
        <div className="space-y-4">
          <Tabs value={lightingMode} onValueChange={(value) => setLightingMode(value as 'easy' | 'advanced')}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Lighting</h3>
              <TabsList className="grid w-32 grid-cols-2">
                <TabsTrigger value="easy" className="text-xs">Easy</TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">Pro</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="easy" className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Choose a lighting style</p>
                
                <div className="grid grid-cols-1 gap-2">
                  {environmentPresets.map((preset) => {
                    const Icon = preset.icon;
                    const isActive = environmentType === preset.value;
                    
                    return (
                      <Button
                        key={preset.value}
                        variant={isActive ? "default" : "outline"}
                        className={`h-auto p-3 justify-start ${isActive ? '' : 'hover:bg-gray-800'}`}
                        onClick={() => onEnvironmentChange(preset.value)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`p-1.5 rounded ${preset.color}`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{preset.label}</span>
                              {isActive && <Badge variant="secondary" className="text-xs">Active</Badge>}
                            </div>
                            <p className="text-xs text-gray-500">{preset.description}</p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                {/* Quick brightness control */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <Label className="text-white">Brightness</Label>
                    <span className="text-sm text-gray-400">
                      {Math.round((lightingSettings.intensity || 1) * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[lightingSettings.intensity || 1]}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onValueChange={([value]) => onLightingChange({ intensity: value })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              {/* Advanced lighting controls */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-white">Light Intensity</Label>
                    <span className="text-sm text-gray-400">
                      {(lightingSettings.intensity || 1).toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[lightingSettings.intensity || 1]}
                    min={0}
                    max={3}
                    step={0.1}
                    onValueChange={([value]) => onLightingChange({ intensity: value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-white">Ambient Light</Label>
                    <span className="text-sm text-gray-400">
                      {(lightingSettings.ambientIntensity || 0.6).toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[lightingSettings.ambientIntensity || 0.6]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={([value]) => onLightingChange({ ambientIntensity: value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Environment</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {environmentPresets.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={environmentType === preset.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => onEnvironmentChange(preset.value)}
                        className="text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Material Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Material Properties</h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white">Metalness</Label>
                <span className="text-sm text-gray-400">
                  {(materialSettings.metalness || 0.8).toFixed(1)}
                </span>
              </div>
              <Slider
                value={[materialSettings.metalness || 0.8]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => onMaterialChange({ metalness: value })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white">Roughness</Label>
                <span className="text-sm text-gray-400">
                  {(materialSettings.roughness || 0.2).toFixed(1)}
                </span>
              </div>
              <Slider
                value={[materialSettings.roughness || 0.2]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => onMaterialChange({ roughness: value })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-700">
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Remix
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCustomizationPanel;
