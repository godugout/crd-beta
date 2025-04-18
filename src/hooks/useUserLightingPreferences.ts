
import { useState, useEffect } from 'react';
import { lightingOperations } from '@/lib/supabase/lighting-operations/lighting-operations';
import { LightingSettings, LightingPreset, DEFAULT_LIGHTING } from '@/hooks/useCardLighting';
import { useToast } from '@/hooks/use-toast';

interface UseUserLightingPreferencesOptions {
  autoLoad?: boolean;
}

export const useUserLightingPreferences = (defaultPreset: LightingPreset = 'studio', options: UseUserLightingPreferencesOptions = {}) => {
  const [currentSettings, setCurrentSettings] = useState<LightingSettings | null>(null);
  const [savedPreferences, setSavedPreferences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Function to save the current lighting preference to the database
  const savePreference = async (settings: LightingSettings, name: string = 'Default Lighting', isDefault: boolean = false) => {
    try {
      // Get the current user ID
      // In a real app, you'd get this from your auth context
      const userId = "current-user-id"; // Replace with actual user ID
      
      const { data, error } = await lightingOperations.saveUserLightingPreference({
        user_id: userId,
        settings,
        name,
        is_default: isDefault
      });
      
      if (error) {
        console.error("Error saving lighting preference:", error);
        toast({
          title: "Failed to save lighting settings",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Lighting settings saved",
        description: `Your "${name}" lighting settings have been saved.`,
        variant: "default"
      });
      
      // Refresh the saved preferences
      loadUserPreferences();
      return true;
      
    } catch (err: any) {
      console.error("Error in savePreference:", err);
      toast({
        title: "Failed to save lighting settings",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Function to update an existing preference
  const updatePreference = async (id: string, settings: LightingSettings, name?: string) => {
    try {
      const updates: any = { settings };
      if (name) updates.name = name;
      
      const { data, error } = await lightingOperations.updateUserLightingPreference(id, updates);
      
      if (error) {
        console.error("Error updating lighting preference:", error);
        toast({
          title: "Failed to update lighting settings",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Lighting settings updated",
        description: `Your lighting settings have been updated.`,
        variant: "default"
      });
      
      // Refresh the saved preferences
      loadUserPreferences();
      return true;
      
    } catch (err: any) {
      console.error("Error in updatePreference:", err);
      toast({
        title: "Failed to update lighting settings",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Function to load user preferences
  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you'd get this from your auth context
      const userId = "current-user-id"; // Replace with actual user ID
      
      const { data, error } = await lightingOperations.getUserLightingPreferences(userId);
      
      if (error) {
        console.error("Error loading lighting preferences:", error);
        setError(error.message);
        return;
      }
      
      setSavedPreferences(data || []);
      
      // Find the default preference
      const defaultPref = data?.find(pref => pref.is_default);
      if (defaultPref) {
        setCurrentSettings(defaultPref.settings);
      }
      
    } catch (err: any) {
      console.error("Error in loadUserPreferences:", err);
      setError(err.message || "Failed to load preferences");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load user preferences on initial render if autoLoad is true
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadUserPreferences();
    } else {
      setIsLoading(false);
      setCurrentSettings(DEFAULT_LIGHTING[defaultPreset]);
    }
  }, [defaultPreset, options.autoLoad]);
  
  return {
    currentSettings,
    savedPreferences,
    isLoading,
    error,
    savePreference,
    updatePreference,
    loadUserPreferences
  };
};
