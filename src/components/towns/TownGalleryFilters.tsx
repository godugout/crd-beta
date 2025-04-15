
import React from 'react';
import { Button } from '@/components/ui/button';

interface TownGalleryFiltersProps {
  activeRegion: string;
  setActiveRegion: (region: string) => void;
  activeType: string;
  setActiveType: (type: string) => void;
}

const TownGalleryFilters: React.FC<TownGalleryFiltersProps> = ({
  activeRegion,
  setActiveRegion,
  activeType,
  setActiveType
}) => {
  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'west', name: 'West Coast' },
    { id: 'east', name: 'East Coast' },
    { id: 'central', name: 'Central' }
  ];

  const types = [
    { id: 'all', name: 'All Types' },
    { id: 'sports', name: 'Sports' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'historical', name: 'Historical' }
  ];

  return (
    <div className="mb-6 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Filter by Region:</h3>
        <div className="flex flex-wrap gap-2">
          {regions.map(region => (
            <Button
              key={region.id}
              variant={activeRegion === region.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveRegion(region.id)}
            >
              {region.name}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Filter by Type:</h3>
        <div className="flex flex-wrap gap-2">
          {types.map(type => (
            <Button
              key={type.id}
              variant={activeType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(type.id)}
            >
              {type.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TownGalleryFilters;
