
import { useState, useCallback } from 'react';
import { LightingSettings } from './useCardLighting';

export const useUserLightingPreferences = () => {
  const [preferences, setPreferences] = useState<LightingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const savePreferences = useCallback((settings: LightingSettings) => {
    setPreferences(settings);
    // In a real app, this would save to localStorage or a database
    localStorage.setItem('cardLightingPreferences', JSON.stringify(settings));
  }, []);

  const loadPreferences = useCallback(() => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('cardLightingPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
        setIsLoading(false);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load lighting preferences:', error);
    }
    setIsLoading(false);
    return null;
  }, []);

  return {
    preferences,
    isLoading,
    savePreferences,
    loadPreferences
  };
};
