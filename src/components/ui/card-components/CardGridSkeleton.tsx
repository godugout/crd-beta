
import React from 'react';
import { cn } from '@/lib/utils';

interface CardGridSkeletonProps {
  /**
   * Number of skeleton items to display
   * @default 8
   */
  count?: number;
  
  /**
   * Number of columns in the grid
   */
  columns?: number;
  
  /**
   * Optional class names to apply to the container
   */
  className?: string;
}

export const CardGridSkeleton = ({
  count = 8,
  columns,
  className = ""
}: CardGridSkeletonProps) => {
  // Default grid columns based on screen size if not specified
  const gridCols = columns 
    ? `grid-cols-${columns}` 
    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={cn(`grid gap-4 ${gridCols}`, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-[2.5/3.5] rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
      ))}
    </div>
  );
};
