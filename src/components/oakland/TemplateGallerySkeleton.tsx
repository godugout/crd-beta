
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TemplateGallerySkeleton: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-[#EFB21E]/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-32 mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-48 bg-gray-700" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 bg-gray-700" />
            <Skeleton className="h-8 w-16 bg-gray-700" />
          </div>
        </div>

        {/* Search Skeleton */}
        <Skeleton className="h-10 w-full mb-4 bg-gray-700" />

        {/* Category Filter Skeleton */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 bg-gray-700" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          {/* Section Skeletons */}
          {Array.from({ length: 3 }).map((_, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-48 bg-gray-700" />
                </div>
                <Skeleton className="h-8 w-20 bg-gray-700" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="aspect-[2.5/3.5] rounded-xl overflow-hidden border-2 border-[#EFB21E]/30"
                  >
                    <Skeleton className="w-full h-full bg-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallerySkeleton;
