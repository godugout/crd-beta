
import React from 'react';
import { LightingSettings, LightingPreset, useCardLighting } from '@/hooks/useCardLighting';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sun,
  Moon,
  BrightnessHigh,
  PaintBucket,
  Palette,
  Sliders,
  Eye
} from 'lucide-react';

interface LightingControlsProps {
  settings: LightingSettings;
  onUpdateSettings: (settings: Partial<LightingSettings>) => void;
  onApplyPreset: (preset: LightingPreset) => void;
  onToggleDynamicLighting: () => void;
  isUserCustomized: boolean;
}

export const LightingControls = ({
  settings,
  onUpdateSettings,
  onApplyPreset,
  onToggleDynamicLighting,
  isUserCustomized
}: LightingControlsProps) => {
  const handlePrimaryLightIntensity = (value: number[]) => {
    onUpdateSettings({
      primaryLight: {
        ...settings.primaryLight,
        intensity: value[0]
      }
    });
  };

  const handleAmbientLightIntensity = (value: number[]) => {
    onUpdateSettings({
      ambientLight: {
        ...settings.ambientLight,
        intensity: value[0]
      }
    });
  };

  const handleEnvMapIntensity = (value: number[]) => {
    onUpdateSettings({
      envMapIntensity: value[0]
    });
  };

  const presets: Array<{ id: LightingPreset; name: string; icon: React.ReactNode }> = [
    {
      id: 'studio',
      name: 'Studio',
      icon: <Sun className="w-4 h-4" />
    },
    {
      id: 'natural',
      name: 'Natural',
      icon: <BrightnessHigh className="w-4 h-4" />
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      icon: <Moon className="w-4 h-4" />
    },
    {
      id: 'display_case',
      name: 'Display Case',
      icon: <Eye className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <Sliders className="w-5 h-5 mr-2" />
        Lighting Controls
      </h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Lighting Presets</span>
          {isUserCustomized && (
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              Custom
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.id)}
              className={`px-2 py-1.5 rounded flex flex-col items-center justify-center text-xs ${
                settings.environmentType === preset.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {preset.icon}
              <span className="mt-1">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="main">
        <TabsList className="w-full">
          <TabsTrigger value="main" className="flex-1">
            <Sun className="w-4 h-4 mr-2" />
            Main Light
          </TabsTrigger>
          <TabsTrigger value="ambient" className="flex-1">
            <BrightnessHigh className="w-4 h-4 mr-2" />
            Ambient
          </TabsTrigger>
          <TabsTrigger value="environment" className="flex-1">
            <PaintBucket className="w-4 h-4 mr-2" />
            Environment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="main-light-intensity">Intensity</Label>
              <span className="text-sm tabular-nums">{settings.primaryLight.intensity.toFixed(1)}</span>
            </div>
            <Slider
              id="main-light-intensity"
              value={[settings.primaryLight.intensity]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={handlePrimaryLightIntensity}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="main-light-color">Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="main-light-color"
                type="color"
                value={settings.primaryLight.color}
                onChange={(e) => onUpdateSettings({
                  primaryLight: {
                    ...settings.primaryLight,
                    color: e.target.value
                  }
                })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <span className="text-sm">{settings.primaryLight.color}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="use-dynamic-lighting">Dynamic Lighting</Label>
            <Switch
              id="use-dynamic-lighting"
              checked={settings.useDynamicLighting}
              onCheckedChange={onToggleDynamicLighting}
            />
          </div>
        </TabsContent>

        <TabsContent value="ambient" className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient-light-intensity">Intensity</Label>
              <span className="text-sm tabular-nums">{settings.ambientLight.intensity.toFixed(1)}</span>
            </div>
            <Slider
              id="ambient-light-intensity"
              value={[settings.ambientLight.intensity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={handleAmbientLightIntensity}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ambient-light-color">Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="ambient-light-color"
                type="color"
                value={settings.ambientLight.color}
                onChange={(e) => onUpdateSettings({
                  ambientLight: {
                    ...settings.ambientLight,
                    color: e.target.value
                  }
                })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <span className="text-sm">{settings.ambientLight.color}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="environment-intensity">Environment Intensity</Label>
              <span className="text-sm tabular-nums">{settings.envMapIntensity.toFixed(1)}</span>
            </div>
            <Slider
              id="environment-intensity"
              value={[settings.envMapIntensity]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={handleEnvMapIntensity}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LightingControls;
