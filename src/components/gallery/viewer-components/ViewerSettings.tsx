
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { lightingPresets } from '@/utils/environmentPresets';

interface ViewerSettingsProps {
  settings: any;
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
  
  return (
    <div className="space-y-6">
      <h3 className="font-medium text-white">Scene Settings</h3>
      
      <div className="space-y-4">
        <div>
          <Label className="text-white mb-1 block">Scene Preset</Label>
          <Select 
            onValueChange={onApplyPreset} 
            defaultValue={settings.environmentType || "studio"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scene" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="natural">Natural</SelectItem>
              <SelectItem value="dramatic">Dramatic</SelectItem>
              <SelectItem value="display_case">Display Case</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white mb-1 block">Primary Light Intensity</Label>
          <Slider 
            value={[settings.primaryLight.intensity * 100]} 
            onValueChange={(value) => onUpdateSettings('primaryLight.intensity', value[0] / 100)}
            min={0} 
            max={200} 
            step={1}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>{Math.round(settings.primaryLight.intensity * 100)}%</span>
            <span>200%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white mb-1 block">Ambient Light Intensity</Label>
          <Slider 
            value={[settings.ambientLight.intensity * 100]} 
            onValueChange={(value) => onUpdateSettings('ambientLight.intensity', value[0] / 100)}
            min={0} 
            max={100} 
            step={1}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>{Math.round(settings.ambientLight.intensity * 100)}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-white">Auto-rotate</Label>
          <Switch 
            checked={settings.autoRotate}
            onCheckedChange={(checked) => onUpdateSettings('autoRotate', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerSettings;
