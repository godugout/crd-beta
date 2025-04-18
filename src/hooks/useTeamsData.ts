
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TeamDisplayData } from '@/types/teams';

export const useTeamsData = () => {
  const [teams, setTeams] = useState<TeamDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(count)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const formattedTeams: TeamDisplayData[] = data.map((team: any) => ({
        id: team.id,
        name: team.name,
        slug: team.team_code?.toLowerCase() || team.id,
        description: team.description || '',
        imageUrl: team.logo_url || '',
        memberCount: team.team_members?.[0]?.count || 0,
        owner_id: team.owner_id,
        primary_color: team.primary_color,
        secondary_color: team.secondary_color,
        founded_year: team.founded_year,
        city: team.city,
        state: team.state,
        league: team.league,
        division: team.division,
        stadium: team.stadium
      }));
      
      setTeams(formattedTeams);
      if (formattedTeams.length > 0) {
        toast.success(`Loaded ${formattedTeams.length} teams`);
      }
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message || 'Failed to fetch teams');
      toast.error('Failed to fetch teams');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    isLoading,
    error,
    fetchTeams
  };
};

export default useTeamsData;
