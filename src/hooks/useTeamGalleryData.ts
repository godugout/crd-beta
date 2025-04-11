
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamDisplayData } from '@/types/teams';
import { PostgrestError } from '@supabase/supabase-js';

export const useTeamGalleryData = (
  activeLeague: string,
  activeDivision: string
) => {
  const [teams, setTeams] = useState<TeamDisplayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query based on filters
        let query = supabase
          .from('teams')
          .select(`
            id, name, description, owner_id, created_at, updated_at, 
            logo_url, primary_color, secondary_color, founded_year, 
            city, state, stadium, league, division,
            team_members!team_id (count)
          `);
        
        // Apply filters if provided
        if (activeLeague && activeLeague !== 'all') {
          query = query.eq('league', activeLeague);
        }
        
        if (activeDivision && activeDivision !== 'all') {
          query = query.eq('division', activeDivision);
        }
        
        const { data, error } = await query.order('name');
        
        if (error) {
          console.error('Error fetching teams:', error);
          setError('Failed to load teams. Please try again later.');
          setTeams([]);
          return;
        }
        
        if (data && Array.isArray(data)) {
          // Transform the data to match our interface
          const transformedTeams: TeamDisplayData[] = data.map(teamData => {
            const memberCount = teamData.team_members?.[0]?.count || 0;
            
            return {
              id: teamData.id,
              name: teamData.name,
              slug: teamData.name?.toLowerCase().replace(/\s+/g, '-') || '',
              description: teamData.description || '',
              owner_id: teamData.owner_id,
              memberCount: memberCount,
              primary_color: teamData.primary_color || '#cccccc',
              secondary_color: teamData.secondary_color,
              founded_year: teamData.founded_year,
              city: teamData.city,
              state: teamData.state,
              stadium: teamData.stadium,
              league: teamData.league,
              division: teamData.division
            };
          });
          setTeams(transformedTeams);
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('An unexpected error occurred. Please try again later.');
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [activeLeague, activeDivision]);

  // If we don't have team data yet, use the hardcoded data as a fallback
  const fallbackTeams: TeamDisplayData[] = [
    { 
      id: '1', 
      name: 'Oakland A\'s', 
      slug: 'oakland', 
      description: 'Memories and cards for Oakland Athletics fans',
      primary_color: '#006341',
      memberCount: 1243,
      owner_id: 'system',
      league: 'American League',
      division: 'West'
    },
    { 
      id: '2', 
      name: 'San Francisco Giants', 
      slug: 'sf-giants', 
      description: 'A community for SF Giants fans to share their memories',
      primary_color: '#FD5A1E',
      memberCount: 984,
      owner_id: 'system',
      league: 'National League',
      division: 'West'
    },
    { 
      id: '3', 
      name: 'Los Angeles Dodgers', 
      slug: 'la-dodgers', 
      description: 'Dodgers memories and moments from fans',
      primary_color: '#005A9C',
      memberCount: 756,
      owner_id: 'system',
      league: 'National League',
      division: 'West'
    }
  ];

  // Only use fallback if we have no teams and no error
  const displayTeams = teams.length > 0 || error ? teams : fallbackTeams;

  return {
    teams: displayTeams,
    loading,
    error
  };
};

export default useTeamGalleryData;
