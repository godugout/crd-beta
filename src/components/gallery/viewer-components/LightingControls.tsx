
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Palette, Lightbulb, Zap } from 'lucide-react';
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
  // Ensure we have proper fallback values for all settings
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

  // Environment presets with actual lighting configurations
  const environmentPresets = [
    { 
      value: 'studio' as LightingPreset, 
      label: 'Studio',
      description: 'Bright, even lighting',
      config: {
        primaryLight: { intensity: 1.2, color: '#ffffff', x: 10, y: 10, z: 5 },
        ambientLight: { intensity: 0.6, color: '#f0f0ff' },
        envMapIntensity: 1.0
      }
    },
    { 
      value: 'natural' as LightingPreset, 
      label: 'Natural',
      description: 'Soft daylight',
      config: {
        primaryLight: { intensity: 0.8, color: '#fff5e0', x: 15, y: 15, z: 10 },
        ambientLight: { intensity: 0.4, color: '#e0f0ff' },
        envMapIntensity: 0.8
      }
    },
    { 
      value: 'dramatic' as LightingPreset, 
      label: 'Dramatic',
      description: 'High contrast shadows',
      config: {
        primaryLight: { intensity: 2.0, color: '#ffffff', x: 20, y: 5, z: 5 },
        ambientLight: { intensity: 0.2, color: '#1a1a2e' },
        envMapIntensity: 1.2
      }
    },
    { 
      value: 'display_case' as LightingPreset, 
      label: 'Display Case',
      description: 'Museum-quality lighting',
      config: {
        primaryLight: { intensity: 1.0, color: '#fff8dc', x: 8, y: 12, z: 8 },
        ambientLight: { intensity: 0.5, color: '#f5f5dc' },
        envMapIntensity: 0.9
      }
    },
  ];

  const handlePresetChange = (value: string) => {
    const preset = environmentPresets.find(p => p.value === value);
    if (preset) {
      // Apply the full preset configuration
      onUpdateSettings({
        environmentType: preset.value,
        ...preset.config
      });
      
      // If onApplyPreset is provided, call it too
      if (onApplyPreset) {
        onApplyPreset(preset.value);
      }
    }
  };

  const handleQuickPreset = (presetConfig: Partial<LightingSettings>) => {
    onUpdateSettings(presetConfig);
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Environment Presets */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Environment Presets
        </h3>
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
                <div className="flex flex-col">
                  <span className="font-medium">{preset.label}</span>
                  <span className="text-xs text-gray-500">{preset.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Lighting Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-600">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickPreset({
              primaryLight: { ...safeSettings.primaryLight, intensity: 2.0, color: '#ffffff' },
              ambientLight: { ...safeSettings.ambientLight, intensity: 0.3 }
            })}
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Bright
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickPreset({
              primaryLight: { ...safeSettings.primaryLight, intensity: 0.5, color: '#e0f0ff' },
              ambientLight: { ...safeSettings.ambientLight, intensity: 0.8 }
            })}
          >
            <Moon className="h-4 w-4 mr-1" />
            Soft
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickPreset({
              primaryLight: { ...safeSettings.primaryLight, intensity: 1.5, color: '#fff5e0' },
              ambientLight: { ...safeSettings.ambientLight, intensity: 0.4 }
            })}
          >
            <Sun className="h-4 w-4 mr-1" />
            Warm
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickPreset({
              primaryLight: { ...safeSettings.primaryLight, intensity: 1.8, color: '#ffffff' },
              ambientLight: { ...safeSettings.ambientLight, intensity: 0.1 },
              envMapIntensity: 1.5
            })}
          >
            <Zap className="h-4 w-4 mr-1" />
            Dramatic
          </Button>
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
        
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">X Position</Label>
            <Slider
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
            <span className="text-xs text-gray-500">{safeSettings.primaryLight.x}</span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Y Position</Label>
            <Slider
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
            <span className="text-xs text-gray-500">{safeSettings.primaryLight.y}</span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Z Position</Label>
            <Slider
              value={[safeSettings.primaryLight.z]}
              min={-20}
              max={20}
              step={1}
              onValueChange={([value]) => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, z: value }
                })
              }
            />
            <span className="text-xs text-gray-500">{safeSettings.primaryLight.z}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Color</Label>
          <div className="flex gap-2">
            <Button 
              variant={safeSettings.primaryLight.color === '#ffffff' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, color: '#ffffff' }
                })
              }
            >
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
              Warm
            </Button>
            <Button 
              variant={safeSettings.primaryLight.color === '#e0f0ff' ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onUpdateSettings({
                  primaryLight: { ...safeSettings.primaryLight, color: '#e0f0ff' }
                })
              }
            >
              Cool
            </Button>
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
          <Label htmlFor="envMapIntensity">Environment Reflection</Label>
          <span className="text-sm text-gray-400">{safeSettings.envMapIntensity.toFixed(1)}</span>
        </div>
        <Slider
          id="envMapIntensity"
          value={[safeSettings.envMapIntensity]}
          min={0}
          max={2}
          step={0.1}
          onValueChange={([value]) => 
            onUpdateSettings({ envMapIntensity: value })
          }
        />
      </div>
      
      {/* Interactive Options */}
      <div className="space-y-3 pt-2 border-t">
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

        {onToggleDynamicLighting && (
          <div className="flex items-center justify-between">
            <Label htmlFor="dynamicLighting" className="cursor-pointer">Dynamic Lighting</Label>
            <Switch
              id="dynamicLighting"
              checked={safeSettings.useDynamicLighting}
              onCheckedChange={onToggleDynamicLighting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LightingControls;
