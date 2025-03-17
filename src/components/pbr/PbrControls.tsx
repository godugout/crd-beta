
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PbrSettings } from './types';

interface PbrControlsProps {
  settings: PbrSettings;
  onChange: (settings: Partial<PbrSettings>) => void;
}

const PbrControls: React.FC<PbrControlsProps> = ({ settings, onChange }) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Material Properties</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="roughness">Roughness</Label>
              <span className="text-sm text-gray-500">{settings.roughness.toFixed(2)}</span>
            </div>
            <Slider
              id="roughness"
              min={0}
              max={1}
              step={0.01}
              value={[settings.roughness]}
              onValueChange={([value]) => onChange({ roughness: value })}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="metalness">Metalness</Label>
              <span className="text-sm text-gray-500">{settings.metalness.toFixed(2)}</span>
            </div>
            <Slider
              id="metalness"
              min={0}
              max={1}
              step={0.01}
              value={[settings.metalness]}
              onValueChange={([value]) => onChange({ metalness: value })}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Lighting</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="exposure">Exposure</Label>
              <span className="text-sm text-gray-500">{settings.exposure.toFixed(2)}</span>
            </div>
            <Slider
              id="exposure"
              min={0.1}
              max={3}
              step={0.05}
              value={[settings.exposure]}
              onValueChange={([value]) => onChange({ exposure: value })}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="envMapIntensity">Environment Map Intensity</Label>
              <span className="text-sm text-gray-500">{settings.envMapIntensity.toFixed(2)}</span>
            </div>
            <Slider
              id="envMapIntensity"
              min={0}
              max={3}
              step={0.05}
              value={[settings.envMapIntensity]}
              onValueChange={([value]) => onChange({ envMapIntensity: value })}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Reflections</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="reflectionStrength">Reflection Strength</Label>
              <span className="text-sm text-gray-500">{settings.reflectionStrength.toFixed(2)}</span>
            </div>
            <Slider
              id="reflectionStrength"
              min={0}
              max={1}
              step={0.01}
              value={[settings.reflectionStrength]}
              onValueChange={([value]) => onChange({ reflectionStrength: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PbrControls;
