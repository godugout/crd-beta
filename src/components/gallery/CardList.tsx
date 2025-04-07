
import React, { memo } from 'react';
import { Card } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Virtuoso } from 'react-virtuoso';
import { useInView } from 'react-intersection-observer';
import { EmptyState } from '../ui/card-components/EmptyState';

interface CardListProps {
  cards: Card[];
  onCardClick: (cardId: string) => void;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  useVirtualization?: boolean;
}

// Memoized individual card item component
const CardListItem = memo(({ 
  card, 
  onClick 
}: { 
  card: Card; 
  onClick: () => void 
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px'
  });

  return (
    <div 
      ref={ref}
      className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
      onClick={onClick}
    >
      <div className="w-24 h-24 flex-shrink-0">
        {inView && (
          <img 
            src={card.imageUrl} 
            alt={card.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-medium text-cardshow-dark">{card.title}</h3>
        <p className="text-sm text-cardshow-slate line-clamp-1">{card.description}</p>
        
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {card.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center text-xs bg-cardshow-blue-light text-cardshow-blue px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className="text-xs text-cardshow-slate">+{card.tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>
      <div className="p-4 flex items-center text-gray-400">
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  );
});

CardListItem.displayName = 'CardListItem';

// Skeleton for loading state
const CardListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse">
        <div className="w-24 h-24 bg-gray-200" />
        <div className="p-4 flex-grow">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="flex gap-2 mt-2">
            <div className="h-3 w-16 bg-gray-100 rounded-full" />
            <div className="h-3 w-12 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CardList: React.FC<CardListProps> = ({ 
  cards, 
  onCardClick,
  className = "",
  isLoading = false,
  error = null,
  useVirtualization = cards.length > 20
}) => {
  // Handle loading state
  if (isLoading) {
    return <CardListSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <EmptyState 
        title="Something went wrong"
        description={error.message || "Failed to load cards"}
        icon="AlertTriangle"
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
      />
    );
  }

  // Use virtualization for large lists
  if (useVirtualization) {
    return (
      <Virtuoso
        style={{ height: '600px' }}
        totalCount={cards.length}
        itemContent={index => (
          <div className="mb-4">
            <CardListItem
              card={cards[index]}
              onClick={() => onCardClick(cards[index].id)}
            />
          </div>
        )}
        className={className}
      />
    );
  }

  // Standard list for smaller lists
  return (
    <div className={cn(`space-y-4 ${className}`)}>
      {cards.map((card) => (
        <CardListItem
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
};

export default CardList;
