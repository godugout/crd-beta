
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamDisplayData } from '@/types/teams';

export const useTeamGalleryData = (
  activeLeague: string,
  activeDivision: string
) => {
  const [teams, setTeams] = useState<TeamDisplayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      
      try {
        // Build query based on filters - only select fields that exist in the database
        let query = supabase.from('teams').select(`
          id, name, description, owner_id, created_at, updated_at, logo_url
        `);
        
        // Filters would need to be adjusted based on what fields actually exist
        
        const { data, error } = await query.order('name');
        
        if (error) {
          console.error('Error fetching teams:', error);
          setTeams([]);
          setLoading(false);
          return;
        }
        
        if (data && Array.isArray(data)) {
          // Transform the data to match our interface with safe defaults
          const transformedTeams: TeamDisplayData[] = data.map(teamData => {
            return {
              id: teamData.id,
              name: teamData.name,
              slug: teamData.name.toLowerCase().replace(/\s+/g, '-'),
              description: teamData.description || '',
              owner_id: teamData.owner_id,
              memberCount: Math.floor(Math.random() * 1500) + 500, // Placeholder member count
              primary_color: '#cccccc', // Default color
              secondary_color: undefined,
              founded_year: undefined,
              city: undefined,
              state: undefined,
              stadium: undefined,
              league: undefined,
              division: undefined
            };
          });
          setTeams(transformedTeams);
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
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
      owner_id: 'system'
    },
    { 
      id: '2', 
      name: 'San Francisco Giants', 
      slug: 'sf-giants', 
      description: 'A community for SF Giants fans to share their memories',
      primary_color: '#FD5A1E',
      memberCount: 984,
      owner_id: 'system'
    },
    { 
      id: '3', 
      name: 'Los Angeles Dodgers', 
      slug: 'la-dodgers', 
      description: 'Dodgers memories and moments from fans',
      primary_color: '#005A9C',
      memberCount: 756,
      owner_id: 'system'
    }
  ];

  const displayTeams = teams.length > 0 ? teams : fallbackTeams;

  return {
    teams: displayTeams,
    loading
  };
};

export default useTeamGalleryData;
