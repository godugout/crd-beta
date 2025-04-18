
import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/providers/session-provider';
import { lightingOperations, UserLightingPreference } from '@/lib/supabase/lighting-operations/lighting-operations';
import { LightingSettings, LightingPreset } from './useCardLighting';
import { toast } from 'sonner';

export const useUserLightingPreferences = (initialPreset: LightingPreset = 'studio') => {
  const { session } = useSession();
  const userId = session?.user?.id;
  
  const [preferences, setPreferences] = useState<UserLightingPreference[]>([]);
  const [currentPreference, setCurrentPreference] = useState<UserLightingPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get default preference first
        const { data: defaultPreference, error: defaultError } = await lightingOperations.getUserDefaultLightingPreference(userId);
        
        if (defaultError) {
          console.error('Error loading default preference:', defaultError);
          setError('Failed to load lighting preferences');
        }
        
        // Get all preferences
        const { data: allPreferences, error: preferencesError } = await lightingOperations.getUserLightingPreferences(userId);
        
        if (preferencesError) {
          console.error('Error loading preferences:', preferencesError);
          setError('Failed to load lighting preferences');
        } else {
          setPreferences(allPreferences || []);
          
          // Set current preference to default or first in list
          if (defaultPreference) {
            setCurrentPreference(defaultPreference);
          } else if (allPreferences && allPreferences.length > 0) {
            setCurrentPreference(allPreferences[0]);
          }
        }
      } catch (err: any) {
        console.error('Error in loadPreferences:', err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, [userId]);

  // Save a new preference
  const savePreference = useCallback(async (
    settings: LightingSettings, 
    name: string = 'My Lighting', 
    makeDefault: boolean = false
  ) => {
    if (!userId) {
      toast.error('You must be logged in to save preferences');
      return null;
    }
    
    try {
      // If making this the default, unset other defaults
      if (makeDefault && preferences.some(p => p.is_default)) {
        // Find current default
        const currentDefault = preferences.find(p => p.is_default);
        if (currentDefault) {
          await lightingOperations.updateUserLightingPreference(
            currentDefault.id!,
            { is_default: false }
          );
        }
      }
      
      const newPreference: Omit<UserLightingPreference, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        settings,
        name,
        is_default: makeDefault,
      };
      
      const { data, error } = await lightingOperations.saveUserLightingPreference(newPreference);
      
      if (error) {
        toast.error('Failed to save lighting preference');
        return null;
      }
      
      toast.success('Lighting preference saved');
      
      // Update local state
      setPreferences(prev => [data!, ...prev]);
      
      // If this is the new default or we don't have a current preference, set it
      if (makeDefault || !currentPreference) {
        setCurrentPreference(data!);
      }
      
      return data;
    } catch (err: any) {
      toast.error('An error occurred while saving preference');
      console.error('Error saving preference:', err);
      return null;
    }
  }, [userId, preferences, currentPreference]);

  // Update an existing preference
  const updatePreference = useCallback(async (
    id: string,
    updates: Partial<UserLightingPreference>
  ) => {
    if (!userId) {
      toast.error('You must be logged in to update preferences');
      return false;
    }
    
    try {
      // If making this the default, unset other defaults
      if (updates.is_default && preferences.some(p => p.is_default && p.id !== id)) {
        // Find current default
        const currentDefault = preferences.find(p => p.is_default && p.id !== id);
        if (currentDefault) {
          await lightingOperations.updateUserLightingPreference(
            currentDefault.id!,
            { is_default: false }
          );
        }
      }
      
      const { data, error } = await lightingOperations.updateUserLightingPreference(id, updates);
      
      if (error) {
        toast.error('Failed to update lighting preference');
        return false;
      }
      
      toast.success('Lighting preference updated');
      
      // Update local state
      setPreferences(prev => prev.map(p => p.id === id ? data! : p));
      
      // If this is the current preference or new default, update current
      if ((currentPreference && currentPreference.id === id) || updates.is_default) {
        setCurrentPreference(data!);
      }
      
      return true;
    } catch (err: any) {
      toast.error('An error occurred while updating preference');
      console.error('Error updating preference:', err);
      return false;
    }
  }, [userId, preferences, currentPreference]);

  // Delete a preference
  const deletePreference = useCallback(async (id: string) => {
    try {
      const { success, error } = await lightingOperations.deleteLightingPreference(id);
      
      if (error || !success) {
        toast.error('Failed to delete lighting preference');
        return false;
      }
      
      toast.success('Lighting preference deleted');
      
      // Update local state
      setPreferences(prev => prev.filter(p => p.id !== id));
      
      // If this was the current preference, set to default or first in list
      if (currentPreference && currentPreference.id === id) {
        const newDefault = preferences.find(p => p.is_default && p.id !== id);
        if (newDefault) {
          setCurrentPreference(newDefault);
        } else if (preferences.length > 1) {
          const newCurrent = preferences.find(p => p.id !== id);
          setCurrentPreference(newCurrent || null);
        } else {
          setCurrentPreference(null);
        }
      }
      
      return true;
    } catch (err: any) {
      toast.error('An error occurred while deleting preference');
      console.error('Error deleting preference:', err);
      return false;
    }
  }, [preferences, currentPreference]);

  // Apply a preference
  const applyPreference = useCallback((preference: UserLightingPreference) => {
    setCurrentPreference(preference);
  }, []);

  // Current settings to use with lighting system
  const currentSettings = currentPreference?.settings || null;

  return {
    preferences,
    currentPreference,
    currentSettings,
    isLoading,
    error,
    savePreference,
    updatePreference,
    deletePreference,
    applyPreference
  };
};
