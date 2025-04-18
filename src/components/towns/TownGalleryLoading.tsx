
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TownGalleryLoading: React.FC = () => {
  // Create an array of 6 items to represent loading state cards
  const loadingItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loadingItems.map((item) => (
        <div key={item} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-24 w-full opacity-70" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-4 w-3/4 opacity-70" />
            <Skeleton className="h-4 w-full opacity-70" />
            <Skeleton className="h-4 w-2/3 opacity-70" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full opacity-70" />
              <Skeleton className="h-4 w-1/3 opacity-70" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 w-full opacity-70" />
              <Skeleton className="h-10 w-full opacity-70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TownGalleryLoading;
