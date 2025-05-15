import React, { useState, useEffect, memo } from 'react';
import { Virtuoso, Components } from 'react-virtuoso';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Card } from '@/lib/types/cardTypes';
import CardItem from './CardItem';
import EmptyState from '../EmptyState';
import { useInView } from 'react-intersection-observer';

// Card loading skeleton
const CardSkeleton: React.FC = () => (
  <div className="rounded-lg overflow-hidden bg-gray-800/30 animate-pulse">
    <div className="aspect-[2.5/3.5] bg-gray-700/50"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
    </div>
  </div>
);

interface CardGridProps {
  cards: Card[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onCardClick?: (card: Card) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingCount?: number;
  className?: string;
  cardClassName?: string;
  virtualized?: boolean;
  height?: number | string;
  columns?: number;
}

// Define the interface for the List component props that matches what Virtuoso expects
interface ListComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const MemoizedCardItem = memo(CardItem);

export const CardGrid = ({
  cards,
  isLoading = false,
  emptyMessage = "No cards found",
  emptyIcon,
  onCardClick,
  onLoadMore,
  hasMore = false,
  loadingCount = 6,
  className = "",
  cardClassName = "",
  virtualized = false,
  height = "80vh",
  columns = 2
}: CardGridProps) => {
  
  const [loadedCards, setLoadedCards] = useState<Card[]>(cards);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1023px)');
  
  // Load more trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });
  
  useEffect(() => {
    if (inView && hasMore && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore, isLoading]);
  
  useEffect(() => {
    setLoadedCards(cards);
  }, [cards]);
  
  // Check if we should use virtualization
  const shouldVirtualize = virtualized && loadedCards.length > 20;
  
  // Determine grid columns based on screen size and props
  const getColsClass = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return columns > 2 ? 'grid-cols-2' : `grid-cols-${columns}`;
    return `grid-cols-${Math.min(columns, 5)}`; // Cap at 5 columns on desktop
  };
  
  const gridCols = getColsClass();

  // If loading and no cards yet, show skeletons
  if (isLoading && loadedCards.length === 0) {
    return (
      <div className={cn(`grid gap-4 ${gridCols}`, className)}>
        {Array(loadingCount).fill(0).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // If no cards and not loading, show empty state
  if (loadedCards.length === 0 && !isLoading) {
    return (
      <EmptyState 
        message={emptyMessage}
        icon={emptyIcon}
      />
    );
  }

  // Render cards with virtualization for better performance with large lists
  if (shouldVirtualize) {
    // Create a typed List component for Virtuoso that satisfies the ComponentType requirements
    const ListComponent = React.forwardRef<HTMLDivElement, ListComponentProps>(
      ({style, children, ...rest}, ref) => (
        <div 
          ref={ref}
          style={style} 
          className={cn(`grid gap-4 ${gridCols}`, className)}
          {...rest}
        >
          {children}
        </div>
      )
    );
    
    // Type assertion to convince TypeScript that our component matches Virtuoso's expectations
    const components: Components = {
      List: ListComponent as any
    };

    return (
      <Virtuoso
        style={{ height }}
        data={loadedCards}
        endReached={hasMore && onLoadMore ? onLoadMore : undefined}
        overscan={1000}
        itemContent={(index, card) => (
          <MemoizedCardItem 
            key={card.id} 
            card={card} 
            onClick={() => onCardClick?.(card)} 
            className={cardClassName}
          />
        )}
        className={className}
        components={components}
      />
    );
  }

  // Standard grid without virtualization
  return (
    <div className={cn(`grid gap-4 ${gridCols}`, className)}>
      {loadedCards.map((card) => (
        <MemoizedCardItem 
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
          className={cardClassName}
        />
      ))}
      
      {isLoading && (
        <>
          {Array(loadingCount).fill(0).map((_, i) => (
            <CardSkeleton key={`loading-${i}`} />
          ))}
        </>
      )}
      
      {hasMore && onLoadMore && (
        <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center">
          {isLoading && <div className="loading-spinner" />}
        </div>
      )}
    </div>
  );
};

export default CardGrid;
