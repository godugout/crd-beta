
import { supabase } from '@/integrations/supabase/client';
import { Team, TeamMember, TeamInsert, TeamUpdate } from '../schema/types';
import { toast } from 'sonner';

/**
 * Repository for team-related data operations
 */
export const teamRepository = {
  /**
   * Get all teams the current user is a member of
   */
  getUserTeams: async (userId: string): Promise<{ data: Team[] | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching team memberships:', error);
        return { data: null, error };
      }

      const teamIds = data.map(membership => membership.team_id);
      
      if (teamIds.length === 0) {
        return { data: [], error: null };
      }

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds);

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        return { data: null, error: teamsError };
      }

      // Transform database records to our Team type
      const teams = teamsData.map(transformTeamFromDb);
      
      return { data: teams, error: null };
    } catch (err) {
      console.error('Unexpected error in getUserTeams:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Get a single team by ID
   */
  getTeam: async (id: string): Promise<{ data: Team | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching team:', error);
        return { data: null, error };
      }
      
      const team = transformTeamFromDb(data);
      
      return { data: team, error: null };
    } catch (err) {
      console.error('Unexpected error in getTeam:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Create a new team
   */
  createTeam: async (
    team: Omit<TeamInsert, 'id' | 'created_at' | 'updated_at'>,
    currentUserId: string
  ): Promise<{ data: Team | null; error: any }> => {
    try {
      // Start a transaction to create team and add current user as owner
      const { data, error } = await supabase.rpc('create_team_with_owner', {
        team_name: team.name,
        team_description: team.description || '',
        team_logo_url: team.logoUrl || '',
        owner_id: currentUserId
      });
      
      if (error) {
        console.error('Error creating team:', error);
        toast.error('Failed to create team');
        return { data: null, error };
      }
      
      // Get the newly created team
      const { data: newTeam, error: fetchError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', data.team_id)
        .single();
        
      if (fetchError) {
        console.error('Error fetching new team:', fetchError);
        return { data: null, error: fetchError };
      }
      
      const transformedTeam = transformTeamFromDb(newTeam);
      
      toast.success('Team created successfully');
      return { data: transformedTeam, error: null };
    } catch (err) {
      console.error('Unexpected error in createTeam:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },

  /**
   * Update an existing team
   */
  updateTeam: async (
    id: string, 
    updates: Partial<Omit<TeamUpdate, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ data: Team | null; error: any }> => {
    try {
      // Convert to database field names
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl;
      
      const { data, error } = await supabase
        .from('teams')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating team:', error);
        toast.error('Failed to update team');
        return { data: null, error };
      }
      
      const updatedTeam = transformTeamFromDb(data);
      
      toast.success('Team updated successfully');
      return { data: updatedTeam, error: null };
    } catch (err) {
      console.error('Unexpected error in updateTeam:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },

  /**
   * Delete a team
   */
  deleteTeam: async (id: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting team:', error);
        toast.error('Failed to delete team');
        return { success: false, error };
      }
      
      toast.success('Team deleted successfully');
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in deleteTeam:', err);
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  },

  /**
   * Get team members
   */
  getTeamMembers: async (teamId: string): Promise<{ data: TeamMember[] | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*, profiles(*)')
        .eq('team_id', teamId);
      
      if (error) {
        console.error('Error fetching team members:', error);
        return { data: null, error };
      }
      
      // Transform database records to our TeamMember type
      const members = data.map((record: any) => ({
        id: record.id,
        teamId: record.team_id,
        userId: record.user_id,
        role: record.role,
        joinedAt: record.joined_at,
        user: record.profiles ? {
          id: record.profiles.id,
          name: record.profiles.full_name,
          avatarUrl: record.profiles.avatar_url,
        } : undefined
      }));
      
      return { data: members, error: null };
    } catch (err) {
      console.error('Unexpected error in getTeamMembers:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Add a user to a team
   */
  addTeamMember: async (
    teamId: string, 
    userId: string, 
    role: 'admin' | 'member' | 'viewer' = 'member'
  ): Promise<{ success: boolean; error: any }> => {
    try {
      // Check if user is already a member
      const { data: existing } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .single();
      
      if (existing) {
        // Update role if needed
        if (existing.role !== role) {
          const { error } = await supabase
            .from('team_members')
            .update({ role })
            .eq('id', existing.id);
          
          if (error) {
            console.error('Error updating team member role:', error);
            return { success: false, error };
          }
        }
        return { success: true, error: null };
      }
      
      // Add new member
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role
        });
      
      if (error) {
        console.error('Error adding team member:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in addTeamMember:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Remove a user from a team
   */
  removeTeamMember: async (teamId: string, userId: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error removing team member:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in removeTeamMember:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Check if user is a member of a team with specific role
   */
  isTeamMember: async (
    teamId: string, 
    userId: string,
    role?: 'owner' | 'admin' | 'member' | 'viewer'
  ): Promise<{ isMember: boolean; memberRole?: string; error: any }> => {
    try {
      let query = supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', userId);
      
      if (role) {
        query = query.eq('role', role);
      }
      
      const { data, error } = await query.single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which just means not a member
        console.error('Error checking team membership:', error);
        return { isMember: false, error };
      }
      
      return { 
        isMember: !!data, 
        memberRole: data?.role,
        error: null 
      };
    } catch (err) {
      console.error('Unexpected error in isTeamMember:', err);
      return { isMember: false, error: err };
    }
  }
};

/**
 * Helper to transform database record to Team type
 */
function transformTeamFromDb(record: any): Team {
  if (!record) return {} as Team;
  
  return {
    id: record.id,
    name: record.name,
    description: record.description || '',
    logoUrl: record.logo_url || '',
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    ownerId: record.owner_id
  };
}
