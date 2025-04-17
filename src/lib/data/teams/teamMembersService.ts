
import { TeamMember } from '@/lib/types';
import { mapTeamMemberFromDb } from './mappers';
import { supabase } from '@/lib/supabaseClient';

// In-memory store for team members
const teamMembersStore: TeamMember[] = [];

export const teamMembersService = {
  /**
   * Get all members of a team
   */
  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*, users(*)')
        .eq('team_id', teamId);

      if (error) {
        console.error("Error fetching team members:", error);
        return [];
      }

      return data ? data.map(mapTeamMemberFromDb) : [];
    } catch (error) {
      console.error("Unexpected error fetching team members:", error);
      return [];
    }
  },

  /**
   * Add a new member to a team
   */
  addTeamMember: async (teamId: string, userId: string, role: string): Promise<TeamMember | null> => {
    try {
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
    } catch (error) {
      console.error("Unexpected error adding team member:", error);
      return null;
    }
  },

  /**
   * Update a team member's role
   */
  updateTeamMemberRole: async (teamMemberId: string, role: string): Promise<TeamMember | null> => {
    try {
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
    } catch (error) {
      console.error("Unexpected error updating team member role:", error);
      return null;
    }
  },

  /**
   * Remove a member from a team
   */
  removeTeamMember: async (teamMemberId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', teamMemberId);

      if (error) {
        console.error("Error removing team member:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected error removing team member:", error);
      return false;
    }
  }
};
