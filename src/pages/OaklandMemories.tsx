
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const OaklandMemories = () => {
  return (
    <PageLayout
      title="Oakland Memories Collection"
      description="Browse memories from Oakland's sports history"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Oakland Memories Collection</h1>
        <p>
          Browse and explore memories from Oakland's rich sports history.
        </p>
      </div>
    </PageLayout>
  );
};

export default OaklandMemories;
