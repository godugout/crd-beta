
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Link } from 'react-router-dom';

const TeamNotFound = () => {
  return (
    <PageLayout title="Team Not Found" description="The requested team could not be found">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Team Not Found</h1>
        <p>The team you're looking for doesn't exist. Return to <Link to="/teams" className="text-blue-600 hover:underline">all teams</Link>.</p>
      </div>
    </PageLayout>
  );
};

export default TeamNotFound;
