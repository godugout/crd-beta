
import { useState, useEffect, useCallback } from 'react';
import { LightingSettings, LightingPreset } from './useCardLighting';

export interface LightingPreferences {
  environmentType: LightingPreset;
  intensity: number;
  autoRotate: boolean;
  primaryLight?: {
    x: number;
    y: number;
    z: number;
    intensity: number;
    color: string;
  };
  ambientLight?: {
    intensity: number;
    color: string;
  };
  envMapIntensity?: number;
  useDynamicLighting?: boolean;
}

export const useUserLightingPreferences = () => {
  const [preferences, setPreferences] = useState<LightingPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on component mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedPrefs = localStorage.getItem('cardLightingPreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      } else {
        // Default preferences
        const defaultPrefs: LightingPreferences = {
          environmentType: 'studio',
          intensity: 1.0,
          autoRotate: false,
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
          envMapIntensity: 1.0,
          useDynamicLighting: true
        };
        setPreferences(defaultPrefs);
        localStorage.setItem('cardLightingPreferences', JSON.stringify(defaultPrefs));
      }
    } catch (error) {
      console.error('Error loading lighting preferences:', error);
      // Set fallback preferences
      setPreferences({
        environmentType: 'studio',
        intensity: 1.0,
        autoRotate: false,
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
        envMapIntensity: 1.0,
        useDynamicLighting: true
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((settings: Partial<LightingSettings>) => {
    try {
      const prefsToSave: LightingPreferences = {
        environmentType: settings.environmentType || 'studio',
        intensity: settings.envMapIntensity || 1.0,
        autoRotate: settings.autoRotate || false,
        primaryLight: settings.primaryLight,
        ambientLight: settings.ambientLight,
        envMapIntensity: settings.envMapIntensity,
        useDynamicLighting: settings.useDynamicLighting
      };
      
      setPreferences(prefsToSave);
      localStorage.setItem('cardLightingPreferences', JSON.stringify(prefsToSave));
    } catch (error) {
      console.error('Error saving lighting preferences:', error);
    }
  }, []);

  return { preferences, isLoading, savePreferences };
};

export default useUserLightingPreferences;
