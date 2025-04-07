
import { supabase } from '@/integrations/supabase/client';
import { Team, TeamMember, User } from '../schema/types';
import { toast } from 'sonner';

/**
 * Repository for team-related data operations
 */
export const teamRepository = {
  /**
   * Get teams for a user
   */
  getUserTeams: async (userId: string): Promise<{ data: Team[] | null; error: any }> => {
    try {
      // Get teams where user is a member
      const { data: teamMembers, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId);
      
      if (memberError) {
        console.error('Error fetching team memberships:', memberError);
        return { data: null, error: memberError };
      }
      
      if (!teamMembers || teamMembers.length === 0) {
        return { data: [], error: null };
      }
      
      // Get all team data
      const teamIds = teamMembers.map(tm => tm.team_id);
      const { data: teams, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds);
      
      if (teamError) {
        console.error('Error fetching teams:', teamError);
        return { data: null, error: teamError };
      }
      
      if (!teams) {
        return { data: [], error: null };
      }
      
      const transformedTeams: Team[] = teams.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        logoUrl: team.logo_url,
        ownerId: team.owner_id,
        createdAt: team.created_at,
        updatedAt: team.updated_at
      }));
      
      return { data: transformedTeams, error: null };
    } catch (err) {
      console.error('Unexpected error in getUserTeams:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Create a new team
   */
  createTeam: async (name: string, description: string | undefined, ownerId: string): Promise<{ data: Team | null; error: any }> => {
    try {
      // Create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name,
          description,
          owner_id: ownerId
        })
        .select()
        .single();
      
      if (teamError) {
        console.error('Error creating team:', teamError);
        toast.error('Failed to create team');
        return { data: null, error: teamError };
      }
      
      if (!team) {
        return { data: null, error: new Error('No data returned from team creation') };
      }
      
      // Add owner as a team member with owner role
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: ownerId,
          role: 'owner'
        });
      
      if (memberError) {
        console.error('Error adding owner as team member:', memberError);
        // Not returning error here as the team was created
      }
      
      const newTeam: Team = {
        id: team.id,
        name: team.name,
        description: team.description,
        logoUrl: team.logo_url,
        ownerId: team.owner_id,
        createdAt: team.created_at,
        updatedAt: team.updated_at
      };
      
      toast.success('Team created successfully');
      return { data: newTeam, error: null };
    } catch (err) {
      console.error('Unexpected error in createTeam:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Get team details
   */
  getTeam: async (teamId: string): Promise<{ data: Team | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
      
      if (error) {
        console.error('Error fetching team:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: null, error: new Error('Team not found') };
      }
      
      const team: Team = {
        id: data.id,
        name: data.name,
        description: data.description,
        logoUrl: data.logo_url,
        ownerId: data.owner_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      return { data: team, error: null };
    } catch (err) {
      console.error('Unexpected error in getTeam:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Get team members
   */
  getTeamMembers: async (teamId: string): Promise<{ data: TeamMember[] | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id, 
          team_id, 
          user_id, 
          role, 
          joined_at,
          profiles:user_id (
            id, 
            full_name, 
            avatar_url, 
            username
          )
        `)
        .eq('team_id', teamId);
      
      if (error) {
        console.error('Error fetching team members:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: [], error: null };
      }
      
      const members: TeamMember[] = data.map(record => {
        const userData = record.profiles;
        let user: User | undefined = undefined;
        
        // Check if userData is valid before accessing it
        if (userData && typeof userData === 'object' && 'id' in userData) {
          user = {
            id: userData.id,
            email: '', // Email isn't returned from profiles for security
            name: userData.full_name,
            avatarUrl: userData.avatar_url,
            username: userData.username
          };
        }
        
        return {
          id: record.id,
          teamId: record.team_id,
          userId: record.user_id,
          role: record.role,
          joinedAt: record.joined_at,
          user
        };
      });
      
      return { data: members, error: null };
    } catch (err) {
      console.error('Unexpected error in getTeamMembers:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Add a member to a team
   */
  addTeamMember: async (
    teamId: string, 
    userId: string, 
    role: 'admin' | 'member' | 'viewer'
  ): Promise<{ success: boolean; error: any }> => {
    try {
      // First check if user is already in the team
      const { data: existing, error: checkError } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing team member:', checkError);
        return { success: false, error: checkError };
      }
      
      if (existing) {
        // Update existing member's role
        const { error: updateError } = await supabase
          .from('team_members')
          .update({ role })
          .eq('id', existing.id);
        
        if (updateError) {
          console.error('Error updating team member:', updateError);
          toast.error('Failed to update team member');
          return { success: false, error: updateError };
        }
      } else {
        // Add new team member
        const { error: insertError } = await supabase
          .from('team_members')
          .insert({
            team_id: teamId,
            user_id: userId,
            role
          });
        
        if (insertError) {
          console.error('Error adding team member:', insertError);
          toast.error('Failed to add team member');
          return { success: false, error: insertError };
        }
      }
      
      toast.success(existing ? 'Team member updated' : 'Team member added');
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in addTeamMember:', err);
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  },
  
  /**
   * Remove a member from a team
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
        toast.error('Failed to remove team member');
        return { success: false, error };
      }
      
      toast.success('Team member removed');
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in removeTeamMember:', err);
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  },
  
  /**
   * Update a team's details
   */
  updateTeam: async (teamId: string, updates: Partial<Team>): Promise<{ data: Team | null; error: any }> => {
    try {
      // Convert to database field names
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl;
      
      const { data, error } = await supabase
        .from('teams')
        .update(updateData)
        .eq('id', teamId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating team:', error);
        toast.error('Failed to update team');
        return { data: null, error };
      }
      
      if (!data) {
        return { data: null, error: new Error('No data returned from team update') };
      }
      
      const updatedTeam: Team = {
        id: data.id,
        name: data.name,
        description: data.description,
        logoUrl: data.logo_url,
        ownerId: data.owner_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      toast.success('Team updated successfully');
      return { data: updatedTeam, error: null };
    } catch (err) {
      console.error('Unexpected error in updateTeam:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  }
};
