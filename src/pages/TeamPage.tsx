
import React from 'react';
import { useParams } from 'react-router-dom';
import TeamNotFound from '@/components/teams/TeamNotFound';
import OaklandTeamPage from '@/components/teams/OaklandTeamPage';
import StandardTeamPage from '@/components/teams/StandardTeamPage';
import TeamsOverview from '@/components/teams/TeamsOverview';

const TeamPage = () => {
  const { teamId } = useParams<{ teamId?: string }>();
  
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

  // If we are viewing a specific team page
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
    
    // Regular team page
    return <StandardTeamPage team={team} />;
  }
  
  // Teams overview page (when no specific team is selected)
  return <TeamsOverview teams={teams} />;
};

export default TeamPage;
