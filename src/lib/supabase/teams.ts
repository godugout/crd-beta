
import { supabase } from './client';
import { Team, DbTeam } from '@/lib/types/TeamTypes';

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
  
  getTeamMetadata: async (teamId: string): Promise<{ data: Team | null; error: any }> => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    if (data) {
      const dbTeam = data as DbTeam;
      
      const team: Team = {
        id: dbTeam.id,
        name: dbTeam.name,
        description: dbTeam.description || undefined,
        owner_id: dbTeam.owner_id,
        created_at: dbTeam.created_at,
        updated_at: dbTeam.updated_at,
        logo_url: dbTeam.logo_url || undefined,
        team_code: dbTeam.team_code || undefined,
        primary_color: dbTeam.primary_color || undefined,
        secondary_color: dbTeam.secondary_color || undefined,
        tertiary_color: dbTeam.tertiary_color || undefined,
        founded_year: dbTeam.founded_year || undefined,
        city: dbTeam.city || undefined,
        state: dbTeam.state || undefined,
        country: dbTeam.country || undefined,
        stadium: dbTeam.stadium || undefined,
        mascot: dbTeam.mascot || undefined,
        league: dbTeam.league || undefined,
        division: dbTeam.division || undefined,
        is_active: dbTeam.is_active || false
      };
      
      return { data: team, error: null };
    }
    
    return { data: null, error: null };
  },
  
  getTeamBySlug: async (teamSlug: string): Promise<{ data: Team | null; error: any }> => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('team_code', teamSlug.toUpperCase())
      .maybeSingle();
      
    if (error) {
      return { data: null, error };
    }
    
    if (data) {
      const dbTeam = data as DbTeam;
      
      const team: Team = {
        id: dbTeam.id,
        name: dbTeam.name,
        slug: teamSlug,
        description: dbTeam.description || undefined,
        owner_id: dbTeam.owner_id,
        created_at: dbTeam.created_at,
        updated_at: dbTeam.updated_at,
        logo_url: dbTeam.logo_url || undefined,
        team_code: dbTeam.team_code || undefined,
        primary_color: dbTeam.primary_color || undefined,
        secondary_color: dbTeam.secondary_color || undefined,
        tertiary_color: dbTeam.tertiary_color || undefined,
        founded_year: dbTeam.founded_year || undefined,
        city: dbTeam.city || undefined,
        state: dbTeam.state || undefined,
        country: dbTeam.country || undefined,
        stadium: dbTeam.stadium || undefined,
        mascot: dbTeam.mascot || undefined,
        league: dbTeam.league || undefined,
        division: dbTeam.division || undefined,
        is_active: dbTeam.is_active || false
      };
      
      return { data: team, error: null };
    }
    
    return { data: null, error: null };
  }
};
