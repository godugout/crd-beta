
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const OaklandLanding = () => {
  return (
    <PageLayout
      title="Oakland Sports History"
      description="Celebrating Oakland's rich sports legacy"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Oakland Sports Legacy Project</h1>
          <p className="text-xl mb-8">
            Preserving and celebrating the rich sports history of Oakland through memories, memorabilia and fan experiences
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default OaklandLanding;
