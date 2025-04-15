
import React from 'react';
import { useParams } from 'react-router-dom';
import TeamNotFound from '@/components/teams/TeamNotFound';
import OaklandTeamPage from '@/components/teams/OaklandTeamPage';
import StandardTeamPage from '@/components/teams/StandardTeamPage';

interface TeamPageProps {
  teamId?: string;
}

const TeamPage: React.FC<TeamPageProps> = ({ teamId: propTeamId }) => {
  const { teamId: paramTeamId } = useParams<{ teamId?: string }>();
  
  // Use teamId from props if provided, otherwise from URL params
  const teamId = propTeamId || paramTeamId;
  
  const teams = [
    {
      id: 'oakland',
      name: 'Oakland A\'s',
      logo: '/logo-oak.png',
      primaryColor: '#006341',
      secondaryColor: '#EFB21E',
      description: 'Oakland Athletics team page'
    },
    {
      id: 'sf-giants',
      name: 'San Francisco Giants',
      logo: '/logo-sfg.png',
      primaryColor: '#FD5A1E',
      secondaryColor: '#27251F',
      description: 'San Francisco Giants team page'
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
