
import { useState, useEffect } from 'react';

export interface LightingSettings {
  primaryLight: {
    x: number;
    y: number;
    z: number;
    intensity: number;
    color: string;
    castShadow: boolean;
  };
  ambientLight: {
    intensity: number;
    color: string;
  };
  environmentType: 'display_case' | 'natural' | 'dramatic' | 'studio';
  followPointer: boolean;
  autoRotate: boolean;
}

export const LIGHTING_PRESETS = {
  display_case: {
    primaryLight: { x: 0, y: 10, z: 10, intensity: 1.2, color: '#ffffff', castShadow: true },
    ambientLight: { intensity: 0.5, color: '#f0f0ff' },
    followPointer: false,
    autoRotate: false
  },
  natural: {
    primaryLight: { x: 5, y: 10, z: 5, intensity: 0.8, color: '#fff6e0', castShadow: true },
    ambientLight: { intensity: 0.6, color: '#e0f0ff' },
    followPointer: false,
    autoRotate: false
  },
  dramatic: {
    primaryLight: { x: -10, y: 5, z: 10, intensity: 1.5, color: '#ff9900', castShadow: true },
    ambientLight: { intensity: 0.2, color: '#000033' },
    followPointer: false,
    autoRotate: false
  },
  studio: {
    primaryLight: { x: 0, y: 5, z: 10, intensity: 1.0, color: '#ffffff', castShadow: true },
    ambientLight: { intensity: 0.7, color: '#f8f8f8' },
    followPointer: false,
    autoRotate: false
  }
};

export function useCardLighting(initialPreset: keyof typeof LIGHTING_PRESETS = 'display_case') {
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(
    LIGHTING_PRESETS[initialPreset]
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const updateLightPosition = (x: number, y: number) => {
    setMousePosition({ x, y });
    
    if (lightingSettings.followPointer) {
      setLightingSettings(prev => ({
        ...prev,
        primaryLight: {
          ...prev.primaryLight,
          x: (x - 0.5) * 20,
          y: (0.5 - y) * 20
        }
      }));
    }
  };
  
  const toggleFollowPointer = () => {
    setLightingSettings(prev => ({
      ...prev,
      followPointer: !prev.followPointer
    }));
  };
  
  const toggleAutoRotate = () => {
    setLightingSettings(prev => ({
      ...prev,
      autoRotate: !prev.autoRotate
    }));
  };
  
  const updateLightSetting = (
    property: keyof LightingSettings['primaryLight'] | keyof LightingSettings['ambientLight'], 
    value: any,
    lightType: 'primaryLight' | 'ambientLight'
  ) => {
    setLightingSettings(prev => ({
      ...prev,
      [lightType]: {
        ...prev[lightType],
        [property]: value
      }
    }));
  };
  
  const applyPreset = (presetName: keyof typeof LIGHTING_PRESETS) => {
    setLightingSettings(LIGHTING_PRESETS[presetName]);
  };
  
  // Auto-rotation effect
  useEffect(() => {
    if (!lightingSettings.autoRotate) return;
    
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.02;
      setLightingSettings(prev => ({
        ...prev,
        primaryLight: {
          ...prev.primaryLight,
          x: Math.sin(angle) * 10,
          z: Math.cos(angle) * 10
        }
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [lightingSettings.autoRotate]);
  
  return {
    lightingSettings,
    mousePosition,
    updateLightPosition,
    toggleFollowPointer,
    toggleAutoRotate,
    updateLightSetting,
    applyPreset,
    lightingPresets: LIGHTING_PRESETS
  };
}
