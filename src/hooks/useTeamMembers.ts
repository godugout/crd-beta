
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/types/teams';

export const useTeamMembers = (teamId?: string) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamMembers = async () => {
      setIsLoading(true);
      setError(null);

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
          throw error;
        }

        const formattedMembers: TeamMember[] = data.map((member) => ({
          id: member.id,
          teamId: member.team_id,
          userId: member.user_id,
          role: member.role,
          joinedAt: member.joined_at,
          user: member.profiles ? {
            id: member.profiles.id,
            displayName: member.profiles.full_name || member.profiles.username || 'Unknown User',
            avatarUrl: member.profiles.avatar_url
          } : undefined
        }));

        setMembers(formattedMembers);
      } catch (err: any) {
        console.error('Error fetching team members:', err);
        setError(err.message || 'Failed to fetch team members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [teamId]);

  return { members, isLoading, error };
};

export default useTeamMembers;
