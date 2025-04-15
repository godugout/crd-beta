
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const HomePage = () => {
  return (
    <PageLayout title="Home" description="Welcome to our card application">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Card App</h1>
        <p className="text-lg mb-4">
          Explore our collection of cards or create your own custom cards.
        </p>
      </div>
    </PageLayout>
  );
};

export default HomePage;
