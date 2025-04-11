
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamNotFoundSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button variant="outline" onClick={() => navigate('/baseball-archive')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Archive
      </Button>
      
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold">Team Not Found</h1>
        <p className="mt-2 text-gray-600">The team you're looking for doesn't exist.</p>
      </div>
    </>
  );
};

export default TeamNotFoundSection;
