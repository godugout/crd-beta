
import { useState, useEffect } from 'react';
import { TeamDisplayData } from '@/types/teams';

interface FilterOptions {
  league?: string;
  division?: string;
  searchQuery?: string;
  // Add other filter options as needed
}

interface SortOptions {
  field?: string;
  direction?: 'asc' | 'desc';
}

const useTeamGalleryData = (filterOptions: FilterOptions = {}, sortOptions: SortOptions = {}) => {
  const [teams, setTeams] = useState<TeamDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data for now
        // In a real app, you'd make an actual API call here
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTeams: TeamDisplayData[] = [
          {
            id: '1',
            name: 'Oakland Athletics',
            slug: 'oakland-athletics',
            description: 'MLB team based in Oakland, California',
            imageUrl: '/lovable-uploads/88d804c5-6d0c-402e-b2d6-f0d10b5f6699.png',
            league: 'MLB',
            division: 'AL West',
            memberCount: 43,
            owner_id: 'user-123'
          },
          {
            id: '2',
            name: 'San Francisco Giants',
            slug: 'sf-giants',
            description: 'MLB team based in San Francisco, California',
            imageUrl: '/lovable-uploads/c23d9e1a-4645-4f50-a9e4-2a325e3b4a4d.png',
            league: 'MLB',
            division: 'NL West',
            memberCount: 51,
            owner_id: 'user-456'
          }
        ];
        
        // Apply filters if any
        let filteredTeams = [...mockTeams];
        
        if (filterOptions.league) {
          filteredTeams = filteredTeams.filter(team => 
            team.league?.toLowerCase() === filterOptions.league?.toLowerCase()
          );
        }
        
        if (filterOptions.division) {
          filteredTeams = filteredTeams.filter(team => 
            team.division?.toLowerCase() === filterOptions.division?.toLowerCase()
          );
        }
        
        if (filterOptions.searchQuery) {
          const query = filterOptions.searchQuery.toLowerCase();
          filteredTeams = filteredTeams.filter(team => 
            team.name.toLowerCase().includes(query) || 
            team.description?.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting if specified
        if (sortOptions.field) {
          filteredTeams.sort((a: any, b: any) => {
            const fieldA = a[sortOptions.field as keyof TeamDisplayData];
            const fieldB = b[sortOptions.field as keyof TeamDisplayData];
            
            if (!fieldA || !fieldB) return 0;
            
            const comparison = fieldA > fieldB ? 1 : -1;
            return sortOptions.direction === 'desc' ? -comparison : comparison;
          });
        }
        
        setTeams(filteredTeams);
        setError(null);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [filterOptions, sortOptions]);

  return { teams, loading, error };
};

export default useTeamGalleryData;
