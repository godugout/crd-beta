
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
export const createTeam = async (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: team.name,
      description: team.description,
      logo_url: team.logoUrl || team.logo_url,
      banner_url: team.banner_url,
      owner_id: team.ownerId,
      status: team.status,
      website: team.website,
      email: team.email,
      specialties: team.specialties,
      visibility: team.visibility
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
      description: updates.description,
      logo_url: updates.logoUrl || updates.logo_url,
      banner_url: updates.banner_url,
      status: updates.status,
      website: updates.website,
      email: updates.email,
      specialties: updates.specialties,
      visibility: updates.visibility,
      primary_color: updates.primary_color,
      secondary_color: updates.secondary_color
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
