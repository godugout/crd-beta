
import { useState, useCallback } from 'react';
import { ValidEnvironmentPreset, lightingPresets } from '@/utils/environmentPresets';

export type LightingPreset = ValidEnvironmentPreset;

export interface LightPoint {
  x: number;
  y: number;
  z: number;
  intensity: number;
  color: string;
}

export interface LightingSettings {
  primaryLight: LightPoint;
  ambientLight: {
    intensity: number;
    color: string;
  };
  environmentType: LightingPreset;
  envMapIntensity: number;
  useDynamicLighting: boolean;
  autoRotate?: boolean;
}

interface UseCardLightingProps {
  initialPreset?: LightingPreset;
}

export const useCardLighting = (initialPreset: LightingPreset = 'studio') => {
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>({
    primaryLight: {
      x: 5,
      y: 5,
      z: 5,
      intensity: 1.0,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.5,
      color: '#f0f0ff'
    },
    environmentType: initialPreset,
    envMapIntensity: 1.0,
    useDynamicLighting: true,
    autoRotate: false
  });
  
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(initialPreset);
  const [isUserCustomized, setIsUserCustomized] = useState(false);

  // Update a single setting in the lighting configuration
  const updateLightingSetting = useCallback((newSettings: Partial<LightingSettings>) => {
    setLightingSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    setIsUserCustomized(true);
  }, []);

  // Apply a preset lighting configuration
  const applyPreset = useCallback((preset: LightingPreset) => {
    const presetConfig = lightingPresets[preset];
    
    if (!presetConfig) return;
    
    setLightingPreset(preset);
    setLightingSettings(prev => ({
      ...prev,
      environmentType: preset,
      envMapIntensity: presetConfig.intensity || 1.0,
      primaryLight: {
        ...prev.primaryLight,
        intensity: preset === 'dramatic' ? 1.5 : 
                  preset === 'night' ? 0.7 : 1.0,
        color: preset === 'sunset' ? '#ff9966' : 
               preset === 'dawn' ? '#ffb399' : '#ffffff'
      },
      ambientLight: {
        ...prev.ambientLight,
        intensity: preset === 'night' ? 0.3 : 
                  preset === 'studio' ? 0.5 : 0.4,
        color: preset === 'sunset' ? '#331100' : 
               preset === 'dawn' ? '#113366' : '#f0f0ff'
      }
    }));
    setIsUserCustomized(false);
  }, []);

  // Toggle dynamic lighting feature
  const toggleDynamicLighting = useCallback(() => {
    setLightingSettings(prev => ({
      ...prev,
      useDynamicLighting: !prev.useDynamicLighting
    }));
    setIsUserCustomized(true);
  }, []);

  return {
    lightingSettings,
    lightingPreset,
    updateLightingSetting,
    applyPreset,
    isUserCustomized,
    toggleDynamicLighting
  };
};

export default useCardLighting;
