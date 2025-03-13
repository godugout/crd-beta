
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Timer, 
  Zap, 
  Sparkles,
  Sun,
  X
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";

interface EffectControlsProps {
  isOpen: boolean;
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  onClose: () => void;
  onMotionSpeedChange: (value: number[]) => void;
  onPulseIntensityChange: (value: number[]) => void;
  onShimmerSpeedChange: (value: number[]) => void;
}

const EffectControls = ({
  isOpen,
  motionSpeed,
  pulseIntensity,
  shimmerSpeed,
  onClose,
  onMotionSpeedChange,
  onPulseIntensityChange,
  onShimmerSpeedChange
}: EffectControlsProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 right-4 w-64 bg-white rounded-lg shadow-lg p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Advanced Controls</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Motion Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="motion-speed" className="text-xs flex items-center gap-1">
              <Timer className="h-3 w-3" /> Motion Speed
            </Label>
            <span className="text-xs text-gray-500">{motionSpeed.toFixed(1)}</span>
          </div>
          <Slider 
            id="motion-speed"
            min={0.1} 
            max={2.0} 
            step={0.1} 
            value={[motionSpeed]} 
            onValueChange={onMotionSpeedChange} 
          />
        </div>

        {/* Pulse Intensity Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pulse-intensity" className="text-xs flex items-center gap-1">
              <Zap className="h-3 w-3" /> Pulse Intensity
            </Label>
            <span className="text-xs text-gray-500">{pulseIntensity.toFixed(1)}</span>
          </div>
          <Slider 
            id="pulse-intensity"
            min={0.1} 
            max={2.0} 
            step={0.1} 
            value={[pulseIntensity]} 
            onValueChange={onPulseIntensityChange} 
          />
        </div>

        {/* Shimmer Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shimmer-speed" className="text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Shimmer Speed
            </Label>
            <span className="text-xs text-gray-500">{shimmerSpeed.toFixed(1)}</span>
          </div>
          <Slider 
            id="shimmer-speed"
            min={0.5} 
            max={5.0} 
            step={0.5} 
            value={[shimmerSpeed]} 
            onValueChange={onShimmerSpeedChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default EffectControls;
