
import { useState, useEffect, useCallback } from 'react';
import { LightingSettings, DEFAULT_LIGHTING } from '@/hooks/useCardLighting';

export const useUserLightingPreferences = () => {
  const [preferences, setPreferences] = useState<LightingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on component mount
  useEffect(() => {
    setIsLoading(true);
    const savedPreferences = localStorage.getItem('userLightingPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences) as LightingSettings;
        setPreferences(parsedPreferences);
      } catch (error) {
        console.error('Error parsing lighting preferences:', error);
        // Use default preferences if parsing fails
        setPreferences(DEFAULT_LIGHTING.studio);
      }
    } else {
      // Use default preferences if none are saved
      setPreferences(DEFAULT_LIGHTING.studio);
    }
    setIsLoading(false);
  }, []);

  // Save preferences
  const savePreferences = useCallback((settings: LightingSettings) => {
    try {
      localStorage.setItem('userLightingPreferences', JSON.stringify(settings));
      setPreferences(settings);
    } catch (error) {
      console.error('Error saving lighting preferences:', error);
    }
  }, []);

  // Reset preferences to defaults
  const resetPreferences = useCallback(() => {
    localStorage.removeItem('userLightingPreferences');
    setPreferences(DEFAULT_LIGHTING.studio);
  }, []);

  return {
    preferences,
    isLoading,
    savePreferences,
    resetPreferences
  };
};
