
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const CardCollectionPage = () => {
  return (
    <PageLayout title="Card Collection" description="Browse our card collection">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Card Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card grid would go here */}
          <p>Card collection will be displayed here.</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardCollectionPage;
