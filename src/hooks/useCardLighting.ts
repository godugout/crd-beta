import { useState, useCallback, useEffect } from 'react';

export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'gallery' | 'display_case';

interface LightPosition {
  x: number;
  y: number;
  z: number;
}

interface Light {
  position: LightPosition;
  intensity: number;
  color: string;
  type: 'directional' | 'point' | 'ambient' | 'spot';
}

export interface LightingSettings {
  primaryLight: {
    x: number;
    y: number;
    z: number;
    intensity: number;
    color: string;
  };
  ambientLight: {
    intensity: number;
    color: string;
  };
  environmentType: LightingPreset;
  envMapIntensity: number;
  useDynamicLighting: boolean;
  followPointer?: boolean;
  autoRotate?: boolean;
  shadowIntensity?: number;
  rimLighting?: {
    intensity: number;
    color: string;
  };
  backgroundColor?: string;
  secondaryLight?: {
    x: number;
    y: number;
    z: number;
    intensity: number;
    color: string;
  };
  fillLight?: {
    x: number;
    y: number;
    z: number;
    intensity: number;
    color: string;
  };
}

export const DEFAULT_LIGHTING: Record<LightingPreset, LightingSettings> = {
  studio: {
    primaryLight: {
      x: 8,
      y: 15,
      z: 12,
      intensity: 2.2,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.4,
      color: '#f8f9fa'
    },
    secondaryLight: {
      x: -6,
      y: 8,
      z: 10,
      intensity: 1.0,
      color: '#f0f0ff'
    },
    fillLight: {
      x: 0,
      y: -5,
      z: 8,
      intensity: 0.6,
      color: '#ffffff'
    },
    environmentType: 'studio',
    envMapIntensity: 1.5,
    useDynamicLighting: true,
    shadowIntensity: 0.3,
    rimLighting: {
      intensity: 0.4,
      color: '#ffffff'
    },
    backgroundColor: '#1a1a1a'
  },
  natural: {
    primaryLight: {
      x: 20,
      y: 25,
      z: 15,
      intensity: 1.8,
      color: '#fff8e1'
    },
    ambientLight: {
      intensity: 0.8,
      color: '#e3f2fd'
    },
    secondaryLight: {
      x: -10,
      y: 15,
      z: 12,
      intensity: 0.6,
      color: '#bbdefb'
    },
    environmentType: 'natural',
    envMapIntensity: 1.2,
    useDynamicLighting: true,
    shadowIntensity: 0.6,
    rimLighting: {
      intensity: 0.7,
      color: '#ffeb3b'
    },
    backgroundColor: '#87ceeb'
  },
  dramatic: {
    primaryLight: {
      x: 25,
      y: 5,
      z: 20,
      intensity: 3.5,
      color: '#ff8f00'
    },
    ambientLight: {
      intensity: 0.1,
      color: '#1a1a2e'
    },
    secondaryLight: {
      x: -15,
      y: -8,
      z: 15,
      intensity: 0.3,
      color: '#3f51b5'
    },
    environmentType: 'dramatic',
    envMapIntensity: 2.0,
    useDynamicLighting: false,
    shadowIntensity: 0.9,
    rimLighting: {
      intensity: 1.2,
      color: '#ff5722'
    },
    backgroundColor: '#0d1421'
  },
  gallery: {
    primaryLight: {
      x: 0,
      y: 20,
      z: 15,
      intensity: 2.0,
      color: '#fff9c4'
    },
    ambientLight: {
      intensity: 0.6,
      color: '#fafafa'
    },
    secondaryLight: {
      x: 12,
      y: 12,
      z: 10,
      intensity: 0.8,
      color: '#ffffff'
    },
    fillLight: {
      x: -12,
      y: 12,
      z: 10,
      intensity: 0.8,
      color: '#ffffff'
    },
    environmentType: 'gallery',
    envMapIntensity: 1.3,
    useDynamicLighting: true,
    shadowIntensity: 0.2,
    rimLighting: {
      intensity: 0.3,
      color: '#ffffff'
    },
    backgroundColor: '#f5f5f5'
  },
  display_case: {
    primaryLight: {
      x: 0,
      y: 18,
      z: 12,
      intensity: 1.8,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.5,
      color: '#f0f0f0'
    },
    secondaryLight: {
      x: 8,
      y: 10,
      z: 8,
      intensity: 0.7,
      color: '#ffffff'
    },
    fillLight: {
      x: -8,
      y: 10,
      z: 8,
      intensity: 0.7,
      color: '#ffffff'
    },
    environmentType: 'display_case',
    envMapIntensity: 1.1,
    useDynamicLighting: true,
    shadowIntensity: 0.25,
    rimLighting: {
      intensity: 0.35,
      color: '#ffffff'
    },
    backgroundColor: '#e8e8e8'
  }
};

export const LIGHTING_PRESETS = DEFAULT_LIGHTING;

export const useCardLighting = (initialPreset: LightingPreset = 'studio') => {
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(initialPreset);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(DEFAULT_LIGHTING[initialPreset]);
  const [isUserCustomized, setIsUserCustomized] = useState(false);
  
  const applyPreset = useCallback((preset: LightingPreset) => {
    console.log('Applying lighting preset:', preset, DEFAULT_LIGHTING[preset]);
    setLightingPreset(preset);
    setLightingSettings(DEFAULT_LIGHTING[preset]);
    setIsUserCustomized(false);
  }, []);
  
  const updateLightingSetting = useCallback((settings: Partial<LightingSettings>) => {
    console.log('Updating lighting settings:', settings);
    setLightingSettings(prev => ({
      ...prev,
      ...settings
    }));
    setIsUserCustomized(true);
  }, []);
  
  const updateLightPosition = useCallback((x: number, y: number) => {
    setLightingSettings(prev => {
      if (!prev || !prev.useDynamicLighting) return prev;
      
      const posX = (x - 0.5) * 40;
      const posY = (y - 0.5) * -40;
      
      return {
        ...prev,
        primaryLight: {
          ...prev.primaryLight,
          x: posX,
          y: posY
        }
      };
    });
  }, []);
  
  const updatePrimaryLightIntensity = useCallback((intensity: number) => {
    setLightingSettings(prev => ({
      ...prev,
      primaryLight: {
        ...prev.primaryLight,
        intensity
      }
    }));
    setIsUserCustomized(true);
  }, []);
  
  const updatePrimaryLightColor = useCallback((color: string) => {
    setLightingSettings(prev => ({
      ...prev,
      primaryLight: {
        ...prev.primaryLight,
        color
      }
    }));
    setIsUserCustomized(true);
  }, []);
  
  const updateAmbientLightIntensity = useCallback((intensity: number) => {
    setLightingSettings(prev => ({
      ...prev,
      ambientLight: {
        ...prev.ambientLight,
        intensity
      }
    }));
    setIsUserCustomized(true);
  }, []);
  
  const updateAmbientLightColor = useCallback((color: string) => {
    setLightingSettings(prev => ({
      ...prev,
      ambientLight: {
        ...prev.ambientLight,
        color
      }
    }));
    setIsUserCustomized(true);
  }, []);
  
  const toggleDynamicLighting = useCallback(() => {
    setLightingSettings(prev => ({
      ...prev,
      useDynamicLighting: !prev.useDynamicLighting
    }));
    setIsUserCustomized(true);
  }, []);
  
  const updateEnvMapIntensity = useCallback((intensity: number) => {
    setLightingSettings(prev => ({
      ...prev,
      envMapIntensity: intensity
    }));
    setIsUserCustomized(true);
  }, []);
  
  return {
    lightingSettings,
    lightingPreset,
    isUserCustomized,
    applyPreset,
    updateLightingSetting,
    updateLightPosition,
    updatePrimaryLightIntensity,
    updatePrimaryLightColor,
    updateAmbientLightIntensity,
    updateAmbientLightColor,
    toggleDynamicLighting,
    updateEnvMapIntensity
  };
};
