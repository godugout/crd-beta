
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BackgroundSettings } from '../BackgroundSelector';

interface EnvironmentControlsProps {
  settings: BackgroundSettings;
  onSettingsChange: (updates: Partial<BackgroundSettings>) => void;
}

const EnvironmentControls: React.FC<EnvironmentControlsProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300 text-sm">
          Lighting Intensity: {Math.round(settings.intensity * 100)}%
        </Label>
        <Slider
          value={[settings.intensity]}
          onValueChange={(value) => onSettingsChange({ intensity: value[0] })}
          min={0.1}
          max={2.0}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-sm">
          Background Blur: {Math.round(settings.blur * 100)}%
        </Label>
        <Slider
          value={[settings.blur]}
          onValueChange={(value) => onSettingsChange({ blur: value[0] })}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-sm">
          Environment Rotation: {Math.round(settings.rotation)}°
        </Label>
        <Slider
          value={[settings.rotation]}
          onValueChange={(value) => onSettingsChange({ rotation: value[0] })}
          min={0}
          max={360}
          step={15}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default EnvironmentControls;
