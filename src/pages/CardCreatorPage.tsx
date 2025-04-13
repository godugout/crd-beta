
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardMakerWizard from '@/components/card-creation/CardMakerWizard';

const CardCreatorPage: React.FC = () => {
  return (
    <PageLayout
      title="Create a <span className='text-litmus-green'>CRD</span>"
      description="Design your own custom trading cards with advanced effects and 3D visualization."
    >
      <div className="container mx-auto max-w-[1400px] px-4 pt-6 pb-20">
        <CardMakerWizard />
      </div>
    </PageLayout>
  );
};

export default CardCreatorPage;
