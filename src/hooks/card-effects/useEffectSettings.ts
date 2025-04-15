
import { useState, useCallback, useEffect } from 'react';
import { EffectSettings } from './types';

// Default settings
const DEFAULT_SETTINGS: EffectSettings = {
  motionSpeed: 1.0,
  pulseIntensity: 0.5,
  shimmerSpeed: 1.0,
  goldIntensity: 0.7,
  chromeIntensity: 0.8,
  vintageIntensity: 0.6,
  refractorIntensity: 0.7,
  spectralIntensity: 0.5
};

/**
 * Hook for managing effect settings
 * 
 * @param onChange Optional callback for when settings change
 * @returns Effect settings and update methods
 */
export function useEffectSettings(onChange?: (settings: EffectSettings) => void) {
  const [motionSpeed, setMotionSpeed] = useState(DEFAULT_SETTINGS.motionSpeed);
  const [pulseIntensity, setPulseIntensity] = useState(DEFAULT_SETTINGS.pulseIntensity);
  const [shimmerSpeed, setShimmerSpeed] = useState(DEFAULT_SETTINGS.shimmerSpeed);
  const [goldIntensity, setGoldIntensity] = useState(DEFAULT_SETTINGS.goldIntensity);
  const [chromeIntensity, setChromeIntensity] = useState(DEFAULT_SETTINGS.chromeIntensity);
  const [vintageIntensity, setVintageIntensity] = useState(DEFAULT_SETTINGS.vintageIntensity);
  const [refractorIntensity, setRefractorIntensity] = useState(DEFAULT_SETTINGS.refractorIntensity);
  const [spectralIntensity, setSpectralIntensity] = useState(DEFAULT_SETTINGS.spectralIntensity);

  // Handlers for each setting
  const handleMotionSpeedChange = useCallback((value: number) => {
    setMotionSpeed(value);
  }, []);
  
  const handlePulseIntensityChange = useCallback((value: number) => {
    setPulseIntensity(value);
  }, []);
  
  const handleShimmerSpeedChange = useCallback((value: number) => {
    setShimmerSpeed(value);
  }, []);
  
  const handleGoldIntensityChange = useCallback((value: number) => {
    setGoldIntensity(value);
  }, []);
  
  const handleChromeIntensityChange = useCallback((value: number) => {
    setChromeIntensity(value);
  }, []);
  
  const handleVintageIntensityChange = useCallback((value: number) => {
    setVintageIntensity(value);
  }, []);
  
  const handleRefractorIntensityChange = useCallback((value: number) => {
    setRefractorIntensity(value);
  }, []);
  
  const handleSpectralIntensityChange = useCallback((value: number) => {
    setSpectralIntensity(value);
  }, []);

  // Get current settings
  const getCurrentSettings = useCallback((): EffectSettings => {
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

  // Apply settings from external source
  const applySettings = useCallback((settings: Partial<EffectSettings>) => {
    if (settings.motionSpeed !== undefined) setMotionSpeed(settings.motionSpeed);
    if (settings.pulseIntensity !== undefined) setPulseIntensity(settings.pulseIntensity);
    if (settings.shimmerSpeed !== undefined) setShimmerSpeed(settings.shimmerSpeed);
    if (settings.goldIntensity !== undefined) setGoldIntensity(settings.goldIntensity);
    if (settings.chromeIntensity !== undefined) setChromeIntensity(settings.chromeIntensity);
    if (settings.vintageIntensity !== undefined) setVintageIntensity(settings.vintageIntensity);
    if (settings.refractorIntensity !== undefined) setRefractorIntensity(settings.refractorIntensity);
    if (settings.spectralIntensity !== undefined) setSpectralIntensity(settings.spectralIntensity);
  }, []);

  // Notify on settings change
  useEffect(() => {
    if (onChange) {
      onChange(getCurrentSettings());
    }
  }, [
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity,
    spectralIntensity,
    onChange,
    getCurrentSettings
  ]);

  return {
    // Current values
    motionSpeed,
    pulseIntensity,
    shimmerSpeed,
    goldIntensity,
    chromeIntensity,
    vintageIntensity,
    refractorIntensity,
    spectralIntensity,
    
    // Handlers
    handleMotionSpeedChange,
    handlePulseIntensityChange,
    handleShimmerSpeedChange,
    handleGoldIntensityChange,
    handleChromeIntensityChange,
    handleVintageIntensityChange,
    handleRefractorIntensityChange,
    handleSpectralIntensityChange,
    
    // Utility functions
    getCurrentSettings,
    applySettings,
    
    // Constants
    DEFAULT_SETTINGS
  };
}

export default useEffectSettings;
