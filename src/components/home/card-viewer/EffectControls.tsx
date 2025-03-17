
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Timer, 
  Zap, 
  Sparkles,
  Sun,
  BookmarkPlus,
  X
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EffectControlsProps {
  isOpen: boolean;
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  onClose: () => void;
  onMotionSpeedChange: (value: number[]) => void;
  onPulseIntensityChange: (value: number[]) => void;
  onShimmerSpeedChange: (value: number[]) => void;
  onGoldIntensityChange: (value: number[]) => void;
  onChromeIntensityChange: (value: number[]) => void;
  onVintageIntensityChange: (value: number[]) => void;
  onSaveEffectsCombination: (name: string) => void;
  activeEffects: string[];
}

const EffectControls = ({
  isOpen,
  motionSpeed,
  pulseIntensity,
  shimmerSpeed,
  goldIntensity,
  chromeIntensity,
  vintageIntensity,
  onClose,
  onMotionSpeedChange,
  onPulseIntensityChange,
  onShimmerSpeedChange,
  onGoldIntensityChange,
  onChromeIntensityChange,
  onVintageIntensityChange,
  onSaveEffectsCombination,
  activeEffects
}: EffectControlsProps) => {
  const [combinationName, setCombinationName] = React.useState("");

  if (!isOpen) return null;
  
  const handleSaveCombination = () => {
    if (combinationName.trim()) {
      onSaveEffectsCombination(combinationName.trim());
      setCombinationName("");
    }
  };

  return (
    <div className="absolute bottom-16 right-4 w-72 bg-white rounded-lg shadow-lg p-4 animate-fade-in max-h-[80vh] overflow-y-auto">
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
        {/* Motion Speed Control - Applies to all effects */}
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

        {/* Conditional controls based on active effects */}
        {activeEffects.includes('Electric') && (
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
        )}

        {activeEffects.includes('Classic Holographic') && (
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
        )}

        {/* New effect controls */}
        {activeEffects.includes('Gold Foil') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gold-intensity" className="text-xs flex items-center gap-1">
                <Sun className="h-3 w-3" /> Gold Intensity
              </Label>
              <span className="text-xs text-gray-500">{goldIntensity.toFixed(1)}</span>
            </div>
            <Slider 
              id="gold-intensity"
              min={0.1} 
              max={2.0} 
              step={0.1} 
              value={[goldIntensity]} 
              onValueChange={onGoldIntensityChange} 
            />
          </div>
        )}

        {activeEffects.includes('Chrome') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="chrome-intensity" className="text-xs flex items-center gap-1">
                <Sun className="h-3 w-3" /> Chrome Intensity
              </Label>
              <span className="text-xs text-gray-500">{chromeIntensity.toFixed(1)}</span>
            </div>
            <Slider 
              id="chrome-intensity"
              min={0.1} 
              max={2.0} 
              step={0.1} 
              value={[chromeIntensity]} 
              onValueChange={onChromeIntensityChange} 
            />
          </div>
        )}

        {activeEffects.includes('Vintage') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="vintage-intensity" className="text-xs flex items-center gap-1">
                <Sun className="h-3 w-3" /> Vintage Intensity
              </Label>
              <span className="text-xs text-gray-500">{vintageIntensity.toFixed(1)}</span>
            </div>
            <Slider 
              id="vintage-intensity"
              min={0.1} 
              max={2.0} 
              step={0.1} 
              value={[vintageIntensity]} 
              onValueChange={onVintageIntensityChange} 
            />
          </div>
        )}

        {/* Save Combination Section */}
        {activeEffects.length > 0 && (
          <div className="pt-2 mt-2 border-t border-gray-100">
            <Label htmlFor="combination-name" className="text-xs mb-2 flex items-center gap-1">
              <BookmarkPlus className="h-3 w-3" /> Save Current Combination
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="combination-name"
                type="text"
                value={combinationName}
                onChange={(e) => setCombinationName(e.target.value)}
                placeholder="Combination name"
                className="h-8 text-xs"
              />
              <Button 
                onClick={handleSaveCombination}
                disabled={!combinationName.trim()}
                size="sm"
                className="h-8 text-xs px-2 py-1"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EffectControls;
