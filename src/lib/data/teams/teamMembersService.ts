
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/lib/types';
import { mapTeamMemberFromDb } from './mappers';

/**
 * Get all members of a team
 */
export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*, users(*)')
    .eq('team_id', teamId);

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return data ? data.map(mapTeamMemberFromDb) : [];
};

/**
 * Add a new member to a team
 */
export const addTeamMember = async (teamId: string, userId: string, role: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: userId,
      role: role
    })
    .select('*, users(*)')
    .single();

  if (error) {
    console.error("Error adding team member:", error);
    return null;
  }

  return data ? mapTeamMemberFromDb(data) : null;
};

/**
 * Update a team member's role
 */
export const updateTeamMemberRole = async (teamMemberId: string, role: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .update({ role: role })
    .eq('id', teamMemberId)
    .select('*, users(*)')
    .single();

  if (error) {
    console.error("Error updating team member role:", error);
    return null;
  }

  return data ? mapTeamMemberFromDb(data) : null;
};

/**
 * Remove a member from a team
 */
export const removeTeamMember = async (teamMemberId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', teamMemberId);

  if (error) {
    console.error("Error removing team member:", error);
    return false;
  }

  return true;
};
