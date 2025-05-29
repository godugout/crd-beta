
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  envMapIntensity: number;
}

interface MaterialPropertiesSectionProps {
  materialSettings: MaterialSettings;
  onUpdateMaterial: (settings: Partial<MaterialSettings>) => void;
}

const MaterialPropertiesSection: React.FC<MaterialPropertiesSectionProps> = ({
  materialSettings,
  onUpdateMaterial
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Material Properties</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-white">Metalness</Label>
            <span className="text-sm text-gray-400">{materialSettings.metalness.toFixed(1)}</span>
          </div>
          <Slider
            value={[materialSettings.metalness]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onUpdateMaterial({ metalness: value })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-white">Roughness</Label>
            <span className="text-sm text-gray-400">{materialSettings.roughness.toFixed(1)}</span>
          </div>
          <Slider
            value={[materialSettings.roughness]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onUpdateMaterial({ roughness: value })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialPropertiesSection;
