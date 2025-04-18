import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Palette } from 'lucide-react';
import { LightingSettings, LightingPreset } from '@/hooks/useCardLighting';

interface LightingControlsProps {
  settings: LightingSettings;
  onUpdateSettings: (settings: Partial<LightingSettings>) => void;
  onApplyPreset?: (preset: LightingPreset) => void;
  onToggleDynamicLighting?: () => void;
  isUserCustomized?: boolean;
}

const LightingControls: React.FC<LightingControlsProps> = ({
  settings,
  onUpdateSettings
}) => {
  // Environment presets
  const environmentPresets = [
    { value: 'studio' as LightingPreset, label: 'Studio' },
    { value: 'natural' as LightingPreset, label: 'Natural' },
    { value: 'dramatic' as LightingPreset, label: 'Dramatic' },
    { value: 'display_case' as LightingPreset, label: 'Display Case' },
  ];

  return (
    <div className="space-y-8 pb-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Environment</h3>
        <Select 
          value={settings.environmentType} 
          onValueChange={(value: string) => {
            if (value === 'studio' || value === 'natural' || value === 'dramatic' || value === 'display_case') {
              onUpdateSettings({ environmentType: value as LightingPreset });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {environmentPresets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Primary Light</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="primaryIntensity">Intensity</Label>
            <span className="text-sm text-gray-400">{settings.primaryLight.intensity.toFixed(1)}</span>
          </div>
          <Slider
            id="primaryIntensity"
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
        
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Color</Label>
          <div className="flex gap-2">
            <Button 
              variant={settings.primaryLight.color === '#ffffff' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...settings.primaryLight, color: '#ffffff' }
                })
              }
            >
              <Sun className="h-4 w-4 mr-2" />
              White
            </Button>
            <Button 
              variant={settings.primaryLight.color === '#fff5e0' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...settings.primaryLight, color: '#fff5e0' }
                })
              }
            >
              <Sun className="h-4 w-4 mr-2" />
              Warm
            </Button>
            <Button 
              variant={settings.primaryLight.color === '#e0f0ff' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...settings.primaryLight, color: '#e0f0ff' }
                })
              }
            >
              <Moon className="h-4 w-4 mr-2" />
              Cool
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ambient Light</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="ambientIntensity">Intensity</Label>
            <span className="text-sm text-gray-400">{settings.ambientLight.intensity.toFixed(1)}</span>
          </div>
          <Slider
            id="ambientIntensity"
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
      
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoRotate" className="cursor-pointer">Auto Rotate</Label>
          <Switch
            id="autoRotate"
            checked={false}
            onCheckedChange={(checked) => {
              // Handle auto rotation here - will be implemented in a future update
            }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="followPointer" className="cursor-pointer">Follow Pointer</Label>
          <Switch
            id="followPointer"
            checked={false}
            onCheckedChange={(checked) => {
              // Handle follow pointer here - will be implemented in a future update
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LightingControls;
