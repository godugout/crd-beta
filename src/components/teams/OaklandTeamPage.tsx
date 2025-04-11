
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import OaklandPromo from './OaklandPromo';
import OaklandFeaturesSection from './OaklandFeaturesSection';
import TeamInfoSection from './TeamInfoSection';
import TeamHeader from './TeamHeader';

interface OaklandTeamPageProps {
  team: {
    name: string;
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    description: string;
  };
}

const OaklandTeamPage: React.FC<OaklandTeamPageProps> = ({ team }) => {
  return (
    <PageLayout title={team.name} description={team.description}>
      <div className="container mx-auto px-4 py-8">
        <TeamHeader 
          name={team.name} 
          description={team.description}
          logo={team.logo} 
          primaryColor={team.primaryColor}
        />
        
        <OaklandPromo primaryColor={team.primaryColor} />
        <OaklandFeaturesSection primaryColor={team.primaryColor} />
        <TeamInfoSection teamName={team.name} />
      </div>
    </PageLayout>
  );
};

export default OaklandTeamPage;
