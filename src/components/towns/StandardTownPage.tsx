
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import TownHeader from './TownHeader';
import TownInfoSection from './TownInfoSection';

interface StandardTownPageProps {
  town: {
    name: string;
    logo?: string;
    primaryColor: string;
    description: string;
  };
}

const StandardTownPage: React.FC<StandardTownPageProps> = ({ town }) => {
  return (
    <PageLayout title={town.name} description={town.description}>
      <div className="container mx-auto px-4 py-8">
        <TownHeader 
          name={town.name} 
          description={town.description}
          logo={town.logo}
          primaryColor={town.primaryColor} 
        />
        
        <TownInfoSection townName={town.name} />
      </div>
    </PageLayout>
  );
};

export default StandardTownPage;
