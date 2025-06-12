
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BACKGROUND_PRESETS } from './constants';

interface HdrPresetSelectorProps {
  selectedPreset?: string;
  onPresetChange: (preset: string) => void;
}

const HdrPresetSelector: React.FC<HdrPresetSelectorProps> = ({
  selectedPreset,
  onPresetChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-gray-300 text-sm font-medium">HDR Environment</Label>
      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
        {BACKGROUND_PRESETS.map((preset) => {
          const Icon = preset.icon;
          return (
            <Button
              key={preset.id}
              variant={selectedPreset === preset.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPresetChange(preset.id)}
              className={selectedPreset === preset.id
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
  );
};

export default HdrPresetSelector;
