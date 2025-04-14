
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
  onRefractorSpeedChange?: (value: number[]) => void;
  onRefractorAnimationToggle?: (enabled: boolean) => void;
  onRefractorColorChange?: (colorIndex: number, color: string) => void;
  onRefractorAngleChange?: (value: number[]) => void;
  onSpectralIntensityChange?: (value: number[]) => void;
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  refractorSpeed?: number;
  refractorColors?: string[];
  refractorAngle?: number;
  refractorAnimationEnabled?: boolean;
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
  onRefractorSpeedChange = () => {},
  onRefractorAnimationToggle = () => {},
  onRefractorColorChange = () => {},
  onRefractorAngleChange = () => {},
  onSpectralIntensityChange = () => {},
  motionSpeed,
  pulseIntensity,
  shimmerSpeed,
  goldIntensity,
  chromeIntensity,
  vintageIntensity,
  refractorIntensity,
  refractorSpeed = 1.0,
  refractorColors = ['rgba(255, 0, 128, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(255, 255, 0, 0.2)'],
  refractorAngle,
  refractorAnimationEnabled = true,
  spectralIntensity = 1.0
}) => {
  // Create local state for color picker
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  
  const showRefractorControls = activeEffects.includes('Refractor');
  
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
      refractorSpeed={refractorSpeed}
      refractorColors={refractorColors}
      refractorAngle={refractorAngle}
      refractorAnimationEnabled={refractorAnimationEnabled}
      spectralIntensity={spectralIntensity}
      showRefractorControls={showRefractorControls}
      onMotionSpeedChange={onMotionSpeedChange}
      onPulseIntensityChange={onPulseIntensityChange}
      onShimmerSpeedChange={onShimmerSpeedChange}
      onGoldIntensityChange={onGoldIntensityChange}
      onChromeIntensityChange={onChromeIntensityChange}
      onVintageIntensityChange={onVintageIntensityChange}
      onRefractorIntensityChange={onRefractorIntensityChange}
      onRefractorSpeedChange={onRefractorSpeedChange}
      onRefractorAnimationToggle={onRefractorAnimationToggle}
      onRefractorColorChange={onRefractorColorChange}
      onRefractorAngleChange={onRefractorAngleChange}
      onSpectralIntensityChange={onSpectralIntensityChange}
      activeColorIndex={activeColorIndex}
      onActiveColorChange={setActiveColorIndex}
    />
  );
};

export default EffectControls;
