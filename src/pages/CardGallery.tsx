
import React from 'react';
import { Container } from '@/components/ui/container';

const CardGallery: React.FC = () => {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-8 mb-4">Card Gallery</h1>
      <p className="text-gray-600 mb-4">Browse through available cards.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Card items will go here */}
        <div className="bg-gray-100 aspect-[2.5/3.5] rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Cards coming soon</p>
        </div>
      </div>
    </Container>
  );
};

export default CardGallery;
