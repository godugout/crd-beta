
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Sun, 
  Palette,
  Building,
  Sparkles,
  Zap,
  Chrome,
  Gem,
  Rainbow,
  Clock,
  Flashlight,
  Stars
} from 'lucide-react';
import { Card } from '@/lib/types';
import { LightingSettings, LightingPreset } from '@/hooks/useCardLighting';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  envMapIntensity: number;
}

interface CustomizationPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  lightingSettings: LightingSettings;
  onUpdateLighting: (settings: Partial<LightingSettings>) => void;
  onApplyPreset?: (preset: LightingPreset) => void;
  onToggleDynamicLighting?: () => void;
  materialSettings?: MaterialSettings;
  onUpdateMaterial?: (settings: Partial<MaterialSettings>) => void;
  onShareCard?: () => void;
  onDownloadCard?: () => void;
  isUserCustomized?: boolean;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  card,
  isOpen,
  onClose,
  lightingSettings,
  onUpdateLighting,
  onApplyPreset,
  onToggleDynamicLighting,
  materialSettings = { 
    roughness: 0.2, 
    metalness: 0.8,
    reflectivity: 0.2,
    clearcoat: 0.1,
    envMapIntensity: 1.0
  },
  onUpdateMaterial = () => {},
  onShareCard,
  onDownloadCard,
  isUserCustomized
}) => {
  const [activeEffect, setActiveEffect] = useState('holographic');
  const [effectIntensity, setEffectIntensity] = useState(70);
  const [lightingMode, setLightingMode] = useState<'easy' | 'pro'>('easy');
  const [brightness, setBrightness] = useState(120);
  
  // Visual Effects with corrected icon imports
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

  // Lighting Presets
  const lightingPresets = [
    { id: 'studio', name: 'Studio', icon: Lightbulb },
    { id: 'natural', name: 'Natural', icon: Sun },
    { id: 'dramatic', name: 'Dramatic', icon: Palette },
    { id: 'display_case', name: 'Gallery', icon: Building },
  ];

  const handleEffectToggle = (effectId: string) => {
    setActiveEffect(effectId);
    toast.success(`Applied ${effectId} effect`);
  };

  const handleLightingPreset = (presetId: string) => {
    if (onApplyPreset) {
      onApplyPreset(presetId as LightingPreset);
    }
    onUpdateLighting({ environmentType: presetId as LightingPreset });
    toast.success(`Applied ${presetId} lighting`);
  };

  const handleSaveRemix = () => {
    toast.success("Remix saved to your collection!");
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Visual Effects Section */}
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
            onValueChange={([value]) => setEffectIntensity(value)}
            className="w-full"
          />
        </div>

        {/* Lighting Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Lighting</h3>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <Button
                variant={lightingMode === 'easy' ? "default" : "ghost"}
                size="sm"
                onClick={() => setLightingMode('easy')}
                className={`text-xs px-3 py-1 ${
                  lightingMode === 'easy' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Easy
              </Button>
              <Button
                variant={lightingMode === 'pro' ? "default" : "ghost"}
                size="sm"
                onClick={() => setLightingMode('pro')}
                className={`text-xs px-3 py-1 ${
                  lightingMode === 'pro' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pro
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {lightingPresets.map((preset) => {
              const IconComponent = preset.icon;
              const isActive = lightingSettings.environmentType === preset.id;
              
              return (
                <Button
                  key={preset.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => handleLightingPreset(preset.id)}
                  className={`h-16 flex-col gap-2 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs">{preset.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Brightness */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-white">Brightness</Label>
            <span className="text-sm text-gray-400">{brightness}%</span>
          </div>
          <Slider
            value={[brightness]}
            min={50}
            max={200}
            step={5}
            onValueChange={([value]) => {
              setBrightness(value);
              onUpdateLighting({
                primaryLight: {
                  ...lightingSettings.primaryLight,
                  intensity: value / 100
                }
              });
            }}
            className="w-full"
          />
        </div>

        {/* Material Properties */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Material Properties</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white">Metalness</Label>
                <span className="text-sm text-gray-400">{materialSettings.metalness.toFixed(1)}</span>
              </div>
              <Slider
                value={[materialSettings.metalness]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => onUpdateMaterial({ metalness: value })}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white">Roughness</Label>
                <span className="text-sm text-gray-400">{materialSettings.roughness.toFixed(1)}</span>
              </div>
              <Slider
                value={[materialSettings.roughness]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => onUpdateMaterial({ roughness: value })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Save Remix Button */}
        <div className="pt-4">
          <Button 
            onClick={handleSaveRemix}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
            size="lg"
          >
            Save Remix
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
