
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import TeamGalleryCard from '@/components/teams/TeamGalleryCard';
import TeamGalleryFilters from '@/components/teams/TeamGalleryFilters';
import TeamGalleryLoading from '@/components/teams/TeamGalleryLoading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users } from 'lucide-react';
import useTeamGalleryData from '@/hooks/useTeamGalleryData';

const TeamGallery = () => {
  const [activeLeague, setActiveLeague] = useState<string>('all');
  const [activeDivision, setActiveDivision] = useState<string>('all');
  const { teams, loading, error } = useTeamGalleryData(activeLeague, activeDivision);
  
  return (
    <PageLayout title="Teams" description="Browse team memories and collections">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Baseball Teams</h1>
            <p className="text-gray-600 mt-2">Browse team memories and collections</p>
          </div>
        </div>
        
        {/* Filters */}
        <TeamGalleryFilters
          activeLeague={activeLeague}
          setActiveLeague={setActiveLeague}
          activeDivision={activeDivision}
          setActiveDivision={setActiveDivision}
        />
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Loading state */}
        {loading && <TeamGalleryLoading />}
        
        {/* Team grid */}
        {!loading && teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <TeamGalleryCard key={team.id} team={team} />
            ))}
          </div>
        )}
        
        {/* Empty state */}
        {!loading && teams.length === 0 && !error && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No teams found</p>
            <p className="text-gray-400">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TeamGallery;
