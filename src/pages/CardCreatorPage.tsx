
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardCreator from '@/components/card-creation/CardCreator';

const CardCreatorPage: React.FC = () => {
  // Get the current path to determine if we're on the new experience path
  const currentPath = window.location.pathname;
  const isNewExperience = currentPath.includes('/card/create') || currentPath.includes('/cards/create');
  
  return (
    <PageLayout
      title="Welcome to your <span className='text-litmus-green'>CRD</span> collection!"
      description="Design your own custom trading cards with advanced effects and 3D visualization."
    >
      <div className="container mx-auto max-w-[1400px] px-4 pt-6 pb-20">
        <CardCreator />
      </div>
    </PageLayout>
  );
};

export default CardCreatorPage;
