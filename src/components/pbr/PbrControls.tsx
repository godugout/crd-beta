
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { PbrSettings } from './types';

interface PbrControlsProps {
  settings: PbrSettings;
  onChange: (newSettings: Partial<PbrSettings>) => void;
}

const PbrControls: React.FC<PbrControlsProps> = ({ settings, onChange }) => {
  const handleSliderChange = (key: keyof PbrSettings) => (values: number[]) => {
    onChange({ [key]: values[0] });
  };
  
  return (
    <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Material Settings</h3>
        <p className="text-sm text-muted-foreground">
          Adjust the physical properties of the card materials
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="roughness">Roughness</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(settings.roughness * 100)}%
            </span>
          </div>
          <Slider 
            id="roughness"
            min={0} 
            max={1} 
            step={0.01} 
            defaultValue={[settings.roughness]} 
            onValueChange={handleSliderChange('roughness')}
          />
          <p className="text-xs text-muted-foreground">
            Controls how smooth (0) or rough (1) the surface appears
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="metalness">Metalness</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(settings.metalness * 100)}%
            </span>
          </div>
          <Slider 
            id="metalness"
            min={0} 
            max={1} 
            step={0.01} 
            defaultValue={[settings.metalness]} 
            onValueChange={handleSliderChange('metalness')}
          />
          <p className="text-xs text-muted-foreground">
            Controls how metal-like (1) or dielectric (0) the surface appears
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="exposure">Exposure</Label>
            <span className="text-sm text-muted-foreground">
              {settings.exposure.toFixed(1)}
            </span>
          </div>
          <Slider 
            id="exposure"
            min={0.1} 
            max={3} 
            step={0.1} 
            defaultValue={[settings.exposure]} 
            onValueChange={handleSliderChange('exposure')}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="envMap">Reflection Intensity</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(settings.envMapIntensity * 100)}%
            </span>
          </div>
          <Slider 
            id="envMap"
            min={0} 
            max={3} 
            step={0.1} 
            defaultValue={[settings.envMapIntensity]} 
            onValueChange={handleSliderChange('envMapIntensity')}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Special Effects</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="holographic">Holographic</Label>
            <Switch
              id="holographic"
              checked={settings.holographicEffect > 0}
              onCheckedChange={(checked) => 
                onChange({ holographicEffect: checked ? 0.7 : 0 })
              }
            />
          </div>
          {settings.holographicEffect > 0 && (
            <Slider 
              min={0.1} 
              max={1} 
              step={0.1} 
              defaultValue={[settings.holographicEffect]} 
              onValueChange={(values) => onChange({ holographicEffect: values[0] })}
            />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="chrome">Chrome</Label>
            <Switch
              id="chrome"
              checked={settings.chromeEffect > 0}
              onCheckedChange={(checked) => 
                onChange({ chromeEffect: checked ? 0.5 : 0 })
              }
            />
          </div>
          {settings.chromeEffect > 0 && (
            <Slider 
              min={0.1} 
              max={1} 
              step={0.1} 
              defaultValue={[settings.chromeEffect]} 
              onValueChange={(values) => onChange({ chromeEffect: values[0] })}
            />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="vintage">Vintage</Label>
            <Switch
              id="vintage"
              checked={settings.vintageEffect > 0}
              onCheckedChange={(checked) => 
                onChange({ vintageEffect: checked ? 0.3 : 0 })
              }
            />
          </div>
          {settings.vintageEffect > 0 && (
            <Slider 
              min={0.1} 
              max={1} 
              step={0.1} 
              defaultValue={[settings.vintageEffect]} 
              onValueChange={(values) => onChange({ vintageEffect: values[0] })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PbrControls;
