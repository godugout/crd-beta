
import React from 'react';
import { Team } from '@/lib/types/teamTypes';
import OaklandHomepage from '@/components/oakland/OaklandHomepage';

interface OaklandTeamPageProps {
  team: Team;
}

const OaklandTeamPage: React.FC<OaklandTeamPageProps> = ({ team }) => {
  // Use the existing Oakland homepage but pass team context
  return <OaklandHomepage team={team} />;
};

export default OaklandTeamPage;
