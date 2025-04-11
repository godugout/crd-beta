
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardCreator from '@/components/card-creation/CardCreator';

const CardCreatorPage: React.FC = () => {
  return (
    <PageLayout
      title="Card Creator Studio"
      description="Design your own custom trading cards with advanced effects and 3D visualization."
      hideDefaultContainer
    >
      <div className="container mx-auto max-w-[1400px] px-4 pt-6 pb-20">
        <CardCreator />
      </div>
    </PageLayout>
  );
};

export default CardCreatorPage;
