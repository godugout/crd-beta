
import React from 'react';
import { Container } from '@/components/ui/container';

const CollectionGallery: React.FC = () => {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-8 mb-4">Collection Gallery</h1>
      <p className="text-gray-600">Browse through available collections.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Collection items will go here */}
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Collection items coming soon</p>
        </div>
      </div>
    </Container>
  );
};

export default CollectionGallery;
