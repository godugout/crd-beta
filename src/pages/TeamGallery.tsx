
import React from 'react';
import { Container } from '@/components/ui/container';

const TeamGallery: React.FC = () => {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-8 mb-4">Team Gallery</h1>
      <p className="text-gray-600 mb-4">Browse through available teams.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Team items will go here */}
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Team items coming soon</p>
        </div>
      </div>
    </Container>
  );
};

export default TeamGallery;
