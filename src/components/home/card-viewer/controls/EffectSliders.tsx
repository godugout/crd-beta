
import React from 'react';
import { Timer, Zap, Sparkles, Sun, Prism } from 'lucide-react';
import EffectSlider from './EffectSlider';

interface EffectSlidersProps {
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  onMotionSpeedChange: (value: number[]) => void;
  onPulseIntensityChange: (value: number[]) => void;
  onShimmerSpeedChange: (value: number[]) => void;
  onGoldIntensityChange: (value: number[]) => void;
  onChromeIntensityChange: (value: number[]) => void;
  onVintageIntensityChange: (value: number[]) => void;
  onRefractorIntensityChange: (value: number[]) => void;
  activeEffects: string[];
}

const EffectSliders = ({
  motionSpeed,
  pulseIntensity,
  shimmerSpeed,
  goldIntensity,
  chromeIntensity,
  vintageIntensity,
  refractorIntensity,
  onMotionSpeedChange,
  onPulseIntensityChange,
  onShimmerSpeedChange,
  onGoldIntensityChange,
  onChromeIntensityChange,
  onVintageIntensityChange,
  onRefractorIntensityChange,
  activeEffects
}: EffectSlidersProps) => {
  return (
    <>
      {/* Motion Speed Control - Applies to all effects */}
      <EffectSlider
        id="motion-speed"
        label="Motion Speed"
        icon={<Timer className="h-3 w-3" />}
        value={motionSpeed}
        min={0.1}
        max={2.0}
        step={0.1}
        onValueChange={onMotionSpeedChange}
      />

      {/* Conditional controls based on active effects */}
      {activeEffects.includes('Electric') && (
        <EffectSlider
          id="pulse-intensity"
          label="Pulse Intensity"
          icon={<Zap className="h-3 w-3" />}
          value={pulseIntensity}
          min={0.1}
          max={2.0}
          step={0.1}
          onValueChange={onPulseIntensityChange}
        />
      )}

      {activeEffects.includes('Classic Holographic') && (
        <EffectSlider
          id="shimmer-speed"
          label="Shimmer Speed"
          icon={<Sparkles className="h-3 w-3" />}
          value={shimmerSpeed}
          min={0.5}
          max={5.0}
          step={0.5}
          onValueChange={onShimmerSpeedChange}
        />
      )}

      {/* New Refractor effect slider */}
      {activeEffects.includes('Refractor') && (
        <EffectSlider
          id="refractor-intensity"
          label="Refraction Intensity"
          icon={<Prism className="h-3 w-3" />}
          value={refractorIntensity}
          min={0.1}
          max={2.0}
          step={0.1}
          onValueChange={onRefractorIntensityChange}
        />
      )}

      {/* Effect-specific controls */}
      {activeEffects.includes('Gold Foil') && (
        <EffectSlider
          id="gold-intensity"
          label="Gold Intensity"
          icon={<Sun className="h-3 w-3" />}
          value={goldIntensity}
          min={0.1}
          max={2.0}
          step={0.1}
          onValueChange={onGoldIntensityChange}
        />
      )}

      {activeEffects.includes('Chrome') && (
        <EffectSlider
          id="chrome-intensity"
          label="Chrome Intensity"
          icon={<Sun className="h-3 w-3" />}
          value={chromeIntensity}
          min={0.1}
          max={2.0}
          step={0.1}
          onValueChange={onChromeIntensityChange}
        />
      )}

      {activeEffects.includes('Vintage') && (
        <EffectSlider
          id="vintage-intensity"
          label="Vintage Intensity"
          icon={<Sun className="h-3 w-3" />}
          value={vintageIntensity}
          min={0.1}
          max={2.0}
          step={0.1}
          onValueChange={onVintageIntensityChange}
        />
      )}
    </>
  );
};

export default EffectSliders;
