
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LightingSettings, LightingPreset } from '@/hooks/useCardLighting';
import { cn } from '@/lib/utils';
import { Eye, Sun, Moon } from 'lucide-react';

interface ViewerSettingsProps {
  settings: LightingSettings;
  onUpdateSettings: (settings: Partial<LightingSettings>) => void;
  onApplyPreset: (preset: LightingPreset) => void;
  isOpen: boolean;
}

const ViewerSettings: React.FC<ViewerSettingsProps> = ({
  settings,
  onUpdateSettings,
  onApplyPreset,
  isOpen
}) => {
  const environments = [
    { value: 'studio', label: 'Studio' },
    { value: 'natural', label: 'Natural' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'display_case', label: 'Display Case' }
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Environment
        </h3>
        <Select 
          value={settings.environmentType} 
          onValueChange={(value: LightingPreset) => onApplyPreset(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {environments.map((env) => (
              <SelectItem key={env.value} value={env.value}>
                {env.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Primary Light
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Intensity</Label>
            <span className="text-sm text-gray-400">
              {settings.primaryLight.intensity.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[settings.primaryLight.intensity]}
            min={0}
            max={2}
            step={0.1}
            onValueChange={([value]) => 
              onUpdateSettings({
                primaryLight: { ...settings.primaryLight, intensity: value }
              })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Ambient Light
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Intensity</Label>
            <span className="text-sm text-gray-400">
              {settings.ambientLight.intensity.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[settings.ambientLight.intensity]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={([value]) => 
              onUpdateSettings({
                ambientLight: { ...settings.ambientLight, intensity: value }
              })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoRotate">Auto Rotate</Label>
          <Switch
            id="autoRotate"
            checked={settings.autoRotate}
            onCheckedChange={(checked) => 
              onUpdateSettings({ autoRotate: checked })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerSettings;
