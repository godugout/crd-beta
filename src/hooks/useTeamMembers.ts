
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
        // First query to properly get team members
        const { data: memberData, error: memberError } = await supabase
          .from('team_members')
          .select(`
            id,
            team_id,
            user_id,
            role,
            joined_at
          `)
          .eq('team_id', teamId);

        if (memberError) {
          throw memberError;
        }

        // If we have team members, fetch their profile data separately
        if (memberData && memberData.length > 0) {
          const userIds = memberData.map(member => member.user_id);
          
          // Query profiles for these users
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select(`
              id,
              full_name,
              avatar_url,
              username
            `)
            .in('id', userIds);

          if (profilesError) {
            throw profilesError;
          }

          // Create a map of profile data by user ID for easy lookup
          const profilesMap = new Map();
          if (profilesData) {
            profilesData.forEach(profile => {
              profilesMap.set(profile.id, profile);
            });
          }

          // Combine member data with profile data
          const formattedMembers: TeamMember[] = memberData.map((member) => {
            const profile = profilesMap.get(member.user_id);
            
            return {
              id: member.id,
              teamId: member.team_id,
              userId: member.user_id,
              role: member.role,
              joinedAt: member.joined_at,
              user: profile ? {
                id: profile.id,
                displayName: profile.full_name || profile.username || 'Unknown User',
                avatarUrl: profile.avatar_url
              } : undefined
            };
          });

          setMembers(formattedMembers);
        } else {
          // No members found
          setMembers([]);
        }
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
