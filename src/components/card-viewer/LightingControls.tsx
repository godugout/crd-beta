
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Palette, Zap, Sparkles, Building } from 'lucide-react';
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
  const [activeMode, setActiveMode] = useState<'easy' | 'advanced'>('easy');

  // Environment presets for easy mode
  const environmentPresets = [
    { 
      value: 'studio' as LightingPreset, 
      label: 'Studio', 
      description: 'Clean, professional lighting',
      icon: Building,
      color: 'bg-blue-100 text-blue-700'
    },
    { 
      value: 'natural' as LightingPreset, 
      label: 'Natural', 
      description: 'Soft, daylight appearance',
      icon: Sun,
      color: 'bg-yellow-100 text-yellow-700'
    },
    { 
      value: 'dramatic' as LightingPreset, 
      label: 'Dramatic', 
      description: 'High contrast, moody lighting',
      icon: Moon,
      color: 'bg-purple-100 text-purple-700'
    },
    { 
      value: 'display_case' as LightingPreset, 
      label: 'Display Case', 
      description: 'Museum-style presentation',
      icon: Sparkles,
      color: 'bg-emerald-100 text-emerald-700'
    }
  ];

  const handlePresetClick = (preset: LightingPreset) => {
    if (onApplyPreset) {
      onApplyPreset(preset);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'easy' | 'advanced')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="easy">Easy Mode</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="easy" className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Choose a Lighting Style</h3>
            <p className="text-sm text-gray-600">Select a preset that matches the mood you want for your card</p>
            
            <div className="grid grid-cols-1 gap-3">
              {environmentPresets.map((preset) => {
                const Icon = preset.icon;
                const isActive = settings.environmentType === preset.value;
                
                return (
                  <Button
                    key={preset.value}
                    variant={isActive ? "default" : "outline"}
                    className={`h-auto p-4 justify-start ${isActive ? '' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePresetClick(preset.value)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`p-2 rounded-md ${preset.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{preset.label}</span>
                          {isActive && <Badge variant="secondary" className="text-xs">Active</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {/* Quick toggles for easy mode */}
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-medium">Quick Settings</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Dynamic Lighting</Label>
                  <p className="text-xs text-gray-500">Light follows your mouse movement</p>
                </div>
                <Button
                  variant={settings.useDynamicLighting ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleDynamicLighting}
                >
                  {settings.useDynamicLighting ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Overall Brightness</Label>
                  <span className="text-sm text-gray-500">{Math.round(settings.primaryLight.intensity * 100)}%</span>
                </div>
                <Slider
                  value={[settings.primaryLight.intensity]}
                  min={0.1}
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
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Advanced Lighting Controls</h3>
              {isUserCustomized && (
                <Badge variant="outline" className="text-xs">Custom Settings</Badge>
              )}
            </div>
            
            {/* Environment Selection */}
            <div className="space-y-2">
              <Label className="font-medium">Environment Preset</Label>
              <div className="grid grid-cols-2 gap-2">
                {environmentPresets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <Button
                      key={preset.value}
                      variant={settings.environmentType === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePresetClick(preset.value)}
                      className="justify-start"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {preset.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Primary Light Controls */}
            <div className="space-y-4">
              <h4 className="font-medium">Primary Light</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="primaryIntensity">Intensity</Label>
                  <span className="text-sm text-gray-500">{settings.primaryLight.intensity.toFixed(1)}</span>
                </div>
                <Slider
                  id="primaryIntensity"
                  value={[settings.primaryLight.intensity]}
                  min={0}
                  max={3}
                  step={0.1}
                  onValueChange={([value]) => 
                    onUpdateSettings({
                      primaryLight: { ...settings.primaryLight, intensity: value }
                    })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Color Temperature</Label>
                <div className="flex gap-2">
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
                    Neutral
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
                    <Zap className="h-4 w-4 mr-2" />
                    Warm
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Ambient Light Controls */}
            <div className="space-y-4">
              <h4 className="font-medium">Ambient Light</h4>
              
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
            </div>
            
            {/* Light Position Controls */}
            <div className="space-y-4">
              <h4 className="font-medium">Light Position</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="lightX">Horizontal (X)</Label>
                    <span className="text-sm text-gray-500">{settings.primaryLight.x.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="lightX"
                    value={[settings.primaryLight.x]}
                    min={-10}
                    max={10}
                    step={0.5}
                    onValueChange={([value]) => 
                      onUpdateSettings({
                        primaryLight: { ...settings.primaryLight, x: value }
                      })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="lightY">Vertical (Y)</Label>
                    <span className="text-sm text-gray-500">{settings.primaryLight.y.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="lightY"
                    value={[settings.primaryLight.y]}
                    min={-10}
                    max={10}
                    step={0.5}
                    onValueChange={([value]) => 
                      onUpdateSettings({
                        primaryLight: { ...settings.primaryLight, y: value }
                      })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="lightZ">Depth (Z)</Label>
                    <span className="text-sm text-gray-500">{settings.primaryLight.z.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="lightZ"
                    value={[settings.primaryLight.z]}
                    min={-10}
                    max={10}
                    step={0.5}
                    onValueChange={([value]) => 
                      onUpdateSettings({
                        primaryLight: { ...settings.primaryLight, z: value }
                      })
                    }
                  />
                </div>
              </div>
            </div>
            
            {/* Environment Map Intensity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="envMapIntensity">Environment Reflection</Label>
                <span className="text-sm text-gray-500">{(settings.envMapIntensity || 1).toFixed(1)}</span>
              </div>
              <Slider
                id="envMapIntensity"
                value={[settings.envMapIntensity || 1]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={([value]) => 
                  onUpdateSettings({ envMapIntensity: value })
                }
              />
            </div>
            
            {/* Dynamic Lighting Toggle */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <Label className="font-medium">Dynamic Lighting</Label>
                <p className="text-xs text-gray-500">Light follows mouse movement</p>
              </div>
              <Button
                variant={settings.useDynamicLighting ? "default" : "outline"}
                size="sm"
                onClick={onToggleDynamicLighting}
              >
                {settings.useDynamicLighting ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LightingControls;
