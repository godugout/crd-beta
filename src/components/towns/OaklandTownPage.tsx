
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import OaklandPromo from './OaklandPromo';
import OaklandFeaturesSection from './OaklandFeaturesSection';
import TownInfoSection from './TownInfoSection';
import TownHeader from './TownHeader';

interface OaklandTownPageProps {
  town: {
    name: string;
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    description: string;
  };
}

const OaklandTownPage: React.FC<OaklandTownPageProps> = ({ town }) => {
  return (
    <PageLayout title={town.name} description={town.description}>
      <div className="container mx-auto px-4 py-8">
        <TownHeader 
          name={town.name} 
          description={town.description}
          logo={town.logo} 
          primaryColor={town.primaryColor}
        />
        
        <OaklandPromo primaryColor={town.primaryColor} />
        <OaklandFeaturesSection primaryColor={town.primaryColor} />
        <TownInfoSection townName={town.name} />
      </div>
    </PageLayout>
  );
};

export default OaklandTownPage;
