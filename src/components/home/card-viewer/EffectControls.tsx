
import React from 'react';
import EffectControlPanel from './controls/EffectControlPanel';

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

const EffectControls = (props: EffectControlsProps) => {
  return <EffectControlPanel {...props} />;
};

export default EffectControls;
