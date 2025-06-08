
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTeam } from '@/lib/hooks/useTeam';
import { useTeamTheme } from '@/lib/hooks/useTeamTheme';
import OaklandTeamPage from '@/components/teams/OaklandTeamPage';
import StandardTeamPage from '@/components/teams/StandardTeamPage';
import TeamNotFound from '@/components/teams/TeamNotFound';

const UniversalTeamPage: React.FC = () => {
  const { teamSlug } = useParams<{ teamSlug: string }>();
  const { team, loading, error } = useTeam(teamSlug);
  
  // Apply team-specific theming
  useTeamTheme(teamSlug);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-current"></div>
      </div>
    );
  }

  if (error || !team) {
    return <TeamNotFound />;
  }

  // Route to team-specific implementation based on config
  if (team.slug === 'oakland-athletics') {
    return <OaklandTeamPage team={team} />;
  }

  // Default to standard team page for other teams
  return <StandardTeamPage team={team} />;
};

export default UniversalTeamPage;
