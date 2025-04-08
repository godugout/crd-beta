
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';

const TeamEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-8 mb-4">Team Editor</h1>
      <p className="text-gray-600 mb-4">Editing team ID: {id}</p>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500">Team editing form coming soon</p>
      </div>
    </Container>
  );
};

export default TeamEditor;
