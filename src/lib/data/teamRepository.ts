
import { supabase } from '@/integrations/supabase/client';
import { Team, TeamMember, DbTeam, DbTeamMember } from '../schema/types';
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
      // First get all teams the user is a member of
      const { data: teamMemberships, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id, role')
        .eq('user_id', userId);
      
      if (membershipError) {
        console.error('Error fetching team memberships:', membershipError);
        return { data: null, error: membershipError };
      }
      
      if (!teamMemberships || teamMemberships.length === 0) {
        // No teams found
        return { data: [], error: null };
      }
      
      // Get the actual team data for each membership
      const teamIds = teamMemberships.map(tm => tm.team_id);
      
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds);
      
      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        return { data: null, error: teamsError };
      }
      
      // Transform database records to our Team type and add role info
      const teams = teamsData.map(team => {
        const membership = teamMemberships.find(tm => tm.team_id === team.id);
        const transformed = transformTeamFromDb(team);
        return {
          ...transformed,
          userRole: membership?.role
        };
      });
      
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
    team: Partial<Team>,
    currentUserId: string
  ): Promise<{ data: Team | null; error: any }> => {
    try {
      // Start a transaction
      // First create the team
      const teamData = {
        name: team.name || '',
        description: team.description || '',
        logo_url: team.logoUrl || '',
        owner_id: currentUserId
      };
      
      const { data: teamResult, error: teamError } = await supabase
        .from('teams')
        .insert(teamData)
        .select()
        .single();
      
      if (teamError) {
        console.error('Error creating team:', teamError);
        toast.error('Failed to create team');
        return { data: null, error: teamError };
      }
      
      // Then add the creator as the owner
      const memberData = {
        team_id: teamResult.id,
        user_id: currentUserId,
        role: 'owner'
      };
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert(memberData);
      
      if (memberError) {
        console.error('Error adding team member:', memberError);
        // Try to clean up the team if member creation failed
        await supabase.from('teams').delete().eq('id', teamResult.id);
        toast.error('Failed to complete team setup');
        return { data: null, error: memberError };
      }
      
      const newTeam = transformTeamFromDb(teamResult);
      
      toast.success('Team created successfully');
      return { data: newTeam, error: null };
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
    updates: Partial<Team>
  ): Promise<{ data: Team | null; error: any }> => {
    try {
      // Convert to database field names
      const updateData: Record<string, any> = {};
      
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
      // This will automatically delete all team_members due to CASCADE
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
        .select('*, profiles:user_id(id, full_name, avatar_url, username)')
        .eq('team_id', teamId);
      
      if (error) {
        console.error('Error fetching team members:', error);
        return { data: null, error };
      }
      
      // Transform database records to our TeamMember type
      const members = data.map(record => ({
        id: record.id,
        teamId: record.team_id,
        userId: record.user_id,
        role: record.role,
        joinedAt: record.joined_at,
        // Add user profile info if available
        user: record.profiles ? {
          id: record.profiles.id,
          name: record.profiles.full_name,
          avatarUrl: record.profiles.avatar_url,
          username: record.profiles.username
        } : undefined
      })) as TeamMember[];
      
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
      const memberData = {
        team_id: teamId,
        user_id: userId,
        role: role
      };
      
      const { error } = await supabase
        .from('team_members')
        .insert(memberData);
      
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
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
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
  },

  /**
   * Update a team member's role
   */
  updateMemberRole: async (
    teamId: string,
    userId: string,
    role: 'admin' | 'member' | 'viewer'
  ): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('team_id', teamId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error updating member role:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in updateMemberRole:', err);
      return { success: false, error: err };
    }
  }
};

/**
 * Helper to transform database record to Team type
 */
function transformTeamFromDb(record: DbTeam): Team {
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
