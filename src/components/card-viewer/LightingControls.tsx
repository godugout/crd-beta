import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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
  onUpdateSettings,
  onApplyPreset,
  onToggleDynamicLighting,
  isUserCustomized
}) => {
  // Environment presets
  const environmentPresets = [
    { value: 'studio' as LightingPreset, label: 'Studio' },
    { value: 'natural' as LightingPreset, label: 'Natural' },
    { value: 'dramatic' as LightingPreset, label: 'Dramatic' },
    { value: 'display_case' as LightingPreset, label: 'Display Case' }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Environment</h3>
        <Select 
          value={settings.environmentType} 
          onValueChange={(value: string) => {
            if (onApplyPreset && (value === 'studio' || value === 'natural' || value === 'dramatic' || value === 'display_case')) {
              onApplyPreset(value as LightingPreset);
            } else {
              onUpdateSettings({ environmentType: value as LightingPreset });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {environmentPresets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>{preset.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Primary Light</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="primaryIntensity">Intensity</Label>
            <span className="text-sm text-gray-500">{settings.primaryLight.intensity.toFixed(1)}</span>
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
            <span className="text-sm text-gray-500">{settings.ambientLight.intensity.toFixed(1)}</span>
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
        
        <div className="space-y-2">
          <Label htmlFor="ambientColor">Color</Label>
          <div className="flex gap-2">
            <Button 
              variant={settings.ambientLight.color === '#202020' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  ambientLight: { ...settings.ambientLight, color: '#202020' }
                })
              }
            >
              <Palette className="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button 
              variant={settings.ambientLight.color === '#404040' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  ambientLight: { ...settings.ambientLight, color: '#404040' }
                })
              }
            >
              <Palette className="h-4 w-4 mr-2" />
              Medium
            </Button>
            <Button 
              variant={settings.ambientLight.color === '#606060' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  ambientLight: { ...settings.ambientLight, color: '#606060' }
                })
              }
            >
              <Palette className="h-4 w-4 mr-2" />
              Light
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Light Position</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="lightX">X Position</Label>
            <span className="text-sm text-gray-500">{settings.primaryLight.x.toFixed(1)}</span>
          </div>
          <Slider
            id="lightX"
            value={[settings.primaryLight.x]}
            min={-5}
            max={5}
            step={0.1}
            onValueChange={([value]) => 
              onUpdateSettings({
                primaryLight: { ...settings.primaryLight, x: value }
              })
            }
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="lightY">Y Position</Label>
            <span className="text-sm text-gray-500">{settings.primaryLight.y.toFixed(1)}</span>
          </div>
          <Slider
            id="lightY"
            value={[settings.primaryLight.y]}
            min={-5}
            max={5}
            step={0.1}
            onValueChange={([value]) => 
              onUpdateSettings({
                primaryLight: { ...settings.primaryLight, y: value }
              })
            }
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="lightZ">Z Position</Label>
            <span className="text-sm text-gray-500">{settings.primaryLight.z.toFixed(1)}</span>
          </div>
          <Slider
            id="lightZ"
            value={[settings.primaryLight.z]}
            min={-5}
            max={5}
            step={0.1}
            onValueChange={([value]) => 
              onUpdateSettings({
                primaryLight: { ...settings.primaryLight, z: value }
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LightingControls;
