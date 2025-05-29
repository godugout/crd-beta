
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Lightbulb, 
  Sun, 
  Palette,
  Building
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
  const lightingPresets = [
    { id: 'studio', name: 'Studio', icon: Lightbulb },
    { id: 'natural', name: 'Natural', icon: Sun },
    { id: 'dramatic', name: 'Dramatic', icon: Palette },
    { id: 'display_case', name: 'Gallery', icon: Building },
  ];

  const handleLightingPreset = (presetId: string) => {
    if (onApplyPreset) {
      onApplyPreset(presetId as LightingPreset);
    }
    onUpdateLighting({ environmentType: presetId as LightingPreset });
    toast.success(`Applied ${presetId} lighting`);
  };

  const handleBrightnessChange = (value: number) => {
    onBrightnessChange(value);
    onUpdateLighting({
      primaryLight: {
        ...lightingSettings.primaryLight,
        intensity: value / 100
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Lighting</h3>
        <div className="flex bg-gray-800 rounded-lg p-1">
          <Button
            variant={lightingMode === 'easy' ? "default" : "ghost"}
            size="sm"
            onClick={() => onLightingModeChange('easy')}
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
            onClick={() => onLightingModeChange('pro')}
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
          onValueChange={([value]) => handleBrightnessChange(value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default LightingSection;
