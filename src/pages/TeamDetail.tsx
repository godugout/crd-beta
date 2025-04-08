
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';

const TeamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-8 mb-4">Team Detail</h1>
      <p className="text-gray-600 mb-4">Viewing team ID: {id}</p>
      <div className="bg-gray-100 p-8 rounded-lg">
        <p className="text-gray-500">Team details coming soon</p>
      </div>
    </Container>
  );
};

export default TeamDetail;
