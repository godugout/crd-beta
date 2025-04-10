
import React from 'react';
import { Card } from '@/lib/types';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';

interface CardGridWrapperProps {
  cards: Card[];
  isLoading: boolean;
  error: Error | null;
  onCardClick: (cardId: string) => void;
  getCardEffects: (cardId: string) => string[];
  useVirtualization?: boolean;
}

export const CardGridWrapper: React.FC<CardGridWrapperProps> = ({ 
  cards,
  isLoading,
  error,
  onCardClick,
  getCardEffects,
  useVirtualization
}) => {
  const onRetry = () => {
    window.location.reload();
  };

  // Check for empty image URLs
  React.useEffect(() => {
    if (!isLoading && cards.length > 0) {
      let missingImageCount = 0;
      cards.forEach(card => {
        if (!card.imageUrl && !card.thumbnailUrl) {
          missingImageCount++;
          console.warn(`Card missing image: ${card.id} - ${card.title}`);
        }
      });
      if (missingImageCount > 0) {
        console.warn(`${missingImageCount} cards are missing images`);
      }
    }
  }, [cards, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-red-500">
          <AlertOctagon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load cards</h3>
        <p className="text-gray-600 mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // If no cards, show empty state
  if (cards.length === 0) {
    return (
      <EmptyState
        title="No cards found"
        description="Try adjusting your filters or create a new card"
        isEmpty={true}
        isFiltered={false}
        onRefresh={async () => {
          window.location.reload();
          return Promise.resolve();
        }}
      />
    );
  }

  return (
    <CardGrid 
      cards={cards}
      onCardClick={onCardClick}
      getCardEffects={getCardEffects}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default CardGridWrapper;
