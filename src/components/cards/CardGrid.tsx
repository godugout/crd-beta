
import React from 'react';
import { Card } from '@/lib/types';
import CardGridItem from './CardGridItem';
import { cn } from '@/lib/utils';

interface CardGridProps {
  cards: Card[];
  onCardClick?: (id: string) => void;
  className?: string;
  columnCount?: number;
  gap?: 'sm' | 'md' | 'lg';
  emptyMessage?: string;
  isLoading?: boolean;
  loadingItemCount?: number;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  className,
  columnCount = 3,
  gap = 'md',
  emptyMessage = "No cards found",
  isLoading = false,
  loadingItemCount = 6
}) => {
  // Map gap size to tailwind classes
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };
  
  // Calculate grid columns based on columnCount
  const getGridColsClass = () => {
    // Ensure columnCount is a valid number
    const cols = typeof columnCount === 'number' && columnCount > 0 ? columnCount : 3;
    
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 5: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 6: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {isLoading ? (
        <div className={cn("grid", getGridColsClass(), gapClasses[gap])}>
          {Array.from({ length: loadingItemCount }).map((_, i) => (
            <div key={i} className="aspect-[2.5/3.5] bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : cards.length > 0 ? (
        <div className={cn("grid", getGridColsClass(), gapClasses[gap])}>
          {cards.map((card) => (
            <CardGridItem
              key={card.id}
              card={card}
              onClick={() => onCardClick?.(card.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default CardGrid;
