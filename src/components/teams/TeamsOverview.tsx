
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import TeamCard from './TeamCard';
import GameDayCard from './GameDayCard';

interface TeamsOverviewProps {
  teams: Array<{
    id: string;
    name: string;
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    description: string;
  }>;
}

const TeamsOverview: React.FC<TeamsOverviewProps> = ({ teams }) => {
  return (
    <PageLayout
      title="Teams"
      description="Browse team pages and collections"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-gray-600">
            Browse teams and their card collections
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
          
          <GameDayCard />
        </div>
      </div>
    </PageLayout>
  );
};

export default TeamsOverview;
