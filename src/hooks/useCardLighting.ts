import { useState, useCallback, useEffect } from 'react';

export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'display_case';

// Map our lighting presets to valid @react-three/drei environment presets
export const LIGHTING_PRESET_MAPPING = {
  'studio': 'studio',
  'natural': 'park',
  'dramatic': 'night',
  'display_case': 'lobby'
} as const;

// Valid @react-three/drei environment presets
export type DreiEnvironmentPreset = 
  'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 
  'night' | 'park' | 'studio' | 'sunset' | 'warehouse';

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
}

export const DEFAULT_LIGHTING: Record<LightingPreset, LightingSettings> = {
  studio: {
    primaryLight: {
      x: 10,
      y: 10,
      z: 10,
      intensity: 1.2,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.6,
      color: '#f0f0ff'
    },
    environmentType: 'studio',
    envMapIntensity: 1.0,
    useDynamicLighting: true,
    followPointer: true,
    autoRotate: false
  },
  natural: {
    primaryLight: {
      x: 5,
      y: 15,
      z: 5,
      intensity: 0.9,
      color: '#fffaf0'
    },
    ambientLight: {
      intensity: 0.7,
      color: '#e0f0ff'
    },
    environmentType: 'natural',
    envMapIntensity: 0.8,
    useDynamicLighting: true,
    followPointer: true,
    autoRotate: false
  },
  dramatic: {
    primaryLight: {
      x: 15,
      y: 5,
      z: 10,
      intensity: 1.5,
      color: '#fff0e0'
    },
    ambientLight: {
      intensity: 0.3,
      color: '#202040'
    },
    environmentType: 'dramatic',
    envMapIntensity: 1.2,
    useDynamicLighting: true,
    followPointer: false,
    autoRotate: true
  },
  display_case: {
    primaryLight: {
      x: 0,
      y: 10,
      z: 10,
      intensity: 1,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.5,
      color: '#f0f0ff'
    },
    environmentType: 'display_case',
    envMapIntensity: 0.9,
    useDynamicLighting: true,
    followPointer: false,
    autoRotate: false
  }
};

// Export LIGHTING_PRESETS to fix the error in LightingControls.tsx
export const LIGHTING_PRESETS = DEFAULT_LIGHTING;

export const useCardLighting = (initialPreset: LightingPreset = 'studio') => {
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(initialPreset);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(DEFAULT_LIGHTING[initialPreset]);
  const [isUserCustomized, setIsUserCustomized] = useState(false);
  
  // Apply preset lighting
  const applyPreset = useCallback((preset: LightingPreset) => {
    setLightingPreset(preset);
    setLightingSettings(DEFAULT_LIGHTING[preset]);
    setIsUserCustomized(false);
  }, []);
  
  // Update lighting settings with partial settings object
  const updateLightingSetting = useCallback((settings: Partial<LightingSettings>) => {
    setLightingSettings(prev => ({
      ...prev,
      ...settings
    }));
    setIsUserCustomized(true);
  }, []);
  
  // Update primary light position (typically from mouse movement)
  const updateLightPosition = useCallback((x: number, y: number) => {
    if (!lightingSettings.useDynamicLighting) return;
    
    // Convert from normalized coordinates (0-1) to actual position values
    const posX = (x - 0.5) * 20;
    const posY = (y - 0.5) * -20; // Invert Y axis for natural movement
    
    setLightingSettings(prev => ({
      ...prev,
      primaryLight: {
        ...prev.primaryLight,
        x: posX,
        y: posY
      }
    }));
  }, [lightingSettings.useDynamicLighting]);
  
  // Update primary light intensity
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
  
  // Update primary light color
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
  
  // Update ambient light intensity
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
  
  // Update ambient light color
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
  
  // Toggle dynamic lighting
  const toggleDynamicLighting = useCallback(() => {
    setLightingSettings(prev => ({
      ...prev,
      useDynamicLighting: !prev.useDynamicLighting
    }));
    setIsUserCustomized(true);
  }, []);
  
  // Update environment map intensity
  const updateEnvMapIntensity = useCallback((intensity: number) => {
    setLightingSettings(prev => ({
      ...prev,
      envMapIntensity: intensity
    }));
    setIsUserCustomized(true);
  }, []);
  
  // Add utility function to get a valid @react-three/drei environment preset
  const getValidEnvironmentPreset = useCallback((preset: LightingPreset): DreiEnvironmentPreset => {
    return (LIGHTING_PRESET_MAPPING[preset] || 'studio') as DreiEnvironmentPreset;
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
    updateEnvMapIntensity,
    getValidEnvironmentPreset
  };
};
