
import React from 'react';
import { useParams } from 'react-router-dom';
import TeamNotFound from '@/components/teams/TeamNotFound';
import OaklandTeamPage from '@/components/teams/OaklandTeamPage';
import StandardTeamPage from '@/components/teams/StandardTeamPage';
import { Team } from '@/lib/types/teamTypes';

interface TeamPageProps {
  teamId?: string;
}

const TeamPage: React.FC<TeamPageProps> = ({ teamId: propTeamId }) => {
  const { teamId: paramTeamId } = useParams<{ teamId?: string }>();
  
  // Use teamId from props if provided, otherwise from URL params
  const teamId = propTeamId || paramTeamId;
  
  const teams: Team[] = [
    {
      id: 'oakland',
      name: 'Oakland A\'s',
      slug: 'oakland-athletics',
      city_id: 'oakland-city',
      sport: 'Baseball',
      league: 'MLB',
      division: 'AL West',
      founded_year: 1901,
      stadium: 'Oakland Coliseum',
      description: 'Oakland Athletics team page',
      logo_url: '/logo-oak.png',
      primary_color: '#006341',
      secondary_color: '#EFB21E',
      accent_color: '#FFFFFF',
      team_config: {
        features: ['walkman', 'protest_memories', 'mascot_gallery'],
        eras: ['early_years', 'dynasty_70s', 'bash_brothers', 'moneyball', 'playoff_runs', 'farewell'],
        theme: 'oakland'
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sf-giants',
      name: 'San Francisco Giants',
      slug: 'san-francisco-giants',
      city_id: 'sf-city',
      sport: 'Baseball',
      league: 'MLB',
      division: 'NL West',
      founded_year: 1883,
      stadium: 'Oracle Park',
      description: 'San Francisco Giants team page',
      logo_url: '/logo-sfg.png',
      primary_color: '#FD5A1E',
      secondary_color: '#27251F',
      accent_color: '#FFFFFF',
      team_config: {
        features: ['memories', 'community'],
        eras: ['ny_giants', 'early_sf', 'bonds_era', 'championship_decade'],
        theme: 'giants'
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // If we have a team ID, find the matching team
  if (teamId) {
    const team = teams.find(t => t.id === teamId);
    
    // Team not found
    if (!team) {
      return <TeamNotFound />;
    }
    
    // Oakland team page (with special features)
    if (teamId === 'oakland') {
      return <OaklandTeamPage team={team} />;
    }
    
    // Regular team page for other teams (just SF Giants for now)
    return <StandardTeamPage team={team} />;
  }
  
  // Fallback to TeamNotFound if no teamId is provided
  return <TeamNotFound />;
};

export default TeamPage;
