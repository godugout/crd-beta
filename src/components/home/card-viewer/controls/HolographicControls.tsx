
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HolographicControlsProps {
  intensity: number;
  pattern: string;
  colorMode: string;
  customColors: string[];
  sparklesEnabled: boolean;
  borderWidth: number;
  onIntensityChange: (value: number[]) => void;
  onPatternChange: (value: string) => void;
  onColorModeChange: (value: string) => void;
  onCustomColorChange: (colorIndex: number, color: string) => void;
  onSparklesToggle: (enabled: boolean) => void;
  onBorderWidthChange: (value: number[]) => void;
  activeColorIndex: number | null;
  onActiveColorChange: (index: number | null) => void;
}

const HolographicControls: React.FC<HolographicControlsProps> = ({
  intensity,
  pattern,
  colorMode,
  customColors,
  sparklesEnabled,
  borderWidth,
  onIntensityChange,
  onPatternChange,
  onColorModeChange,
  onCustomColorChange,
  onSparklesToggle,
  onBorderWidthChange,
  activeColorIndex,
  onActiveColorChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Holographic Intensity</Label>
        <span className="text-xs text-muted-foreground">{intensity.toFixed(1)}</span>
      </div>
      <Slider
        value={[intensity]}
        min={0.1}
        max={1.0}
        step={0.05}
        onValueChange={onIntensityChange}
      />
      
      <div className="space-y-3">
        <Label className="text-sm font-medium">Holographic Pattern</Label>
        <Select value={pattern} onValueChange={onPatternChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="circular">Circular</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="geometric">Geometric</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <Label className="text-sm font-medium">Color Mode</Label>
        <Select value={colorMode} onValueChange={onColorModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select color mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rainbow">Rainbow</SelectItem>
            <SelectItem value="blue-purple">Blue-Purple</SelectItem>
            <SelectItem value="gold-green">Gold-Green</SelectItem>
            <SelectItem value="custom">Custom Colors</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {colorMode === 'custom' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Custom Colors</Label>
          <div className="flex gap-2">
            {customColors.map((color, index) => (
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
                    onChange={(e) => onCustomColorChange(index, e.target.value)}
                    className="absolute top-10 left-0 z-10"
                    autoFocus
                    onBlur={() => onActiveColorChange(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Border Width</Label>
        <span className="text-xs text-muted-foreground">{borderWidth}px</span>
      </div>
      <Slider
        value={[borderWidth]}
        min={0}
        max={3}
        step={0.5}
        onValueChange={onBorderWidthChange}
      />
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="sparkles-toggle"
          checked={sparklesEnabled}
          onCheckedChange={onSparklesToggle}
        />
        <Label htmlFor="sparkles-toggle" className="text-sm font-medium">Enable Sparkles</Label>
      </div>
    </div>
  );
};

export default HolographicControls;
