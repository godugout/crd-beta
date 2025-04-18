
import { useState, useEffect } from 'react';
import { LightingSettings } from '@/hooks/useCardLighting';
import { supabase } from '@/lib/supabase/client';

export const useUserLightingPreferences = (initialPreset = 'studio') => {
  const [preferences, setPreferences] = useState<LightingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from a real database table
        // For now, just get from local storage
        const userId = localStorage.getItem('userId') || 'anonymous-user';
        const savedPrefs = localStorage.getItem(`lighting_preferences_${userId}`);
        
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching lighting preferences:', err);
        setError('Failed to load your lighting preferences');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, []);
  
  // Save user preferences
  const savePreferences = async (settings: LightingSettings) => {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous-user';
      
      // In a real implementation, this would save to a real database table
      // For now, just save to local storage
      localStorage.setItem(
        `lighting_preferences_${userId}`, 
        JSON.stringify(settings)
      );
      
      setPreferences(settings);
      return true;
    } catch (err) {
      console.error('Error saving lighting preferences:', err);
      setError('Failed to save your lighting preferences');
      return false;
    }
  };
  
  return {
    preferences,
    isLoading,
    error,
    savePreferences
  };
};
