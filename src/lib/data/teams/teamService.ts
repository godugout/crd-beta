
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/lib/types/teamTypes';
import { mapTeamFromDb } from './mappers';

/**
 * Get a team by ID
 */
export const getTeamById = async (teamId: string): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single();

  if (error) {
    console.error("Error fetching team:", error);
    return null;
  }

  return data ? mapTeamFromDb(data) : null;
};

/**
 * Get all teams
 */
export const getAllTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*');

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  return data ? data.map(mapTeamFromDb) : [];
};

/**
 * Create a new team
 */
export const createTeam = async (team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: team.name,
      city_id: team.city_id,
      sport: team.sport,
      league: team.league,
      division: team.division,
      founded_year: team.founded_year,
      stadium: team.stadium,
      description: team.description,
      logo_url: team.logo_url,
      primary_color: team.primary_color,
      secondary_color: team.secondary_color,
      accent_color: team.accent_color,
      is_active: team.is_active
    })
    .select('*')
    .single();

  if (error) {
    console.error("Error creating team:", error);
    return null;
  }

  return data ? mapTeamFromDb(data) : null;
};

/**
 * Update an existing team
 */
export const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .update({
      name: updates.name,
      city_id: updates.city_id,
      sport: updates.sport,
      league: updates.league,
      division: updates.division,
      founded_year: updates.founded_year,
      stadium: updates.stadium,
      description: updates.description,
      logo_url: updates.logo_url,
      primary_color: updates.primary_color,
      secondary_color: updates.secondary_color,
      accent_color: updates.accent_color,
      is_active: updates.is_active
    })
    .eq('id', teamId)
    .select('*')
    .single();

  if (error) {
    console.error("Error updating team:", error);
    return null;
  }

  return data ? mapTeamFromDb(data) : null;
};

/**
 * Delete a team
 */
export const deleteTeam = async (teamId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId);

  if (error) {
    console.error("Error deleting team:", error);
    return false;
  }

  return true;
};
