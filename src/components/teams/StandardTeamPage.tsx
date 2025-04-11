
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import TeamHeader from './TeamHeader';
import TeamInfoSection from './TeamInfoSection';

interface StandardTeamPageProps {
  team: {
    name: string;
    logo?: string;
    primaryColor: string;
    description: string;
  };
}

const StandardTeamPage: React.FC<StandardTeamPageProps> = ({ team }) => {
  return (
    <PageLayout title={team.name} description={team.description}>
      <div className="container mx-auto px-4 py-8">
        <TeamHeader 
          name={team.name} 
          description={team.description}
          logo={team.logo}
          primaryColor={team.primaryColor} 
        />
        
        <TeamInfoSection teamName={team.name} />
      </div>
    </PageLayout>
  );
};

export default StandardTeamPage;
