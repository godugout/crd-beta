
import { useState, useCallback } from 'react';

export interface LightSettings {
  intensity: number;
  color: string;
  x: number;
  y: number;
  z: number;
}

export interface LightingSettings {
  intensity: number;
  color: string;
  position: [number, number, number];
  ambientIntensity: number;
  primaryLight: LightSettings;
  ambientLight: {
    intensity: number;
    color: string;
  };
  environmentType: LightingPreset;
  envMapIntensity: number;
  useDynamicLighting: boolean;
  followPointer: boolean;
  autoRotate: boolean;
}

export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'gallery' | 'display_case';

const LIGHTING_PRESETS: Record<LightingPreset, LightingSettings> = {
  studio: {
    intensity: 1.0,
    color: '#ffffff',
    position: [10, 10, 5],
    ambientIntensity: 0.4,
    primaryLight: {
      intensity: 1.2,
      color: '#ffffff',
      x: 10,
      y: 10,
      z: 5
    },
    ambientLight: {
      intensity: 0.4,
      color: '#ffffff'
    },
    environmentType: 'studio',
    envMapIntensity: 1.0,
    useDynamicLighting: false,
    followPointer: false,
    autoRotate: false
  },
  natural: {
    intensity: 0.8,
    color: '#fff5e6',
    position: [5, 15, 8],
    ambientIntensity: 0.6,
    primaryLight: {
      intensity: 0.8,
      color: '#fff5e6',
      x: 5,
      y: 15,
      z: 8
    },
    ambientLight: {
      intensity: 0.6,
      color: '#fff5e6'
    },
    environmentType: 'natural',
    envMapIntensity: 1.2,
    useDynamicLighting: false,
    followPointer: false,
    autoRotate: false
  },
  dramatic: {
    intensity: 1.2,
    color: '#ffffff',
    position: [15, 5, 10],
    ambientIntensity: 0.2,
    primaryLight: {
      intensity: 1.5,
      color: '#ffffff',
      x: 15,
      y: 5,
      z: 10
    },
    ambientLight: {
      intensity: 0.2,
      color: '#ffffff'
    },
    environmentType: 'dramatic',
    envMapIntensity: 0.8,
    useDynamicLighting: false,
    followPointer: false,
    autoRotate: false
  },
  gallery: {
    intensity: 0.9,
    color: '#f8f8f8',
    position: [0, 20, 0],
    ambientIntensity: 0.5,
    primaryLight: {
      intensity: 0.9,
      color: '#f8f8f8',
      x: 0,
      y: 20,
      z: 0
    },
    ambientLight: {
      intensity: 0.5,
      color: '#f8f8f8'
    },
    environmentType: 'gallery',
    envMapIntensity: 1.0,
    useDynamicLighting: false,
    followPointer: false,
    autoRotate: false
  },
  display_case: {
    intensity: 1.1,
    color: '#ffffff',
    position: [0, 0, 15],
    ambientIntensity: 0.3,
    primaryLight: {
      intensity: 1.1,
      color: '#ffffff',
      x: 0,
      y: 0,
      z: 15
    },
    ambientLight: {
      intensity: 0.3,
      color: '#ffffff'
    },
    environmentType: 'display_case',
    envMapIntensity: 1.5,
    useDynamicLighting: false,
    followPointer: false,
    autoRotate: false
  }
};

export const useCardLighting = (initialPreset: LightingPreset = 'studio') => {
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(initialPreset);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(
    LIGHTING_PRESETS[initialPreset]
  );
  const [isUserCustomized, setIsUserCustomized] = useState(false);

  const applyPreset = useCallback((preset: LightingPreset) => {
    setLightingPreset(preset);
    setLightingSettings(LIGHTING_PRESETS[preset]);
    setIsUserCustomized(false);
  }, []);

  const updateLightingSetting = useCallback((settings: Partial<LightingSettings>) => {
    setLightingSettings(prev => ({
      ...prev,
      ...settings
    }));
    setIsUserCustomized(true);
  }, []);

  const updateLightPosition = useCallback((x: number, y: number) => {
    if (!lightingSettings.useDynamicLighting) return;
    
    setLightingSettings(prev => ({
      ...prev,
      primaryLight: {
        ...prev.primaryLight,
        x: (x - 0.5) * 20,
        y: (0.5 - y) * 20
      }
    }));
    setIsUserCustomized(true);
  }, [lightingSettings.useDynamicLighting]);

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
    applyPreset,
    updateLightingSetting,
    updateLightPosition,
    toggleDynamicLighting,
    isUserCustomized
  };
};
