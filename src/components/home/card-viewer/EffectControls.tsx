
import React, { useState } from 'react';
import EffectControlPanel from './controls/EffectControlPanel';

interface EffectControlsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEffectsCombination: (name: string) => void;
  activeEffects: string[];
  onMotionSpeedChange: (value: number[]) => void;
  onPulseIntensityChange: (value: number[]) => void;
  onShimmerSpeedChange: (value: number[]) => void;
  onGoldIntensityChange: (value: number[]) => void;
  onChromeIntensityChange: (value: number[]) => void;
  onVintageIntensityChange: (value: number[]) => void;
  onRefractorIntensityChange: (value: number[]) => void;
  onSpectralIntensityChange?: (value: number[]) => void;
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  spectralIntensity?: number;
}

const EffectControls: React.FC<EffectControlsProps> = ({
  isOpen,
  onClose,
  onSaveEffectsCombination,
  activeEffects,
  onMotionSpeedChange,
  onPulseIntensityChange,
  onShimmerSpeedChange,
  onGoldIntensityChange,
  onChromeIntensityChange,
  onVintageIntensityChange,
  onRefractorIntensityChange,
  onSpectralIntensityChange = () => {},
  motionSpeed,
  pulseIntensity,
  shimmerSpeed,
  goldIntensity,
  chromeIntensity,
  vintageIntensity,
  refractorIntensity,
  spectralIntensity = 1.0
}) => {
  return (
    <EffectControlPanel
      isOpen={isOpen}
      onClose={onClose}
      onSaveEffectsCombination={onSaveEffectsCombination}
      activeEffects={activeEffects}
      motionSpeed={motionSpeed}
      pulseIntensity={pulseIntensity}
      shimmerSpeed={shimmerSpeed}
      goldIntensity={goldIntensity}
      chromeIntensity={chromeIntensity}
      vintageIntensity={vintageIntensity}
      refractorIntensity={refractorIntensity}
      spectralIntensity={spectralIntensity}
      onMotionSpeedChange={onMotionSpeedChange}
      onPulseIntensityChange={onPulseIntensityChange}
      onShimmerSpeedChange={onShimmerSpeedChange}
      onGoldIntensityChange={onGoldIntensityChange}
      onChromeIntensityChange={onChromeIntensityChange}
      onVintageIntensityChange={onVintageIntensityChange}
      onRefractorIntensityChange={onRefractorIntensityChange}
      onSpectralIntensityChange={onSpectralIntensityChange}
    />
  );
};

export default EffectControls;
