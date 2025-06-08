
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTeam } from '@/lib/hooks/useTeam';
import OaklandMemoryGallery from '@/components/oakland/OaklandMemoryGallery';

const TeamMemoriesGallery: React.FC = () => {
  const { teamSlug } = useParams<{ teamSlug: string }>();
  const { team, loading } = useTeam(teamSlug);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-current"></div>
      </div>
    );
  }

  // For Oakland Athletics, use the specialized Oakland Memory Gallery
  if (team?.slug === 'oakland-athletics') {
    return <OaklandMemoryGallery />;
  }

  // For other teams, show a coming soon message for now
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Fan Memories</h1>
        <p className="text-gray-400 mb-8">
          Memory gallery for {team?.name} is coming soon!
        </p>
      </div>
    </div>
  );
};

export default TeamMemoriesGallery;
