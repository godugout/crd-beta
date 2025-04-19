
import React, { createContext, useContext, useState } from 'react';

export interface LightSettings {
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
  environmentType: 'studio' | 'natural' | 'dramatic' | 'display_case';
}

const defaultLightSettings: LightSettings = {
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
  environmentType: 'studio'
};

const LightingContext = createContext<{
  lightSettings: LightSettings;
  updateLightSettings: (settings: Partial<LightSettings>) => void;
}>({
  lightSettings: defaultLightSettings,
  updateLightSettings: () => {}
});

export const LightingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lightSettings, setLightSettings] = useState<LightSettings>(defaultLightSettings);

  const updateLightSettings = (newSettings: Partial<LightSettings>) => {
    setLightSettings(prev => ({
      ...prev,
      ...newSettings,
      primaryLight: {
        ...prev.primaryLight,
        ...(newSettings.primaryLight || {})
      },
      ambientLight: {
        ...prev.ambientLight,
        ...(newSettings.ambientLight || {})
      }
    }));
  };

  return (
    <LightingContext.Provider value={{ lightSettings, updateLightSettings }}>
      {children}
    </LightingContext.Provider>
  );
};

export const useLighting = () => {
  const context = useContext(LightingContext);
  if (!context) {
    throw new Error('useLighting must be used within a LightingProvider');
  }
  return context;
};
