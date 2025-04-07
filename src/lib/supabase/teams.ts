
import { supabase } from './client';

// Team operations
export const teamOperations = {
  getTeamTemplates: async (teamId: string): Promise<{ data: any[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('team_templates')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });
      
    return { data, error };
  },
  
  getTeamMetadata: async (teamId: string): Promise<{ data: any | null; error: any }> => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
      
    return { data, error };
  }
};
