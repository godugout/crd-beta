
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
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Material Properties</h3>
        <p className="text-sm text-gray-400 mb-4">Fine-tune the card's surface appearance</p>
      </div>

      <div className="space-y-4">
        {/* Roughness */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-white text-sm">Roughness</Label>
            <span className="text-xs text-gray-400">{materialSettings.roughness.toFixed(2)}</span>
          </div>
          <Slider
            value={[materialSettings.roughness]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => onUpdateMaterial({ roughness: value })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Smooth</span>
            <span>Rough</span>
          </div>
        </div>

        {/* Metalness */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-white text-sm">Metalness</Label>
            <span className="text-xs text-gray-400">{materialSettings.metalness.toFixed(2)}</span>
          </div>
          <Slider
            value={[materialSettings.metalness]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => onUpdateMaterial({ metalness: value })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Dielectric</span>
            <span>Metallic</span>
          </div>
        </div>

        {/* Clearcoat */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-white text-sm">Clearcoat</Label>
            <span className="text-xs text-gray-400">{materialSettings.clearcoat.toFixed(2)}</span>
          </div>
          <Slider
            value={[materialSettings.clearcoat]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => onUpdateMaterial({ clearcoat: value })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Matte</span>
            <span>Glossy</span>
          </div>
        </div>

        {/* Reflectivity */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-white text-sm">Reflectivity</Label>
            <span className="text-xs text-gray-400">{materialSettings.reflectivity.toFixed(2)}</span>
          </div>
          <Slider
            value={[materialSettings.reflectivity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => onUpdateMaterial({ reflectivity: value })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Dull</span>
            <span>Mirror</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPropertiesSection;
