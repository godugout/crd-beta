
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { lightingPresets } from '@/utils/environmentPresets';
import { X } from 'lucide-react';

interface ViewerSettingsProps {
  settings: any;
  onUpdateSettings: (path: string, value: any) => void;
  onApplyPreset: (preset: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const ViewerSettings: React.FC<ViewerSettingsProps> = ({
  settings,
  onUpdateSettings,
  onApplyPreset,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="p-4 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Viewer Settings</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 text-white">
            <X size={16} />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="preset">Lighting Preset</Label>
          <Select 
            value={settings.environmentType || 'studio'} 
            onValueChange={value => onApplyPreset(value)}
          >
            <SelectTrigger className="bg-black/40 border-gray-700 text-white">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {lightingPresets.map(preset => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="ambient-light">Ambient Light</Label>
            <span className="text-xs opacity-70">{settings.ambientLight?.intensity.toFixed(1)}</span>
          </div>
          <Slider
            id="ambient-light"
            min={0}
            max={1}
            step={0.1}
            value={[settings.ambientLight?.intensity || 0.5]}
            onValueChange={value => onUpdateSettings('ambientLight.intensity', value[0])}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="primary-light">Primary Light</Label>
            <span className="text-xs opacity-70">{settings.primaryLight?.intensity.toFixed(1)}</span>
          </div>
          <Slider
            id="primary-light"
            min={0}
            max={2}
            step={0.1}
            value={[settings.primaryLight?.intensity || 1]}
            onValueChange={value => onUpdateSettings('primaryLight.intensity', value[0])}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-rotate" className="cursor-pointer">Auto Rotate</Label>
          <Switch
            id="auto-rotate"
            checked={settings.autoRotate}
            onCheckedChange={value => onUpdateSettings('autoRotate', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerSettings;
