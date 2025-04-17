
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCardLighting, LIGHTING_PRESETS } from '@/hooks/useCardLighting';

interface LightingControlsProps {
  preset?: keyof typeof LIGHTING_PRESETS;
  onPresetChange?: (preset: keyof typeof LIGHTING_PRESETS) => void;
}

const LightingControls: React.FC<LightingControlsProps> = ({
  preset = 'display_case',
  onPresetChange
}) => {
  const {
    lightingSettings,
    updateLightSetting,
    applyPreset,
    toggleFollowPointer,
    toggleAutoRotate
  } = useCardLighting(preset);

  const handlePresetChange = (newPreset: keyof typeof LIGHTING_PRESETS) => {
    applyPreset(newPreset);
    if (onPresetChange) {
      onPresetChange(newPreset);
    }
  };

  return (
    <div className="p-4 bg-background border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Lighting Controls</h3>
      
      <Tabs defaultValue="presets">
        <TabsList className="mb-4">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="primary">Primary Light</TabsTrigger>
          <TabsTrigger value="ambient">Ambient Light</TabsTrigger>
          <TabsTrigger value="automation">Auto</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(LIGHTING_PRESETS) as Array<keyof typeof LIGHTING_PRESETS>).map((presetName) => (
              <Button
                key={presetName}
                variant={lightingSettings.environmentType === presetName ? "default" : "outline"}
                onClick={() => handlePresetChange(presetName)}
                className="h-24 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20" 
                     style={{ 
                       background: `radial-gradient(circle at top right, 
                         ${LIGHTING_PRESETS[presetName].primaryLight.color}, 
                         ${LIGHTING_PRESETS[presetName].ambientLight.color})`
                     }} 
                />
                <div className="z-10">
                  <div className="capitalize font-medium">
                    {presetName.replace('_', ' ')}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="primary" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Intensity</Label>
              <span className="text-sm text-muted-foreground">
                {lightingSettings.primaryLight.intensity.toFixed(2)}
              </span>
            </div>
            <Slider 
              min={0} 
              max={2} 
              step={0.05}
              value={[lightingSettings.primaryLight.intensity]}
              onValueChange={(values) => updateLightSetting('intensity', values[0], 'primaryLight')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primaryLightColor">Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="primaryLightColor"
                type="color" 
                value={lightingSettings.primaryLight.color} 
                onChange={(e) => updateLightSetting('color', e.target.value, 'primaryLight')}
                className="w-12 h-8 p-0"
              />
              <span className="text-sm text-muted-foreground">
                {lightingSettings.primaryLight.color}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Position X</Label>
            <Slider 
              min={-20} 
              max={20} 
              step={0.5}
              value={[lightingSettings.primaryLight.x]}
              onValueChange={(values) => updateLightSetting('x', values[0], 'primaryLight')}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Left</span>
              <span className="text-xs text-muted-foreground">Right</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Position Y</Label>
            <Slider 
              min={-20} 
              max={20} 
              step={0.5}
              value={[lightingSettings.primaryLight.y]}
              onValueChange={(values) => updateLightSetting('y', values[0], 'primaryLight')}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Down</span>
              <span className="text-xs text-muted-foreground">Up</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Position Z</Label>
            <Slider 
              min={-20} 
              max={20} 
              step={0.5}
              value={[lightingSettings.primaryLight.z]}
              onValueChange={(values) => updateLightSetting('z', values[0], 'primaryLight')}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Behind</span>
              <span className="text-xs text-muted-foreground">In front</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="castShadow"
              checked={lightingSettings.primaryLight.castShadow}
              onCheckedChange={(checked) => updateLightSetting('castShadow', checked, 'primaryLight')}
            />
            <Label htmlFor="castShadow">Cast Shadow</Label>
          </div>
        </TabsContent>
        
        <TabsContent value="ambient" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Intensity</Label>
              <span className="text-sm text-muted-foreground">
                {lightingSettings.ambientLight.intensity.toFixed(2)}
              </span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.05}
              value={[lightingSettings.ambientLight.intensity]}
              onValueChange={(values) => updateLightSetting('intensity', values[0], 'ambientLight')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ambientLightColor">Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="ambientLightColor"
                type="color" 
                value={lightingSettings.ambientLight.color} 
                onChange={(e) => updateLightSetting('color', e.target.value, 'ambientLight')}
                className="w-12 h-8 p-0"
              />
              <span className="text-sm text-muted-foreground">
                {lightingSettings.ambientLight.color}
              </span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="automation" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="followPointer"
              checked={lightingSettings.followPointer}
              onCheckedChange={toggleFollowPointer}
            />
            <Label htmlFor="followPointer">Light Follows Pointer</Label>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="autoRotate"
              checked={lightingSettings.autoRotate}
              onCheckedChange={toggleAutoRotate}
            />
            <Label htmlFor="autoRotate">Auto-Rotate Light</Label>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              When auto-rotate is enabled, the primary light will rotate around the card automatically.
              When pointer following is enabled, the light will follow your mouse or touch position.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LightingControls;
