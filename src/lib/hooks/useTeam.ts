
import { useState, useEffect } from 'react';
import { Team } from '@/lib/types/teamTypes';
import { getTeamConfig, hasTeamFeature, getTeamColors } from '@/lib/config/teamConfigs';

export const useTeam = (teamSlug?: string) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamSlug) {
      setLoading(false);
      return;
    }

    // TODO: Replace with actual API call to fetch team data
    // For now, we'll use mock data
    const fetchTeam = async () => {
      try {
        setLoading(true);
        
        // Mock team data - replace with actual Supabase call
        const mockTeam: Team = {
          id: `${teamSlug}-id`,
          name: teamSlug === 'oakland-athletics' ? 'Oakland Athletics' : 'San Francisco Giants',
          slug: teamSlug,
          city_id: 'city-id',
          sport: 'Baseball',
          league: 'MLB',
          division: teamSlug === 'oakland-athletics' ? 'AL West' : 'NL West',
          founded_year: teamSlug === 'oakland-athletics' ? 1901 : 1883,
          stadium: teamSlug === 'oakland-athletics' ? 'Oakland Coliseum' : 'Oracle Park',
          description: teamSlug === 'oakland-athletics' ? 'The last team standing in Oakland' : 'San Francisco Giants - Even Year Magic',
          logo_url: '',
          primary_color: teamSlug === 'oakland-athletics' ? '#003831' : '#FD5A1E',
          secondary_color: teamSlug === 'oakland-athletics' ? '#EFB21E' : '#27251F',
          accent_color: '#FFFFFF',
          team_config: getTeamConfig(teamSlug),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setTeam(mockTeam);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch team');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamSlug]);

  const hasFeature = (feature: string) => {
    return team ? hasTeamFeature(team.slug, feature) : false;
  };

  const getColors = () => {
    return team ? getTeamColors(team.slug) : null;
  };

  return {
    team,
    loading,
    error,
    hasFeature,
    getColors
  };
};
