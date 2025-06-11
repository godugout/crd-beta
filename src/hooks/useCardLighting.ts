
import { useState, useCallback } from 'react';

export interface LightingSettings {
  intensity: number;
  color: string;
  position: [number, number, number];
  ambientIntensity: number;
}

export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'gallery' | 'display_case';

const LIGHTING_PRESETS: Record<LightingPreset, LightingSettings> = {
  studio: {
    intensity: 1.0,
    color: '#ffffff',
    position: [10, 10, 5],
    ambientIntensity: 0.4
  },
  natural: {
    intensity: 0.8,
    color: '#fff5e6',
    position: [5, 15, 8],
    ambientIntensity: 0.6
  },
  dramatic: {
    intensity: 1.2,
    color: '#ffffff',
    position: [15, 5, 10],
    ambientIntensity: 0.2
  },
  gallery: {
    intensity: 0.9,
    color: '#f8f8f8',
    position: [0, 20, 0],
    ambientIntensity: 0.5
  },
  display_case: {
    intensity: 1.1,
    color: '#ffffff',
    position: [0, 0, 15],
    ambientIntensity: 0.3
  }
};

export const useCardLighting = (initialPreset: LightingPreset = 'studio') => {
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(initialPreset);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(
    LIGHTING_PRESETS[initialPreset]
  );

  const applyPreset = useCallback((preset: LightingPreset) => {
    setLightingPreset(preset);
    setLightingSettings(LIGHTING_PRESETS[preset]);
  }, []);

  const updateLightingSetting = useCallback((
    key: keyof LightingSettings,
    value: any
  ) => {
    setLightingSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    lightingSettings,
    lightingPreset,
    applyPreset,
    updateLightingSetting
  };
};
