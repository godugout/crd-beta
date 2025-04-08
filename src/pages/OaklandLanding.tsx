
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const OaklandLanding = () => {
  return (
    <PageLayout
      title="Oakland Memories"
      description="Preserve your memories of Oakland sports"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Oakland Memories</h1>
        <p>
          A special space dedicated to preserving memories of Oakland's teams and sports history.
        </p>
      </div>
    </PageLayout>
  );
};

export default OaklandLanding;
