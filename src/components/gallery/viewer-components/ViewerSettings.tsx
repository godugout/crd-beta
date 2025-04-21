
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { lightingPresets } from '@/utils/environmentPresets';

interface LightingSettings {
  environmentType: string;
  ambientLight: {
    intensity: number;
    color: string;
  };
  primaryLight: {
    x: number;
    y: number;
    z: number;
    intensity: number;
    color: string;
  };
  autoRotate: boolean;
}

interface ViewerSettingsProps {
  settings: LightingSettings;
  onUpdateSettings: (path: string, value: any) => void;
  onApplyPreset: (preset: string) => void;
  isOpen: boolean;
}

const ViewerSettings: React.FC<ViewerSettingsProps> = ({
  settings,
  onUpdateSettings,
  onApplyPreset,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="space-y-5">
      <h3 className="font-medium text-lg mb-2">Lighting Settings</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="preset" className="block mb-1">Lighting Preset</Label>
          <Select 
            value={settings.environmentType}
            onValueChange={(value) => onApplyPreset(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {lightingPresets.map(preset => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-1">Ambient Light Intensity</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.ambientLight.intensity]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => onUpdateSettings('ambientLight.intensity', value)}
              className="flex-1"
            />
            <span className="w-10 text-right">{settings.ambientLight.intensity.toFixed(1)}</span>
          </div>
        </div>
        
        <div>
          <Label className="block mb-1">Primary Light Intensity</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.primaryLight.intensity]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => onUpdateSettings('primaryLight.intensity', value)}
              className="flex-1"
            />
            <span className="w-10 text-right">{settings.primaryLight.intensity.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <Label className="block mb-1">Light Position</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-xs mb-1 text-gray-500">X</div>
              <Slider
                value={[settings.primaryLight.x]}
                min={-10}
                max={10}
                step={0.5}
                onValueChange={([value]) => onUpdateSettings('primaryLight.x', value)}
              />
            </div>
            <div>
              <div className="text-xs mb-1 text-gray-500">Y</div>
              <Slider
                value={[settings.primaryLight.y]}
                min={-10}
                max={10}
                step={0.5}
                onValueChange={([value]) => onUpdateSettings('primaryLight.y', value)}
              />
            </div>
            <div>
              <div className="text-xs mb-1 text-gray-500">Z</div>
              <Slider
                value={[settings.primaryLight.z]}
                min={-10}
                max={10}
                step={0.5}
                onValueChange={([value]) => onUpdateSettings('primaryLight.z', value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="autorotate">Auto Rotate</Label>
          <Switch
            id="autorotate"
            checked={settings.autoRotate}
            onCheckedChange={(checked) => onUpdateSettings('autoRotate', checked)}
          />
        </div>

        <div className="text-xs text-gray-500 mt-4">
          Tip: Adjust lighting to highlight card features
        </div>
      </div>
    </div>
  );
};

export default ViewerSettings;
