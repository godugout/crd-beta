
import { supabase } from '../client';
import { LightingSettings } from '@/hooks/useCardLighting';

export interface UserLightingPreference {
  id?: string;
  user_id: string;
  settings: LightingSettings;
  name?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export const lightingOperations = {
  // Save user lighting preference
  async saveUserLightingPreference(preference: Omit<UserLightingPreference, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('user_lighting_preferences')
        .insert([preference])
        .select('*')
        .single();

      if (error) {
        console.error('Error saving lighting preference:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Error in saveUserLightingPreference:', err);
      return {
        data: null,
        error: { message: 'Failed to save lighting preference: ' + (err.message || 'Unknown error') }
      };
    }
  },

  // Update existing lighting preference
  async updateUserLightingPreference(id: string, updates: Partial<UserLightingPreference>) {
    try {
      const { data, error } = await supabase
        .from('user_lighting_preferences')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating lighting preference:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Error in updateUserLightingPreference:', err);
      return {
        data: null,
        error: { message: 'Failed to update lighting preference: ' + (err.message || 'Unknown error') }
      };
    }
  },

  // Get user's default lighting preference
  async getUserDefaultLightingPreference(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_lighting_preferences')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
        console.error('Error fetching default lighting preference:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Error in getUserDefaultLightingPreference:', err);
      return {
        data: null,
        error: { message: 'Failed to fetch lighting preference: ' + (err.message || 'Unknown error') }
      };
    }
  },

  // Get all user lighting preferences
  async getUserLightingPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_lighting_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lighting preferences:', error);
        return { data: [], error };
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Error in getUserLightingPreferences:', err);
      return {
        data: [],
        error: { message: 'Failed to fetch lighting preferences: ' + (err.message || 'Unknown error') }
      };
    }
  },

  // Delete a lighting preference
  async deleteLightingPreference(id: string) {
    try {
      const { error } = await supabase
        .from('user_lighting_preferences')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting lighting preference:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error in deleteLightingPreference:', err);
      return {
        success: false,
        error: { message: 'Failed to delete lighting preference: ' + (err.message || 'Unknown error') }
      };
    }
  }
};
