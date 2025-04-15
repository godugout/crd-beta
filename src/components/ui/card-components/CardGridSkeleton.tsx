
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface CardGridSkeletonProps {
  count?: number;
  columns?: number;
}

export const CardGridSkeleton = ({ count = 8, columns }: CardGridSkeletonProps) => {
  // Default grid classes based on screen size if not specified
  const gridCols = columns 
    ? `grid-cols-${columns}` 
    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  
  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          {/* Card skeleton with aspect ratio */}
          <Skeleton className="aspect-[2.5/3.5] w-full rounded-lg" />
          
          {/* Title skeleton */}
          <Skeleton className="h-4 w-3/4" />
          
          {/* Tags skeleton */}
          <div className="flex gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGridSkeleton;
