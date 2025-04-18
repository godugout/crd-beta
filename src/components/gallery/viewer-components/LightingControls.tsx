
import React from 'react';
import { Lightbulb, RotateCw, MousePointerClick } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { LightingSettings, DEFAULT_LIGHTING } from '@/hooks/useCardLighting';

interface LightingControlsProps {
  lightingSettings: LightingSettings;
  onToggleFollowPointer: () => void;
  onToggleAutoRotate: () => void;
  onUpdateLightSetting: (property: string, value: any, lightType: 'primaryLight' | 'ambientLight') => void;
  onApplyPreset: (preset: keyof typeof DEFAULT_LIGHTING) => void;
}

const LightingControls: React.FC<LightingControlsProps> = ({
  lightingSettings,
  onToggleFollowPointer,
  onToggleAutoRotate,
  onUpdateLightSetting,
  onApplyPreset
}) => {
  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white max-w-xs">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <Lightbulb size={16} className="mr-2" />
        Lighting Controls
      </h3>
      
      <div className="space-y-4">
        {/* Lighting Presets */}
        <div>
          <h4 className="text-xs font-medium mb-2">Preset Environments</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(DEFAULT_LIGHTING).map((preset) => (
              <Button 
                key={preset} 
                variant="outline" 
                size="sm"
                className={`text-xs ${
                  lightingSettings.environmentType === preset ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => onApplyPreset(preset as keyof typeof DEFAULT_LIGHTING)}
              >
                {preset.replace('_', ' ').charAt(0).toUpperCase() + preset.replace('_', ' ').slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Primary Light Controls */}
        <div>
          <h4 className="text-xs font-medium mb-2">Primary Light</h4>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Intensity</span>
                <span className="text-xs">{lightingSettings.primaryLight.intensity.toFixed(1)}</span>
              </div>
              <Slider 
                value={[lightingSettings.primaryLight.intensity]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={(value) => onUpdateLightSetting('intensity', value[0], 'primaryLight')}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 my-2">
              <Toggle
                pressed={lightingSettings.followPointer || false}
                onPressedChange={onToggleFollowPointer}
                size="sm"
                className="flex items-center gap-2"
              >
                <MousePointerClick size={14} />
                <span className="text-xs">Follow Pointer</span>
              </Toggle>
              
              <Toggle
                pressed={lightingSettings.autoRotate || false}
                onPressedChange={onToggleAutoRotate}
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCw size={14} />
                <span className="text-xs">Auto Rotate</span>
              </Toggle>
            </div>
            
            {/* Light Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs">Color</span>
              <input 
                type="color" 
                value={lightingSettings.primaryLight.color}
                onChange={(e) => onUpdateLightSetting('color', e.target.value, 'primaryLight')}
                className="w-8 h-8 rounded border-none cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Ambient Light Controls */}
        <div>
          <h4 className="text-xs font-medium mb-2">Ambient Light</h4>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Intensity</span>
                <span className="text-xs">{lightingSettings.ambientLight.intensity.toFixed(1)}</span>
              </div>
              <Slider 
                value={[lightingSettings.ambientLight.intensity]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => onUpdateLightSetting('intensity', value[0], 'ambientLight')}
              />
            </div>
            
            {/* Ambient Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs">Color</span>
              <input 
                type="color" 
                value={lightingSettings.ambientLight.color}
                onChange={(e) => onUpdateLightSetting('color', e.target.value, 'ambientLight')}
                className="w-8 h-8 rounded border-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightingControls;
