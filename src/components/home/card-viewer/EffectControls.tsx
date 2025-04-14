
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
  onHolographicIntensityChange?: (value: number[]) => void;
  onHolographicPatternChange?: (pattern: string) => void;
  onHolographicColorModeChange?: (mode: string) => void;
  onHolographicCustomColorChange?: (colorIndex: number, color: string) => void;
  onHolographicSparklesToggle?: (enabled: boolean) => void;
  onHolographicBorderWidthChange?: (value: number[]) => void;
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
  holographicIntensity?: number;
  holographicPattern?: string;
  holographicColorMode?: string;
  holographicCustomColors?: string[];
  holographicSparklesEnabled?: boolean;
  holographicBorderWidth?: number;
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
  onHolographicIntensityChange = () => {},
  onHolographicPatternChange = () => {},
  onHolographicColorModeChange = () => {},
  onHolographicCustomColorChange = () => {},
  onHolographicSparklesToggle = () => {},
  onHolographicBorderWidthChange = () => {},
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
  spectralIntensity = 1.0,
  holographicIntensity = 0.8,
  holographicPattern = 'linear',
  holographicColorMode = 'rainbow',
  holographicCustomColors = ['#ff0080', '#00ffff', '#ffff00'],
  holographicSparklesEnabled = true,
  holographicBorderWidth = 1
}) => {
  // Create local state for color picker
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [activeHolographicColorIndex, setActiveHolographicColorIndex] = useState<number | null>(null);
  
  const showRefractorControls = activeEffects.includes('Refractor');
  const showHolographicControls = activeEffects.includes('Holographic');
  
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
      holographicIntensity={holographicIntensity}
      holographicPattern={holographicPattern}
      holographicColorMode={holographicColorMode}
      holographicCustomColors={holographicCustomColors}
      holographicSparklesEnabled={holographicSparklesEnabled}
      holographicBorderWidth={holographicBorderWidth}
      showRefractorControls={showRefractorControls}
      showHolographicControls={showHolographicControls}
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
      onHolographicIntensityChange={onHolographicIntensityChange}
      onHolographicPatternChange={onHolographicPatternChange}
      onHolographicColorModeChange={onHolographicColorModeChange}
      onHolographicCustomColorChange={onHolographicCustomColorChange}
      onHolographicSparklesToggle={onHolographicSparklesToggle}
      onHolographicBorderWidthChange={onHolographicBorderWidthChange}
      activeColorIndex={activeColorIndex}
      onActiveColorChange={setActiveColorIndex}
      activeHolographicColorIndex={activeHolographicColorIndex}
      onActiveHolographicColorChange={setActiveHolographicColorIndex}
    />
  );
};

export default EffectControls;
