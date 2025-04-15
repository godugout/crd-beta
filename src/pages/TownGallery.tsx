
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import TownGalleryCard from '@/components/towns/TownGalleryCard';
import TownGalleryFilters from '@/components/towns/TownGalleryFilters';
import TownGalleryLoading from '@/components/towns/TownGalleryLoading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building } from 'lucide-react';
import useTownGalleryData from '@/hooks/useTownGalleryData';

const TownGallery = () => {
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const { towns, loading, error } = useTownGalleryData(activeRegion, activeType);
  
  return (
    <PageLayout title="Towns" description="Browse town memories and groups">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Towns Directory</h1>
            <p className="text-gray-600 mt-2">Browse town memories and groups</p>
          </div>
        </div>
        
        {/* Filters */}
        <TownGalleryFilters
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
          activeType={activeType}
          setActiveType={setActiveType}
        />
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Loading state */}
        {loading && <TownGalleryLoading />}
        
        {/* Town grid */}
        {!loading && towns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {towns.map(town => (
              <TownGalleryCard key={town.id} town={town} />
            ))}
          </div>
        )}
        
        {/* Empty state */}
        {!loading && towns.length === 0 && !error && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No towns found</p>
            <p className="text-gray-400">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TownGallery;
