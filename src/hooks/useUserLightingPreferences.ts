
import { useState, useEffect } from 'react';
import { LightingSettings } from '@/hooks/useCardLighting';
import { supabase } from '@/lib/supabase/client';
import { useSession } from '@/context/SessionContext';
import { toast } from 'sonner';

export const useUserLightingPreferences = (initialPreset = 'studio') => {
  const [preferences, setPreferences] = useState<LightingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSession();
  
  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        
        // Get userId - either from session or fallback to localStorage/anonymous
        const userId = user?.id || localStorage.getItem('userId') || 'anonymous-user';
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
  }, [user]);
  
  // Save user preferences
  const savePreferences = async (settings: LightingSettings) => {
    try {
      // Get userId - either from session or fallback to localStorage/anonymous
      const userId = user?.id || localStorage.getItem('userId') || 'anonymous-user';
      
      // Save to local storage for now
      localStorage.setItem(
        `lighting_preferences_${userId}`, 
        JSON.stringify(settings)
      );
      
      // In a production app, we would also save to Supabase database
      // if (user) {
      //   const { error } = await supabase
      //     .from('user_preferences')
      //     .upsert({
      //       user_id: userId,
      //       lighting_settings: settings,
      //       updated_at: new Date().toISOString()
      //     });
      //     
      //   if (error) throw error;
      // }
      
      setPreferences(settings);
      return true;
    } catch (err) {
      console.error('Error saving lighting preferences:', err);
      setError('Failed to save your lighting preferences');
      toast.error('Failed to save lighting preferences');
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
