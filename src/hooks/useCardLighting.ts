
import { useState, useCallback, useEffect } from 'react';

export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'display_case' | 'gallery' | 'stadium' | 'twilight' | 'quarry' | 'coastline' | 'hillside' | 'milkyway' | 'esplanade' | 'neonclub' | 'industrial';

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
}

export const DEFAULT_LIGHTING: Record<LightingPreset, LightingSettings> = {
  studio: {
    primaryLight: {
      x: 8,
      y: 12,
      z: 10,
      intensity: 1.8,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.9,
      color: '#f8f9fa'
    },
    environmentType: 'studio',
    envMapIntensity: 1.2,
    useDynamicLighting: true,
    shadowIntensity: 0.3,
    rimLighting: {
      intensity: 0.2,
      color: '#ffffff'
    },
    backgroundColor: '#f0f0f0'
  },
  natural: {
    primaryLight: {
      x: 15,
      y: 20,
      z: 8,
      intensity: 1.4,
      color: '#fff8e1'
    },
    ambientLight: {
      intensity: 0.8,
      color: '#e3f2fd'
    },
    environmentType: 'natural',
    envMapIntensity: 0.9,
    useDynamicLighting: true,
    shadowIntensity: 0.5,
    rimLighting: {
      intensity: 0.4,
      color: '#ffeb3b'
    },
    backgroundColor: '#87ceeb'
  },
  dramatic: {
    primaryLight: {
      x: 20,
      y: 5,
      z: 15,
      intensity: 2.5,
      color: '#ff8f00'
    },
    ambientLight: {
      intensity: 0.2,
      color: '#1a1a2e'
    },
    environmentType: 'dramatic',
    envMapIntensity: 1.5,
    useDynamicLighting: false,
    shadowIntensity: 0.8,
    rimLighting: {
      intensity: 0.6,
      color: '#ff5722'
    },
    backgroundColor: '#0d1421'
  },
  display_case: {
    primaryLight: {
      x: 0,
      y: 15,
      z: 12,
      intensity: 1.6,
      color: '#f5f5f5'
    },
    ambientLight: {
      intensity: 0.7,
      color: '#fafafa'
    },
    environmentType: 'display_case',
    envMapIntensity: 1.0,
    useDynamicLighting: true,
    shadowIntensity: 0.4,
    rimLighting: {
      intensity: 0.3,
      color: '#e0e0e0'
    },
    backgroundColor: '#ffffff'
  },
  gallery: {
    primaryLight: {
      x: 5,
      y: 18,
      z: 8,
      intensity: 1.7,
      color: '#fff9c4'
    },
    ambientLight: {
      intensity: 0.8,
      color: '#f8f8f8'
    },
    environmentType: 'gallery',
    envMapIntensity: 1.1,
    useDynamicLighting: true,
    shadowIntensity: 0.3,
    rimLighting: {
      intensity: 0.25,
      color: '#ffffff'
    },
    backgroundColor: '#f5f5f5'
  },
  stadium: {
    primaryLight: {
      x: 12,
      y: 25,
      z: 10,
      intensity: 2.2,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.6,
      color: '#e8f5e8'
    },
    environmentType: 'stadium',
    envMapIntensity: 1.3,
    useDynamicLighting: false,
    shadowIntensity: 0.6,
    rimLighting: {
      intensity: 0.5,
      color: '#4caf50'
    },
    backgroundColor: '#2e7d32'
  },
  twilight: {
    primaryLight: {
      x: 18,
      y: 8,
      z: 12,
      intensity: 1.2,
      color: '#ff6b35'
    },
    ambientLight: {
      intensity: 0.4,
      color: '#3f51b5'
    },
    environmentType: 'twilight',
    envMapIntensity: 0.8,
    useDynamicLighting: true,
    shadowIntensity: 0.7,
    rimLighting: {
      intensity: 0.7,
      color: '#ff9800'
    },
    backgroundColor: '#1a237e'
  },
  quarry: {
    primaryLight: {
      x: 10,
      y: 15,
      z: 8,
      intensity: 1.6,
      color: '#ffcc80'
    },
    ambientLight: {
      intensity: 0.5,
      color: '#8d6e63'
    },
    environmentType: 'quarry',
    envMapIntensity: 0.7,
    useDynamicLighting: true,
    shadowIntensity: 0.6,
    rimLighting: {
      intensity: 0.4,
      color: '#795548'
    },
    backgroundColor: '#5d4037'
  },
  coastline: {
    primaryLight: {
      x: 8,
      y: 20,
      z: 15,
      intensity: 1.5,
      color: '#e1f5fe'
    },
    ambientLight: {
      intensity: 0.7,
      color: '#b3e5fc'
    },
    environmentType: 'coastline',
    envMapIntensity: 1.4,
    useDynamicLighting: true,
    shadowIntensity: 0.4,
    rimLighting: {
      intensity: 0.5,
      color: '#00bcd4'
    },
    backgroundColor: '#006064'
  },
  hillside: {
    primaryLight: {
      x: 12,
      y: 16,
      z: 10,
      intensity: 1.4,
      color: '#f1f8e9'
    },
    ambientLight: {
      intensity: 0.6,
      color: '#c8e6c9'
    },
    environmentType: 'hillside',
    envMapIntensity: 0.9,
    useDynamicLighting: true,
    shadowIntensity: 0.5,
    rimLighting: {
      intensity: 0.4,
      color: '#4caf50'
    },
    backgroundColor: '#2e7d32'
  },
  milkyway: {
    primaryLight: {
      x: 5,
      y: 8,
      z: 20,
      intensity: 0.8,
      color: '#e8eaf6'
    },
    ambientLight: {
      intensity: 0.3,
      color: '#1a1a2e'
    },
    environmentType: 'milkyway',
    envMapIntensity: 2.0,
    useDynamicLighting: false,
    shadowIntensity: 0.9,
    rimLighting: {
      intensity: 0.8,
      color: '#673ab7'
    },
    backgroundColor: '#0d0d1a'
  },
  esplanade: {
    primaryLight: {
      x: 6,
      y: 14,
      z: 12,
      intensity: 1.3,
      color: '#fff3e0'
    },
    ambientLight: {
      intensity: 0.8,
      color: '#fafafa'
    },
    environmentType: 'esplanade',
    envMapIntensity: 1.1,
    useDynamicLighting: true,
    shadowIntensity: 0.3,
    rimLighting: {
      intensity: 0.3,
      color: '#ffb74d'
    },
    backgroundColor: '#eeeeee'
  },
  neonclub: {
    primaryLight: {
      x: 8,
      y: 6,
      z: 15,
      intensity: 2.0,
      color: '#e91e63'
    },
    ambientLight: {
      intensity: 0.4,
      color: '#311b92'
    },
    environmentType: 'neonclub',
    envMapIntensity: 1.6,
    useDynamicLighting: false,
    shadowIntensity: 0.7,
    rimLighting: {
      intensity: 0.9,
      color: '#00e5ff'
    },
    backgroundColor: '#1a0933'
  },
  industrial: {
    primaryLight: {
      x: 15,
      y: 10,
      z: 8,
      intensity: 1.8,
      color: '#ffcc80'
    },
    ambientLight: {
      intensity: 0.5,
      color: '#455a64'
    },
    environmentType: 'industrial',
    envMapIntensity: 0.8,
    useDynamicLighting: true,
    shadowIntensity: 0.6,
    rimLighting: {
      intensity: 0.5,
      color: '#ff9800'
    },
    backgroundColor: '#263238'
  }
};

export const LIGHTING_PRESETS = DEFAULT_LIGHTING;

export const useCardLighting = (initialPreset: LightingPreset = 'studio') => {
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(initialPreset);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(DEFAULT_LIGHTING[initialPreset]);
  const [isUserCustomized, setIsUserCustomized] = useState(false);
  
  const applyPreset = useCallback((preset: LightingPreset) => {
    setLightingPreset(preset);
    setLightingSettings(DEFAULT_LIGHTING[preset]);
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
    setLightingSettings(prev => {
      if (!prev || !prev.useDynamicLighting) return prev;
      
      const posX = (x - 0.5) * 20;
      const posY = (y - 0.5) * -20;
      
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
