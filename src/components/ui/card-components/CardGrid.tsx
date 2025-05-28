
import React, { memo } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Virtuoso } from 'react-virtuoso';
import { CardItem } from './CardItem';
import { CardGridSkeleton } from './CardGridSkeleton';
import { EmptyState } from './EmptyState';

interface CardGridProps {
  /**
   * Array of cards to display
   */
  cards: Card[];
  
  /**
   * Optional loading state
   */
  isLoading?: boolean;
  
  /**
   * Optional error state
   */
  error?: Error | null;
  
  /**
   * Optional callback for when a card is clicked
   */
  onCardClick?: (cardId: string) => void;
  
  /**
   * Optional classnames to apply to the container
   */
  className?: string;
  
  /**
   * Whether to use virtualization for performance with many items
   * @default true when cards.length > 20
   */
  useVirtualization?: boolean;
  
  /**
   * Function to get active effects for a card
   */
  getCardEffects?: (cardId: string) => string[];
  
  /**
   * Height of the grid container when using virtualization
   * @default "600px"
   */
  height?: string;
  
  /**
   * Number of columns to display in the grid
   * @default 2 on mobile, 4 on desktop
   */
  columns?: number;
}

const MemoizedCardItem = memo(CardItem);

interface ListComponentProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const CardGrid = ({
  cards,
  isLoading = false,
  error = null,
  onCardClick,
  className = "",
  useVirtualization,
  getCardEffects = () => [],
  height = "600px",
  columns
}: CardGridProps) => {
  // Determine if virtualization should be used based on card count
  const shouldVirtualize = useVirtualization ?? cards.length > 20;
  
  // Default grid columns based on screen size if not specified
  const gridCols = columns 
    ? `grid-cols-${columns}` 
    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  
  // Handle loading state
  if (isLoading) {
    return <CardGridSkeleton columns={columns} />;
  }
  
  // Handle error state
  if (error) {
    return (
      <EmptyState 
        title="Something went wrong"
        description={error.message || "Failed to load cards"}
        icon="AlertTriangle"
        onRefresh={async () => {
          // Return a Promise
          return Promise.resolve();
        }}
      />
    );
  }
  
  // Handle empty state
  if (cards.length === 0) {
    return (
      <EmptyState 
        title="No cards found"
        description="Try adjusting your filters or create a new card"
        icon="Inbox"
        onRefresh={async () => {
          // Return a Promise
          return Promise.resolve();
        }}
      />
    );
  }

  // Render cards with virtualization for better performance with large lists
  if (shouldVirtualize) {
    return (
      <Virtuoso
        style={{ height }}
        totalCount={cards.length}
        overscan={200}
        itemContent={index => (
          <MemoizedCardItem
            card={cards[index]}
            onClick={() => onCardClick?.(cards[index].id)}
            activeEffects={getCardEffects(cards[index].id)}
          />
        )}
        className={className}
        components={{
          List: React.forwardRef((props: ListComponentProps, ref) => (
            <div 
              ref={ref as any} 
              style={props.style} 
              className={cn(`grid gap-4 ${gridCols}`, className)}
            >
              {props.children}
            </div>
          ))
        }}
      />
    );
  }
  
  // Standard grid for smaller lists
  return (
    <div className={cn(`grid gap-4 ${columns ? `grid-cols-${columns}` : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`, className)}>
      {cards.map((card) => (
        <MemoizedCardItem
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card.id)}
          activeEffects={getCardEffects(card.id)}
        />
      ))}
    </div>
  );
};

export { CardGrid as default };
