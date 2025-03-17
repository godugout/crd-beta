
import { useState, useCallback } from 'react';

interface EffectSettings {
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  spectralIntensity: number;
}

interface UseEffectSettingsReturn extends EffectSettings {
  getCurrentSettings: () => EffectSettings;
  applySettings: (settings: EffectSettings) => void;
  handleMotionSpeedChange: (value: number[]) => void;
  handlePulseIntensityChange: (value: number[]) => void;
  handleShimmerSpeedChange: (value: number[]) => void;
  handleGoldIntensityChange: (value: number[]) => void;
  handleChromeIntensityChange: (value: number[]) => void;
  handleVintageIntensityChange: (value: number[]) => void;
  handleRefractorIntensityChange: (value: number[]) => void;
  handleSpectralIntensityChange: (value: number[]) => void;
}

export const useEffectSettings = (
  onSettingsChange: (settings: EffectSettings) => void
): UseEffectSettingsReturn => {
  const [motionSpeed, setMotionSpeed] = useState(0.7);
  const [pulseIntensity, setPulseIntensity] = useState(0.8);
  const [shimmerSpeed, setShimmerSpeed] = useState(5.0);
  const [goldIntensity, setGoldIntensity] = useState(0.8);
  const [chromeIntensity, setChromeIntensity] = useState(0.8);
  const [vintageIntensity, setVintageIntensity] = useState(0.8);
  const [refractorIntensity, setRefractorIntensity] = useState(1.0);
  const [spectralIntensity, setSpectralIntensity] = useState(0.7);

  // Get current settings
  const getCurrentSettings = useCallback(() => {
    return {
      motionSpeed,
      pulseIntensity,
      shimmerSpeed,
      goldIntensity,
      chromeIntensity,
      vintageIntensity,
      refractorIntensity,
      spectralIntensity
    };
  }, [
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity,
    spectralIntensity
  ]);

  // Apply settings from a preset
  const applySettings = useCallback((settings: EffectSettings) => {
    const {
      motionSpeed: newMotionSpeed,
      pulseIntensity: newPulseIntensity,
      shimmerSpeed: newShimmerSpeed,
      goldIntensity: newGoldIntensity,
      chromeIntensity: newChromeIntensity,
      vintageIntensity: newVintageIntensity,
      refractorIntensity: newRefractorIntensity,
      spectralIntensity: newSpectralIntensity
    } = settings;

    setMotionSpeed(newMotionSpeed ?? 0.7);
    setPulseIntensity(newPulseIntensity ?? 0.8);
    setShimmerSpeed(newShimmerSpeed ?? 5.0);
    setGoldIntensity(newGoldIntensity ?? 0.8);
    setChromeIntensity(newChromeIntensity ?? 0.8);
    setVintageIntensity(newVintageIntensity ?? 0.8);
    setRefractorIntensity(newRefractorIntensity ?? 1.0);
    setSpectralIntensity(newSpectralIntensity ?? 0.7);

    onSettingsChange(settings);
  }, [onSettingsChange]);

  // Handle individual setting changes
  const handleMotionSpeedChange = useCallback((value: number[]) => {
    setMotionSpeed(value[0]);
    const newSettings = { ...getCurrentSettings(), motionSpeed: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  const handlePulseIntensityChange = useCallback((value: number[]) => {
    setPulseIntensity(value[0]);
    const newSettings = { ...getCurrentSettings(), pulseIntensity: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  const handleShimmerSpeedChange = useCallback((value: number[]) => {
    setShimmerSpeed(value[0]);
    const newSettings = { ...getCurrentSettings(), shimmerSpeed: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  const handleGoldIntensityChange = useCallback((value: number[]) => {
    setGoldIntensity(value[0]);
    const newSettings = { ...getCurrentSettings(), goldIntensity: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  const handleChromeIntensityChange = useCallback((value: number[]) => {
    setChromeIntensity(value[0]);
    const newSettings = { ...getCurrentSettings(), chromeIntensity: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  const handleVintageIntensityChange = useCallback((value: number[]) => {
    setVintageIntensity(value[0]);
    const newSettings = { ...getCurrentSettings(), vintageIntensity: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  const handleRefractorIntensityChange = useCallback((value: number[]) => {
    setRefractorIntensity(value[0]);
    const newSettings = { ...getCurrentSettings(), refractorIntensity: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  const handleSpectralIntensityChange = useCallback((value: number[]) => {
    setSpectralIntensity(value[0]);
    const newSettings = { ...getCurrentSettings(), spectralIntensity: value[0] };
    onSettingsChange(newSettings);
  }, [getCurrentSettings, onSettingsChange]);

  return {
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity,
    spectralIntensity,
    getCurrentSettings,
    applySettings,
    handleMotionSpeedChange,
    handlePulseIntensityChange,
    handleShimmerSpeedChange,
    handleGoldIntensityChange,
    handleChromeIntensityChange,
    handleVintageIntensityChange,
    handleRefractorIntensityChange,
    handleSpectralIntensityChange
  };
};
