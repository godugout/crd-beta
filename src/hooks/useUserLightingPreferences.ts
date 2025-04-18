
import { useState, useEffect } from 'react';
import { LightingSettings } from '@/hooks/useCardLighting';
import { useSession } from '@/providers/session-provider';
import { supabase } from '@/lib/supabase/client';

export const useUserLightingPreferences = () => {
  const { user } = useSession();
  const [preferences, setPreferences] = useState<LightingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user preferences
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from a real database table
        // For now, just get from local storage
        const savedPrefs = localStorage.getItem(`lighting_preferences_${user.id}`);
        
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
  }, [user]);
  
  // Save user preferences
  const savePreferences = async (settings: LightingSettings) => {
    if (!user) return;
    
    try {
      // In a real implementation, this would save to a real database table
      // For now, just save to local storage
      localStorage.setItem(
        `lighting_preferences_${user.id}`, 
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
