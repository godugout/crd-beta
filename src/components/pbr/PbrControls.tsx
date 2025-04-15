
import React from 'react';
import { PbrSettings } from './types';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

interface PbrControlsProps {
  settings: PbrSettings;
  onChange: (newSettings: Partial<PbrSettings>) => void;
}

const PbrControls: React.FC<PbrControlsProps> = ({ settings, onChange }) => {
  const handleSliderChange = (key: keyof PbrSettings, value: number[]) => {
    onChange({ [key]: value[0] });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Surface Roughness</label>
                <span className="text-sm text-muted-foreground">{settings.roughness.toFixed(2)}</span>
              </div>
              <Slider 
                value={[settings.roughness]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={(value) => handleSliderChange('roughness', value)} 
              />
              <p className="text-xs text-muted-foreground">Controls how smooth or rough the card surface appears</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Metalness</label>
                <span className="text-sm text-muted-foreground">{settings.metalness.toFixed(2)}</span>
              </div>
              <Slider 
                value={[settings.metalness]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={(value) => handleSliderChange('metalness', value)} 
              />
              <p className="text-xs text-muted-foreground">Determines how metallic the card material appears</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Light Exposure</label>
                <span className="text-sm text-muted-foreground">{settings.exposure.toFixed(1)}</span>
              </div>
              <Slider 
                value={[settings.exposure]} 
                min={0.5} 
                max={2.5} 
                step={0.1} 
                onValueChange={(value) => handleSliderChange('exposure', value)} 
              />
              <p className="text-xs text-muted-foreground">Adjusts overall scene brightness</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Reflection Strength</label>
                <span className="text-sm text-muted-foreground">{settings.reflectionStrength.toFixed(2)}</span>
              </div>
              <Slider 
                value={[settings.reflectionStrength]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={(value) => handleSliderChange('reflectionStrength', value)} 
              />
              <p className="text-xs text-muted-foreground">Controls how much environment reflects on the card</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-4">Special Effects</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Holographic Effect</label>
                <span className="text-sm text-muted-foreground">{Math.round(settings.holographicEffect * 100)}%</span>
              </div>
              <Slider 
                value={[settings.holographicEffect]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={(value) => handleSliderChange('holographicEffect', value)} 
              />
              <p className="text-xs text-muted-foreground">Rainbow-like edge glow effect</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Chrome Effect</label>
                <span className="text-sm text-muted-foreground">{Math.round(settings.chromeEffect * 100)}%</span>
              </div>
              <Slider 
                value={[settings.chromeEffect]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={(value) => handleSliderChange('chromeEffect', value)} 
              />
              <p className="text-xs text-muted-foreground">Metallic sheen and reflectivity</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Vintage Effect</label>
                <span className="text-sm text-muted-foreground">{Math.round(settings.vintageEffect * 100)}%</span>
              </div>
              <Slider 
                value={[settings.vintageEffect]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={(value) => handleSliderChange('vintageEffect', value)} 
              />
              <p className="text-xs text-muted-foreground">Slight color aging and worn appearance</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Environment Map Intensity</label>
                <span className="text-sm text-muted-foreground">{settings.envMapIntensity.toFixed(1)}</span>
              </div>
              <Slider 
                value={[settings.envMapIntensity]} 
                min={0} 
                max={3} 
                step={0.1} 
                onValueChange={(value) => handleSliderChange('envMapIntensity', value)} 
              />
              <p className="text-xs text-muted-foreground">Strength of environment lighting reflection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PbrControls;
