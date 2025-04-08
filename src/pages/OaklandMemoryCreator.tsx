
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const OaklandMemoryCreator = () => {
  return (
    <PageLayout
      title="Create Oakland Memory"
      description="Preserve your memories of Oakland sports"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create Oakland Memory</h1>
        <p>
          Create and preserve your personal memories related to Oakland's sports teams.
        </p>
      </div>
    </PageLayout>
  );
};

export default OaklandMemoryCreator;
