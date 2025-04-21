
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ViewerSettingsProps {
  settings: {
    environmentType: string;
    autoRotate: boolean;
    primaryLight: {
      intensity: number;
      color: string;
      x: number;
      y: number;
      z: number;
    };
  };
  onUpdateSettings: (path: string, value: any) => void;
  onApplyPreset: (preset: string) => void;
  isOpen: boolean;
}

const ViewerSettings: React.FC<ViewerSettingsProps> = ({
  settings,
  onUpdateSettings,
  onApplyPreset,
  isOpen
}) => {
  if (!isOpen) return null;

  const presets = [
    { id: 'studio', name: 'Studio' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'nightclub', name: 'Night Club' },
    { id: 'outdoors', name: 'Outdoors' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Viewer Settings</h3>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white/80">Environment</h4>
        <RadioGroup 
          value={settings.environmentType}
          onValueChange={(value) => onApplyPreset(value)}
          className="flex flex-wrap gap-2"
        >
          {presets.map(preset => (
            <div key={preset.id} className="flex items-center space-x-1">
              <RadioGroupItem 
                value={preset.id} 
                id={`preset-${preset.id}`}
                className="bg-white/20" 
              />
              <Label 
                htmlFor={`preset-${preset.id}`}
                className="text-sm text-white/90 cursor-pointer"
              >
                {preset.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-white/80">Auto Rotate</Label>
          <Switch 
            checked={settings.autoRotate}
            onCheckedChange={(checked) => onUpdateSettings('autoRotate', checked)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white/80">Light Intensity</h4>
        <Slider
          value={[settings.primaryLight.intensity * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => onUpdateSettings('primaryLight.intensity', value[0] / 100)}
          className="z-50"
        />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white/80">Light Color</h4>
        <div className="flex items-center space-x-2">
          <input 
            type="color" 
            value={settings.primaryLight.color} 
            onChange={(e) => onUpdateSettings('primaryLight.color', e.target.value)}
            className="w-8 h-8 rounded overflow-hidden"
          />
          <span className="text-sm text-white/60">{settings.primaryLight.color}</span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full bg-white/10 hover:bg-white/20 mt-2 text-white"
        onClick={() => onApplyPreset('studio')}
      >
        Reset to Default
      </Button>
    </div>
  );
};

export default ViewerSettings;
