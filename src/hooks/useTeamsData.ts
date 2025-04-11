
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  memberCount?: number;
  ownerId: string;
  createdAt: string;
  tags?: string[];
}

export const useTeamsData = () => {
  const [teams, setTeams] = useState<Team[]>([]);
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
      
      const formattedTeams: Team[] = data.map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.description || '',
        logoUrl: team.logo_url || '',
        memberCount: team.team_members?.[0]?.count || 0,
        ownerId: team.owner_id,
        createdAt: team.created_at,
        tags: team.tags || [],
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
