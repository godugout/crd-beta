
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LucideIcon } from 'lucide-react';

interface EffectSliderProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
}

const EffectSlider = ({
  id,
  label,
  icon,
  value,
  min,
  max,
  step,
  onValueChange
}: EffectSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs flex items-center gap-1">
          {icon} {label}
        </Label>
        <span className="text-xs text-gray-500">{value.toFixed(1)}</span>
      </div>
      <Slider 
        id={id}
        min={min} 
        max={max} 
        step={step} 
        value={[value]} 
        onValueChange={onValueChange} 
      />
    </div>
  );
};

export default EffectSlider;
