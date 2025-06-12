
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  Mountain, 
  Sunset, 
  Building, 
  Warehouse,
  Trees,
  Waves
} from 'lucide-react';

export interface BackgroundSettings {
  type: 'preset' | 'gradient' | 'solid';
  preset?: string;
  gradient?: {
    from: string;
    to: string;
    direction: string;
  };
  solid?: string;
  intensity: number;
  blur: number;
  rotation: number;
}

interface BackgroundSelectorProps {
  settings: BackgroundSettings;
  onSettingsChange: (settings: BackgroundSettings) => void;
}

const BACKGROUND_PRESETS = [
  { id: 'studio', name: 'Studio', icon: Building, description: 'Clean studio lighting' },
  { id: 'sunset', name: 'Sunset', icon: Sunset, description: 'Warm golden hour' },
  { id: 'warehouse', name: 'Warehouse', icon: Warehouse, description: 'Industrial space' },
  { id: 'forest', name: 'Forest', icon: Trees, description: 'Natural outdoor' },
  { id: 'city', name: 'City', icon: Building, description: 'Urban environment' },
  { id: 'ocean', name: 'Ocean', icon: Waves, description: 'Coastal scene' },
  { id: 'mountains', name: 'Mountains', icon: Mountain, description: 'Mountain vista' },
  { id: 'park', name: 'Park', icon: Trees, description: 'Baseball park' }
];

const GRADIENT_PRESETS = [
  { name: 'Oakland Green', from: '#003831', to: '#EFB21E' },
  { name: 'Sunset', from: '#ff7e5f', to: '#feb47b' },
  { name: 'Ocean', from: '#00c6ff', to: '#0072ff' },
  { name: 'Forest', from: '#134e5e', to: '#71b280' },
  { name: 'Purple Sky', from: '#667eea', to: '#764ba2' },
  { name: 'Desert', from: '#f093fb', to: '#f5576c' }
];

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  settings,
  onSettingsChange
}) => {
  const updateSettings = (updates: Partial<BackgroundSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Background Type Selector */}
      <div className="space-y-3">
        <Label className="text-gray-300 text-sm font-medium">Background Type</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={settings.type === 'preset' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateSettings({ type: 'preset' })}
            className={settings.type === 'preset' 
              ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
            }
          >
            <Mountain className="h-3 w-3 mr-1" />
            HDR
          </Button>
          <Button
            variant={settings.type === 'gradient' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateSettings({ type: 'gradient' })}
            className={settings.type === 'gradient' 
              ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
            }
          >
            <Palette className="h-3 w-3 mr-1" />
            Gradient
          </Button>
          <Button
            variant={settings.type === 'solid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateSettings({ type: 'solid' })}
            className={settings.type === 'solid' 
              ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
            }
          >
            Solid
          </Button>
        </div>
      </div>

      {/* HDR Preset Selector */}
      {settings.type === 'preset' && (
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-medium">HDR Environment</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {BACKGROUND_PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <Button
                  key={preset.id}
                  variant={settings.preset === preset.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ preset: preset.id })}
                  className={settings.preset === preset.id
                    ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                  }
                  title={preset.description}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {preset.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gradient Selector */}
      {settings.type === 'gradient' && (
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-medium">Gradient Style</Label>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {GRADIENT_PRESETS.map((gradient) => (
              <Button
                key={gradient.name}
                variant="outline"
                size="sm"
                onClick={() => updateSettings({ 
                  gradient: { 
                    from: gradient.from, 
                    to: gradient.to, 
                    direction: 'diagonal' 
                  } 
                })}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start text-xs"
              >
                <div 
                  className="w-4 h-4 rounded mr-2"
                  style={{ 
                    background: `linear-gradient(45deg, ${gradient.from}, ${gradient.to})` 
                  }}
                />
                {gradient.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Solid Color Selector */}
      {settings.type === 'solid' && (
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-medium">Solid Color</Label>
          <div className="grid grid-cols-6 gap-2">
            {['#000000', '#333333', '#666666', '#ffffff', '#003831', '#EFB21E'].map((color) => (
              <button
                key={color}
                onClick={() => updateSettings({ solid: color })}
                className={`w-8 h-8 rounded border-2 ${
                  settings.solid === color ? 'border-[#EFB21E]' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Environment Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Lighting Intensity: {Math.round(settings.intensity * 100)}%</Label>
          <Slider
            value={[settings.intensity]}
            onValueChange={(value) => updateSettings({ intensity: value[0] })}
            min={0.1}
            max={2.0}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Background Blur: {Math.round(settings.blur * 100)}%</Label>
          <Slider
            value={[settings.blur]}
            onValueChange={(value) => updateSettings({ blur: value[0] })}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Environment Rotation: {Math.round(settings.rotation)}°</Label>
          <Slider
            value={[settings.rotation]}
            onValueChange={(value) => updateSettings({ rotation: value[0] })}
            min={0}
            max={360}
            step={15}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
