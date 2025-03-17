
import { useState, useEffect } from 'react';

interface EffectSettings {
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
}

interface UseEffectSettingsReturn extends EffectSettings {
  handleMotionSpeedChange: (value: number[]) => void;
  handlePulseIntensityChange: (value: number[]) => void;
  handleShimmerSpeedChange: (value: number[]) => void;
  handleGoldIntensityChange: (value: number[]) => void;
  handleChromeIntensityChange: (value: number[]) => void;
  handleVintageIntensityChange: (value: number[]) => void;
  handleRefractorIntensityChange: (value: number[]) => void;
  getCurrentSettings: () => EffectSettings;
  applySettings: (settings: EffectSettings) => void;
}

export const useEffectSettings = (
  onSettingsChange: (settings: EffectSettings) => void
): UseEffectSettingsReturn => {
  const [motionSpeed, setMotionSpeed] = useState(1.0);
  const [pulseIntensity, setPulseIntensity] = useState(1.0);
  const [shimmerSpeed, setShimmerSpeed] = useState(3.0);
  const [goldIntensity, setGoldIntensity] = useState(1.0);
  const [chromeIntensity, setChromeIntensity] = useState(1.0);
  const [vintageIntensity, setVintageIntensity] = useState(1.0);
  const [refractorIntensity, setRefractorIntensity] = useState(1.0);

  useEffect(() => {
    // Update animation speeds when controls change
    onSettingsChange({
      motionSpeed,
      pulseIntensity,
      shimmerSpeed,
      goldIntensity,
      chromeIntensity,
      vintageIntensity,
      refractorIntensity
    });
  }, [
    motionSpeed, 
    pulseIntensity, 
    shimmerSpeed, 
    goldIntensity, 
    chromeIntensity, 
    vintageIntensity,
    refractorIntensity,
    onSettingsChange
  ]);

  const handleMotionSpeedChange = (value: number[]) => {
    setMotionSpeed(value[0]);
  };

  const handlePulseIntensityChange = (value: number[]) => {
    setPulseIntensity(value[0]);
  };

  const handleShimmerSpeedChange = (value: number[]) => {
    setShimmerSpeed(value[0]);
  };

  const handleGoldIntensityChange = (value: number[]) => {
    setGoldIntensity(value[0]);
  };

  const handleChromeIntensityChange = (value: number[]) => {
    setChromeIntensity(value[0]);
  };

  const handleVintageIntensityChange = (value: number[]) => {
    setVintageIntensity(value[0]);
  };

  const handleRefractorIntensityChange = (value: number[]) => {
    setRefractorIntensity(value[0]);
    
    // Update CSS variable for refractor intensity
    document.documentElement.style.setProperty('--refractor-intensity', value[0].toString());
  };

  const getCurrentSettings = (): EffectSettings => ({
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity
  });

  const applySettings = (settings: EffectSettings) => {
    setMotionSpeed(settings.motionSpeed);
    setPulseIntensity(settings.pulseIntensity);
    setShimmerSpeed(settings.shimmerSpeed);
    setGoldIntensity(settings.goldIntensity);
    setChromeIntensity(settings.chromeIntensity);
    setVintageIntensity(settings.vintageIntensity);
    
    // Set refractor intensity if it exists in the settings
    if (settings.refractorIntensity !== undefined) {
      setRefractorIntensity(settings.refractorIntensity);
      document.documentElement.style.setProperty('--refractor-intensity', settings.refractorIntensity.toString());
    }
  };

  return {
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity,
    handleMotionSpeedChange,
    handlePulseIntensityChange,
    handleShimmerSpeedChange,
    handleGoldIntensityChange,
    handleChromeIntensityChange,
    handleVintageIntensityChange,
    handleRefractorIntensityChange,
    getCurrentSettings,
    applySettings
  };
};
