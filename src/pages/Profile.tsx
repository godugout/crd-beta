
import React from 'react';
import { Container } from '@/components/ui/container';

const Profile: React.FC = () => {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-8 mb-4">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500">Profile information coming soon</p>
      </div>
    </Container>
  );
};

export default Profile;
