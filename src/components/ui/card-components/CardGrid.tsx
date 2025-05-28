
import React, { memo } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Virtuoso } from 'react-virtuoso';
import { CardItem } from './CardItem';
import { CardGridSkeleton } from './CardGridSkeleton';
import { EmptyState } from './EmptyState';

interface CardGridProps {
  cards: Card[];
  isLoading?: boolean;
  error?: Error | null;
  onCardClick?: (cardId: string) => void;
  className?: string;
  useVirtualization?: boolean;
  getCardEffects?: (cardId: string) => string[];
  height?: string;
  columns?: number;
}

const MemoizedCardItem = memo(CardItem);

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
  const shouldVirtualize = useVirtualization ?? cards.length > 20;
  
  const gridCols = columns 
    ? `grid-cols-${columns}` 
    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  
  if (isLoading) {
    return <CardGridSkeleton columns={columns} />;
  }
  
  if (error) {
    return (
      <EmptyState 
        title="Something went wrong"
        description={error.message || "Failed to load cards"}
        icon="AlertTriangle"
        onRefresh={async () => {
          return Promise.resolve();
        }}
      />
    );
  }
  
  if (cards.length === 0) {
    return (
      <EmptyState 
        title="No cards found"
        description="Try adjusting your filters or create a new card"
        icon="Inbox"
        onRefresh={async () => {
          return Promise.resolve();
        }}
      />
    );
  }

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
          List: ({ style, children, ...props }) => (
            <div 
              style={style} 
              className={cn(`grid gap-4 ${gridCols}`, className)}
              {...props}
            >
              {children}
            </div>
          )
        }}
      />
    );
  }
  
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
