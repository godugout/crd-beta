
import { useState, useEffect, useCallback } from 'react';
import { LightingSettings, LightingPreset } from './useCardLighting';

interface LightingPreferences {
  environmentType: LightingPreset;
  intensity: number;
  autoRotate: boolean;
}

export const useUserLightingPreferences = () => {
  const [preferences, setPreferences] = useState<LightingPreferences | null>(null);

  // Load preferences from localStorage on component mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('cardLightingPreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      } else {
        // Default preferences
        const defaultPrefs: LightingPreferences = {
          environmentType: 'studio',
          intensity: 1.0,
          autoRotate: false
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
        autoRotate: false
      });
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((settings: Partial<LightingSettings>) => {
    try {
      const prefsToSave: LightingPreferences = {
        environmentType: settings.environmentType || 'studio',
        intensity: settings.envMapIntensity || 1.0,
        autoRotate: settings.autoRotate || false
      };
      
      setPreferences(prefsToSave);
      localStorage.setItem('cardLightingPreferences', JSON.stringify(prefsToSave));
    } catch (error) {
      console.error('Error saving lighting preferences:', error);
    }
  }, []);

  return { preferences, savePreferences };
};

export default useUserLightingPreferences;
