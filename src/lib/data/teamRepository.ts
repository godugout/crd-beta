
import { supabase } from '@/lib/supabase';
import { TeamMember, User } from '@/lib/types';

export const teamRepository = {
  /**
   * Get team members for a specific team
   */
  async getTeamMembers(teamId: string) {
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
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId);
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const teamMembers: TeamMember[] = data.map(member => {
        // Create a user object with the profile data
        const user: User | undefined = member.profiles ? {
          id: member.profiles.id,
          email: member.profiles.email || '',
          displayName: member.profiles.full_name,
          name: member.profiles.full_name,
          avatarUrl: member.profiles.avatar_url,
          createdAt: '',  // These fields are required but not available from profiles
          updatedAt: ''   // These fields are required but not available from profiles
        } : undefined;
        
        return {
          id: member.id,
          teamId: member.team_id,
          userId: member.user_id,
          role: member.role,
          joinedAt: member.joined_at,
          user: user
        };
      });
      
      return { data: teamMembers, error: null };
    } catch (err) {
      console.error('Error getting team members:', err);
      return { data: null, error: 'Failed to get team members' };
    }
  },
  
  // Other team-related operations...
};
