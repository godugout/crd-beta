
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Palette, Camera, Building } from 'lucide-react';
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
  // Ensure we have proper fallback values
  const safeSettings = {
    environmentType: settings?.environmentType || 'studio',
    primaryLight: {
      intensity: settings?.primaryLight?.intensity || 1.2,
      color: settings?.primaryLight?.color || '#ffffff',
      x: settings?.primaryLight?.x || 10,
      y: settings?.primaryLight?.y || 10,
      z: settings?.primaryLight?.z || 10
    },
    ambientLight: {
      intensity: settings?.ambientLight?.intensity || 0.6,
      color: settings?.ambientLight?.color || '#f0f0ff'
    },
    envMapIntensity: settings?.envMapIntensity || 1,
    useDynamicLighting: settings?.useDynamicLighting || false,
    followPointer: settings?.followPointer || false,
    autoRotate: settings?.autoRotate || false
  };

  // Enhanced presets with dramatic differences
  const environmentPresets = [
    { 
      value: 'studio' as LightingPreset, 
      label: 'Studio', 
      icon: Camera,
      description: 'Clean, professional lighting'
    },
    { 
      value: 'natural' as LightingPreset, 
      label: 'Natural', 
      icon: Sun,
      description: 'Warm daylight setting'
    },
    { 
      value: 'dramatic' as LightingPreset, 
      label: 'Dramatic', 
      icon: Moon,
      description: 'High contrast, moody'
    },
    { 
      value: 'display_case' as LightingPreset, 
      label: 'Display Case', 
      icon: Building,
      description: 'Museum gallery style'
    },
  ];

  // Quick preset buttons for common lighting scenarios
  const quickPresets = [
    {
      name: 'Bright',
      action: () => {
        onUpdateSettings({
          primaryLight: { ...safeSettings.primaryLight, intensity: 2.0 },
          ambientLight: { ...safeSettings.ambientLight, intensity: 0.8 },
          envMapIntensity: 1.5
        });
      }
    },
    {
      name: 'Soft',
      action: () => {
        onUpdateSettings({
          primaryLight: { ...safeSettings.primaryLight, intensity: 0.8 },
          ambientLight: { ...safeSettings.ambientLight, intensity: 0.5 },
          envMapIntensity: 0.8
        });
      }
    },
    {
      name: 'Warm',
      action: () => {
        onUpdateSettings({
          primaryLight: { ...safeSettings.primaryLight, color: '#fff5e0', intensity: 1.2 },
          ambientLight: { ...safeSettings.ambientLight, color: '#ffeaa0', intensity: 0.6 }
        });
      }
    },
    {
      name: 'Dramatic',
      action: () => {
        onUpdateSettings({
          primaryLight: { ...safeSettings.primaryLight, intensity: 2.5, x: 15, y: 5 },
          ambientLight: { ...safeSettings.ambientLight, intensity: 0.2 },
          envMapIntensity: 0.5
        });
      }
    }
  ];

  const handlePresetChange = (value: string) => {
    const preset = value as LightingPreset;
    onUpdateSettings({ environmentType: preset });
    
    // Apply preset-specific lighting configurations
    if (onApplyPreset) {
      onApplyPreset(preset);
    } else {
      // Fallback preset configurations
      switch (preset) {
        case 'studio':
          onUpdateSettings({
            environmentType: preset,
            primaryLight: { ...safeSettings.primaryLight, intensity: 1.2, x: 10, y: 10, z: 10 },
            ambientLight: { ...safeSettings.ambientLight, intensity: 0.6 },
            envMapIntensity: 1.0
          });
          break;
        case 'natural':
          onUpdateSettings({
            environmentType: preset,
            primaryLight: { ...safeSettings.primaryLight, intensity: 1.0, color: '#fff5e0' },
            ambientLight: { ...safeSettings.ambientLight, intensity: 0.7, color: '#e0f0ff' },
            envMapIntensity: 1.2
          });
          break;
        case 'dramatic':
          onUpdateSettings({
            environmentType: preset,
            primaryLight: { ...safeSettings.primaryLight, intensity: 2.0, x: 15, y: 5, z: 10 },
            ambientLight: { ...safeSettings.ambientLight, intensity: 0.3 },
            envMapIntensity: 0.8
          });
          break;
        case 'display_case':
          onUpdateSettings({
            environmentType: preset,
            primaryLight: { ...safeSettings.primaryLight, intensity: 1.5 },
            ambientLight: { ...safeSettings.ambientLight, intensity: 0.8 },
            envMapIntensity: 1.5
          });
          break;
      }
    }
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Environment Presets */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Environment</h3>
        <Select 
          value={safeSettings.environmentType} 
          onValueChange={handlePresetChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {environmentPresets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                <div className="flex items-center gap-2">
                  <preset.icon className="h-4 w-4" />
                  <div>
                    <div>{preset.label}</div>
                    <div className="text-xs text-gray-500">{preset.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Preset Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={preset.action}
              className="text-sm"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Primary Light Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Primary Light</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="primaryIntensity">Intensity</Label>
            <span className="text-sm text-gray-400">{safeSettings.primaryLight.intensity.toFixed(1)}</span>
          </div>
          <Slider
            id="primaryIntensity"
            value={[safeSettings.primaryLight.intensity]}
            min={0}
            max={3}
            step={0.1}
            onValueChange={([value]) => 
              onUpdateSettings({
                primaryLight: { ...safeSettings.primaryLight, intensity: value }
              })
            }
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Color Temperature</Label>
          <div className="flex gap-2">
            <Button 
              variant={safeSettings.primaryLight.color === '#e0f0ff' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, color: '#e0f0ff' }
                })
              }
            >
              <Moon className="h-4 w-4 mr-2" />
              Cool
            </Button>
            <Button 
              variant={safeSettings.primaryLight.color === '#ffffff' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, color: '#ffffff' }
                })
              }
            >
              <Sun className="h-4 w-4 mr-2" />
              White
            </Button>
            <Button 
              variant={safeSettings.primaryLight.color === '#fff5e0' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, color: '#fff5e0' }
                })
              }
            >
              <Palette className="h-4 w-4 mr-2" />
              Warm
            </Button>
          </div>
        </div>

        {/* Light Position Controls */}
        <div className="space-y-3">
          <Label>Light Position</Label>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="lightX" className="text-sm">Horizontal (X)</Label>
              <span className="text-xs text-gray-400">{safeSettings.primaryLight.x.toFixed(1)}</span>
            </div>
            <Slider
              id="lightX"
              value={[safeSettings.primaryLight.x]}
              min={-20}
              max={20}
              step={1}
              onValueChange={([value]) => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, x: value }
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="lightY" className="text-sm">Vertical (Y)</Label>
              <span className="text-xs text-gray-400">{safeSettings.primaryLight.y.toFixed(1)}</span>
            </div>
            <Slider
              id="lightY"
              value={[safeSettings.primaryLight.y]}
              min={-20}
              max={20}
              step={1}
              onValueChange={([value]) => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, y: value }
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="lightZ" className="text-sm">Distance (Z)</Label>
              <span className="text-xs text-gray-400">{safeSettings.primaryLight.z.toFixed(1)}</span>
            </div>
            <Slider
              id="lightZ"
              value={[safeSettings.primaryLight.z]}
              min={1}
              max={30}
              step={1}
              onValueChange={([value]) => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, z: value }
                })
              }
            />
          </div>
        </div>
      </div>
      
      {/* Ambient Light Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ambient Light</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="ambientIntensity">Intensity</Label>
            <span className="text-sm text-gray-400">{safeSettings.ambientLight.intensity.toFixed(1)}</span>
          </div>
          <Slider
            id="ambientIntensity"
            value={[safeSettings.ambientLight.intensity]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={([value]) => 
              onUpdateSettings({
                ambientLight: { ...safeSettings.ambientLight, intensity: value }
              })
            }
          />
        </div>
      </div>

      {/* Environment Map Intensity */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="envMapIntensity">Environment Reflections</Label>
          <span className="text-sm text-gray-400">{safeSettings.envMapIntensity.toFixed(1)}</span>
        </div>
        <Slider
          id="envMapIntensity"
          value={[safeSettings.envMapIntensity]}
          min={0}
          max={3}
          step={0.1}
          onValueChange={([value]) => 
            onUpdateSettings({ envMapIntensity: value })
          }
        />
      </div>
      
      {/* Interactive Features */}
      <div className="space-y-2 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoRotate" className="cursor-pointer">Auto Rotate</Label>
          <Switch
            id="autoRotate"
            checked={safeSettings.autoRotate}
            onCheckedChange={(checked) => {
              onUpdateSettings({ autoRotate: checked });
            }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="followPointer" className="cursor-pointer">Follow Pointer</Label>
          <Switch
            id="followPointer"
            checked={safeSettings.followPointer}
            onCheckedChange={(checked) => {
              onUpdateSettings({ followPointer: checked });
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="dynamicLighting" className="cursor-pointer">Dynamic Lighting</Label>
          <Switch
            id="dynamicLighting"
            checked={safeSettings.useDynamicLighting}
            onCheckedChange={(checked) => {
              onUpdateSettings({ useDynamicLighting: checked });
              if (onToggleDynamicLighting) {
                onToggleDynamicLighting();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LightingControls;
