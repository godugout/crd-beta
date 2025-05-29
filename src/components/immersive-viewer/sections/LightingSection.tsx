
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Lightbulb, 
  Sun, 
  Moon,
  Camera,
  Building,
  Sparkles
} from 'lucide-react';
import { LightingSettings, LightingPreset } from '@/hooks/useCardLighting';
import { toast } from 'sonner';

interface LightingSectionProps {
  lightingSettings: LightingSettings;
  lightingMode: 'easy' | 'pro';
  brightness: number;
  onUpdateLighting: (settings: Partial<LightingSettings>) => void;
  onApplyPreset?: (preset: LightingPreset) => void;
  onLightingModeChange: (mode: 'easy' | 'pro') => void;
  onBrightnessChange: (brightness: number) => void;
}

const LightingSection: React.FC<LightingSectionProps> = ({
  lightingSettings,
  lightingMode,
  brightness,
  onUpdateLighting,
  onApplyPreset,
  onLightingModeChange,
  onBrightnessChange
}) => {
  // Easy mode presets
  const easyPresets = [
    { id: 'studio', name: 'Studio', icon: Camera, description: 'Professional studio lighting' },
    { id: 'natural', name: 'Natural', icon: Sun, description: 'Soft daylight appearance' },
    { id: 'dramatic', name: 'Dramatic', icon: Moon, description: 'High contrast lighting' },
    { id: 'gallery', name: 'Gallery', icon: Building, description: 'Museum display lighting' },
  ];

  const handleLightingPreset = (presetId: string) => {
    if (onApplyPreset) {
      onApplyPreset(presetId as LightingPreset);
      toast.success(`Applied ${presetId} lighting`);
    }
  };

  const handleBrightnessChange = (value: number) => {
    onBrightnessChange(value);
    // Directly update lighting intensity
    onUpdateLighting({
      primaryLight: {
        ...lightingSettings.primaryLight,
        intensity: value / 100 * 2.5 // Scale to reasonable range
      },
      ambientLight: {
        ...lightingSettings.ambientLight,
        intensity: (value / 100) * 0.8 // Scale ambient proportionally
      }
    });
  };

  const handleDynamicLightingToggle = () => {
    const newValue = !lightingSettings.useDynamicLighting;
    onUpdateLighting({
      useDynamicLighting: newValue
    });
    toast.success(`Dynamic lighting ${newValue ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Lighting</h3>
        <div className="flex bg-gray-800 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLightingModeChange('easy')}
            className={`text-xs px-3 py-1 ${
              lightingMode === 'easy' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Easy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLightingModeChange('pro')}
            className={`text-xs px-3 py-1 ${
              lightingMode === 'pro' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Pro
          </Button>
        </div>
      </div>

      {/* Easy Mode */}
      {lightingMode === 'easy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {easyPresets.map((preset) => {
              const IconComponent = preset.icon;
              const isActive = lightingSettings.environmentType === preset.id;
              
              return (
                <Button
                  key={preset.id}
                  variant="outline"
                  onClick={() => handleLightingPreset(preset.id)}
                  className={`h-20 flex-col gap-2 p-3 transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-lg shadow-blue-600/25' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs font-medium">{preset.name}</span>
                  <span className="text-xs opacity-75 text-center leading-tight">
                    {preset.description}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Simple brightness control */}
          <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <Label className="text-white">Brightness</Label>
              <span className="text-sm text-blue-400 font-medium">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              min={50}
              max={200}
              step={5}
              onValueChange={([value]) => handleBrightnessChange(value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Dim</span>
              <span>Bright</span>
            </div>
          </div>

          {/* Dynamic lighting toggle */}
          <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-4">
            <div>
              <Label className="text-white">Dynamic Lighting</Label>
              <p className="text-xs text-gray-400 mt-1">Light follows your mouse</p>
            </div>
            <Button
              variant={lightingSettings.useDynamicLighting ? "default" : "outline"}
              size="sm"
              onClick={handleDynamicLightingToggle}
              className={lightingSettings.useDynamicLighting ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 hover:bg-gray-700'}
            >
              {lightingSettings.useDynamicLighting ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      )}

      {/* Pro Mode */}
      {lightingMode === 'pro' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {easyPresets.map((preset) => {
              const IconComponent = preset.icon;
              const isActive = lightingSettings.environmentType === preset.id;
              
              return (
                <Button
                  key={preset.id}
                  variant="outline"
                  onClick={() => handleLightingPreset(preset.id)}
                  className={`h-16 flex-col gap-1 text-xs transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{preset.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Advanced controls with simplified sliders */}
          <div className="space-y-4">
            {/* Primary Light Intensity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white text-sm">Primary Light</Label>
                <span className="text-xs text-gray-400">{lightingSettings.primaryLight.intensity.toFixed(1)}</span>
              </div>
              <Slider
                value={[lightingSettings.primaryLight.intensity]}
                min={0.1}
                max={3}
                step={0.1}
                onValueChange={([value]) => 
                  onUpdateLighting({
                    primaryLight: { ...lightingSettings.primaryLight, intensity: value }
                  })
                }
                className="w-full"
              />
            </div>

            {/* Ambient Light */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white text-sm">Ambient Light</Label>
                <span className="text-xs text-gray-400">{Math.round(lightingSettings.ambientLight.intensity * 100)}%</span>
              </div>
              <Slider
                value={[lightingSettings.ambientLight.intensity * 100]}
                min={0}
                max={100}
                step={5}
                onValueChange={([value]) => 
                  onUpdateLighting({
                    ambientLight: { ...lightingSettings.ambientLight, intensity: value / 100 }
                  })
                }
                className="w-full"
              />
            </div>

            {/* Environment Reflections */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white text-sm">Reflections</Label>
                <span className="text-xs text-gray-400">{(lightingSettings.envMapIntensity || 1).toFixed(1)}</span>
              </div>
              <Slider
                value={[lightingSettings.envMapIntensity || 1]}
                min={0}
                max={3}
                step={0.1}
                onValueChange={([value]) => 
                  onUpdateLighting({ envMapIntensity: value })
                }
                className="w-full"
              />
            </div>

            {/* Dynamic lighting toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div>
                <Label className="text-white text-sm">Dynamic Lighting</Label>
                <p className="text-xs text-gray-400">Mouse interaction</p>
              </div>
              <Button
                variant={lightingSettings.useDynamicLighting ? "default" : "outline"}
                size="sm"
                onClick={handleDynamicLightingToggle}
                className={lightingSettings.useDynamicLighting ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 hover:bg-gray-700'}
              >
                {lightingSettings.useDynamicLighting ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightingSection;
