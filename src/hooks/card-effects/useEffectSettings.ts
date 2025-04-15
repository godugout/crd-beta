
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

type EffectSettingsUpdater = (settings: EffectSettings) => void;

export const useEffectSettings = (onSettingsChange?: EffectSettingsUpdater) => {
  const [motionSpeed, setMotionSpeed] = useState<number>(1);
  const [pulseIntensity, setPulseIntensity] = useState<number>(1);
  const [shimmerSpeed, setShimmerSpeed] = useState<number>(1);
  const [goldIntensity, setGoldIntensity] = useState<number>(1);
  const [chromeIntensity, setChromeIntensity] = useState<number>(1);
  const [vintageIntensity, setVintageIntensity] = useState<number>(1);
  const [refractorIntensity, setRefractorIntensity] = useState<number>(1);
  const [spectralIntensity, setSpectralIntensity] = useState<number>(1);
  
  // Helper functions for handling different sliders
  const handleMotionSpeedChange = useCallback((value: number) => {
    setMotionSpeed(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed: value,
        pulseIntensity,
        shimmerSpeed,
        goldIntensity,
        chromeIntensity,
        vintageIntensity,
        refractorIntensity,
        spectralIntensity
      });
    }
  }, [onSettingsChange, pulseIntensity, shimmerSpeed, goldIntensity, chromeIntensity, vintageIntensity, refractorIntensity, spectralIntensity]);
  
  const handlePulseIntensityChange = useCallback((value: number) => {
    setPulseIntensity(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed,
        pulseIntensity: value,
        shimmerSpeed,
        goldIntensity,
        chromeIntensity,
        vintageIntensity,
        refractorIntensity,
        spectralIntensity
      });
    }
  }, [onSettingsChange, motionSpeed, shimmerSpeed, goldIntensity, chromeIntensity, vintageIntensity, refractorIntensity, spectralIntensity]);
  
  const handleShimmerSpeedChange = useCallback((value: number) => {
    setShimmerSpeed(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed,
        pulseIntensity,
        shimmerSpeed: value,
        goldIntensity,
        chromeIntensity,
        vintageIntensity,
        refractorIntensity,
        spectralIntensity
      });
    }
  }, [onSettingsChange, motionSpeed, pulseIntensity, goldIntensity, chromeIntensity, vintageIntensity, refractorIntensity, spectralIntensity]);
  
  const handleGoldIntensityChange = useCallback((value: number) => {
    setGoldIntensity(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed,
        pulseIntensity,
        shimmerSpeed,
        goldIntensity: value,
        chromeIntensity,
        vintageIntensity,
        refractorIntensity,
        spectralIntensity
      });
    }
  }, [onSettingsChange, motionSpeed, pulseIntensity, shimmerSpeed, chromeIntensity, vintageIntensity, refractorIntensity, spectralIntensity]);
  
  const handleChromeIntensityChange = useCallback((value: number) => {
    setChromeIntensity(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed,
        pulseIntensity,
        shimmerSpeed,
        goldIntensity,
        chromeIntensity: value,
        vintageIntensity,
        refractorIntensity,
        spectralIntensity
      });
    }
  }, [onSettingsChange, motionSpeed, pulseIntensity, shimmerSpeed, goldIntensity, vintageIntensity, refractorIntensity, spectralIntensity]);
  
  const handleVintageIntensityChange = useCallback((value: number) => {
    setVintageIntensity(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed,
        pulseIntensity,
        shimmerSpeed,
        goldIntensity,
        chromeIntensity,
        vintageIntensity: value,
        refractorIntensity,
        spectralIntensity
      });
    }
  }, [onSettingsChange, motionSpeed, pulseIntensity, shimmerSpeed, goldIntensity, chromeIntensity, refractorIntensity, spectralIntensity]);
  
  const handleRefractorIntensityChange = useCallback((value: number) => {
    setRefractorIntensity(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed,
        pulseIntensity,
        shimmerSpeed,
        goldIntensity,
        chromeIntensity,
        vintageIntensity,
        refractorIntensity: value,
        spectralIntensity
      });
    }
  }, [onSettingsChange, motionSpeed, pulseIntensity, shimmerSpeed, goldIntensity, chromeIntensity, vintageIntensity, spectralIntensity]);
  
  const handleSpectralIntensityChange = useCallback((value: number) => {
    setSpectralIntensity(value);
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed,
        pulseIntensity,
        shimmerSpeed,
        goldIntensity,
        chromeIntensity,
        vintageIntensity,
        refractorIntensity,
        spectralIntensity: value
      });
    }
  }, [onSettingsChange, motionSpeed, pulseIntensity, shimmerSpeed, goldIntensity, chromeIntensity, vintageIntensity, refractorIntensity]);
  
  // Methods to get and apply settings
  const getCurrentSettings = useCallback(() => ({
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity,
    spectralIntensity
  }), [motionSpeed, pulseIntensity, shimmerSpeed, goldIntensity, chromeIntensity, vintageIntensity, refractorIntensity, spectralIntensity]);
  
  const applySettings = useCallback((settings: Partial<EffectSettings>) => {
    if (settings.motionSpeed !== undefined) setMotionSpeed(settings.motionSpeed);
    if (settings.pulseIntensity !== undefined) setPulseIntensity(settings.pulseIntensity);
    if (settings.shimmerSpeed !== undefined) setShimmerSpeed(settings.shimmerSpeed);
    if (settings.goldIntensity !== undefined) setGoldIntensity(settings.goldIntensity);
    if (settings.chromeIntensity !== undefined) setChromeIntensity(settings.chromeIntensity);
    if (settings.vintageIntensity !== undefined) setVintageIntensity(settings.vintageIntensity);
    if (settings.refractorIntensity !== undefined) setRefractorIntensity(settings.refractorIntensity);
    if (settings.spectralIntensity !== undefined) setSpectralIntensity(settings.spectralIntensity);
    
    if (onSettingsChange) {
      onSettingsChange({
        motionSpeed: settings.motionSpeed ?? motionSpeed,
        pulseIntensity: settings.pulseIntensity ?? pulseIntensity,
        shimmerSpeed: settings.shimmerSpeed ?? shimmerSpeed,
        goldIntensity: settings.goldIntensity ?? goldIntensity,
        chromeIntensity: settings.chromeIntensity ?? chromeIntensity,
        vintageIntensity: settings.vintageIntensity ?? vintageIntensity,
        refractorIntensity: settings.refractorIntensity ?? refractorIntensity,
        spectralIntensity: settings.spectralIntensity ?? spectralIntensity
      });
    }
  }, [
    motionSpeed, pulseIntensity, shimmerSpeed, goldIntensity, 
    chromeIntensity, vintageIntensity, refractorIntensity, spectralIntensity, 
    onSettingsChange
  ]);
  
  return {
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity,
    spectralIntensity,
    handleMotionSpeedChange,
    handlePulseIntensityChange,
    handleShimmerSpeedChange,
    handleGoldIntensityChange,
    handleChromeIntensityChange,
    handleVintageIntensityChange,
    handleRefractorIntensityChange,
    handleSpectralIntensityChange,
    getCurrentSettings,
    applySettings
  };
};

export default useEffectSettings;
