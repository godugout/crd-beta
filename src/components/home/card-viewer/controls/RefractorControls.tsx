
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RefractorControlsProps {
  intensity: number;
  speed: number;
  colors: string[];
  angle: number;
  animationEnabled: boolean;
  onIntensityChange: (value: number[]) => void;
  onSpeedChange: (value: number[]) => void;
  onAnimationToggle: (enabled: boolean) => void;
  onColorChange: (colorIndex: number, color: string) => void;
  onAngleChange: (value: number[]) => void;
  activeColorIndex: number | null;
  onActiveColorChange: (index: number | null) => void;
}

const RefractorControls: React.FC<RefractorControlsProps> = ({
  intensity,
  speed,
  colors,
  angle,
  animationEnabled,
  onIntensityChange,
  onSpeedChange,
  onAnimationToggle,
  onColorChange,
  onAngleChange,
  activeColorIndex,
  onActiveColorChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Refractor Intensity</Label>
        <span className="text-xs text-muted-foreground">{intensity.toFixed(1)}</span>
      </div>
      <Slider
        value={[intensity]}
        min={0.1}
        max={1.0}
        step={0.05}
        onValueChange={onIntensityChange}
      />
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Animation Speed</Label>
        <span className="text-xs text-muted-foreground">{speed.toFixed(1)}</span>
      </div>
      <Slider
        value={[speed]}
        min={0.1}
        max={2.0}
        step={0.1}
        onValueChange={onSpeedChange}
      />
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Refraction Angle</Label>
        <span className="text-xs text-muted-foreground">{angle}°</span>
      </div>
      <Slider
        value={[angle]}
        min={0}
        max={360}
        step={15}
        onValueChange={onAngleChange}
      />
      
      <div className="space-y-3">
        <Label className="text-sm font-medium">Refractor Colors</Label>
        <div className="flex gap-2">
          {colors.map((color, index) => (
            <div key={index} className="relative">
              <div 
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${activeColorIndex === index ? 'border-primary' : 'border-border'}`}
                style={{ backgroundColor: color }}
                onClick={() => onActiveColorChange(activeColorIndex === index ? null : index)}
              />
              {activeColorIndex === index && (
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(index, e.target.value)}
                  className="absolute top-10 left-0 z-10"
                  autoFocus
                  onBlur={() => onActiveColorChange(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="animation-toggle"
          checked={animationEnabled}
          onCheckedChange={onAnimationToggle}
        />
        <Label htmlFor="animation-toggle" className="text-sm font-medium">Enable Animation</Label>
      </div>
    </div>
  );
};

export default RefractorControls;
