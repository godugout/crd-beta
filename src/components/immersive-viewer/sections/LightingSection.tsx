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
  // Enhanced presets with more dramatic differences
  const easyPresets = [
    { 
      id: 'studio', 
      name: 'Studio', 
      icon: Camera, 
      description: 'Multi-light professional setup',
      preview: 'Clean, balanced lighting with fill lights'
    },
    { 
      id: 'natural', 
      name: 'Natural', 
      icon: Sun, 
      description: 'Warm daylight with soft shadows',
      preview: 'Golden hour outdoor lighting'
    },
    { 
      id: 'dramatic', 
      name: 'Dramatic', 
      icon: Moon, 
      description: 'High contrast single source',
      preview: 'Dark, moody with strong highlights'
    },
    { 
      id: 'gallery', 
      name: 'Gallery', 
      icon: Building, 
      description: 'Museum display with spot lights',
      preview: 'Even illumination from multiple angles'
    },
  ];

  const handleLightingPreset = (presetId: string) => {
    if (onApplyPreset) {
      console.log('Applying lighting preset:', presetId);
      onApplyPreset(presetId as LightingPreset);
      toast.success(`Applied ${presetId} lighting - watch the card transform!`);
    }
  };

  const handleBrightnessChange = (value: number) => {
    onBrightnessChange(value);
    // Update both primary and ambient lighting proportionally
    const primaryIntensity = (value / 100) * 3.0; // Max 3.0 for dramatic effect
    const ambientIntensity = (value / 100) * 0.8; // Max 0.8 for ambient
    
    onUpdateLighting({
      primaryLight: {
        ...lightingSettings.primaryLight,
        intensity: primaryIntensity
      },
      ambientLight: {
        ...lightingSettings.ambientLight,
        intensity: ambientIntensity
      }
    });
    
    console.log('Updated lighting brightness:', { primaryIntensity, ambientIntensity });
  };

  const handleDynamicLightingToggle = () => {
    const newValue = !lightingSettings.useDynamicLighting;
    onUpdateLighting({
      useDynamicLighting: newValue
    });
    console.log('Dynamic lighting toggled:', newValue);
    toast.success(`Dynamic lighting ${newValue ? 'enabled - move your mouse!' : 'disabled'}`);
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
          <div className="grid grid-cols-1 gap-3">
            {easyPresets.map((preset) => {
              const IconComponent = preset.icon;
              const isActive = lightingSettings.environmentType === preset.id;
              
              return (
                <Button
                  key={preset.id}
                  variant="outline"
                  onClick={() => handleLightingPreset(preset.id)}
                  className={`h-auto p-4 flex-col gap-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-lg shadow-blue-600/25' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <IconComponent className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{preset.name}</span>
                        {isActive && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Active</span>
                        )}
                      </div>
                      <p className="text-xs opacity-75 mt-1">{preset.description}</p>
                      <p className="text-xs opacity-60 mt-1 italic">{preset.preview}</p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Simplified controls for easy mode */}
          <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <Label className="text-white">Overall Brightness</Label>
              <span className="text-sm text-blue-400 font-medium">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              min={20}
              max={200}
              step={10}
              onValueChange={([value]) => handleBrightnessChange(value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtle</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Dynamic lighting toggle */}
          <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-4">
            <div>
              <Label className="text-white">Interactive Lighting</Label>
              <p className="text-xs text-gray-400 mt-1">Light follows your mouse movement</p>
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

      {/* Pro Mode - Keep existing advanced controls */}
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
