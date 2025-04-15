
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PbrSettings } from './types';

interface PbrControlsProps {
  settings: PbrSettings;
  onChange: (settings: Partial<PbrSettings>) => void;
}

const PbrControls: React.FC<PbrControlsProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Material Properties</h3>
        
        <div className="space-y-2">
          <Label>Roughness</Label>
          <Slider
            value={[settings.roughness]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => onChange({ roughness: value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Metalness</Label>
          <Slider
            value={[settings.metalness]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => onChange({ metalness: value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Lighting & Environment</h3>
        
        <div className="space-y-2">
          <Label>Exposure</Label>
          <Slider
            value={[settings.exposure]}
            min={0}
            max={2}
            step={0.1}
            onValueChange={([value]) => onChange({ exposure: value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Environment Intensity</Label>
          <Slider
            value={[settings.envMapIntensity]}
            min={0}
            max={3}
            step={0.1}
            onValueChange={([value]) => onChange({ envMapIntensity: value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Reflection Strength</Label>
          <Slider
            value={[settings.reflectionStrength]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onChange({ reflectionStrength: value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Special Effects</h3>
        
        <div className="space-y-2">
          <Label>Holographic Effect</Label>
          <Slider
            value={[settings.holographicEffect]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onChange({ holographicEffect: value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Chrome Effect</Label>
          <Slider
            value={[settings.chromeEffect]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onChange({ chromeEffect: value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Vintage Effect</Label>
          <Slider
            value={[settings.vintageEffect]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onChange({ vintageEffect: value })}
          />
        </div>
      </div>
    </div>
  );
};

export default PbrControls;
