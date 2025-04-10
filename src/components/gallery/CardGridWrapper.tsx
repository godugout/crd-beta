
import React from 'react';
import { Card } from '@/lib/types';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardGrid } from '@/components/ui/card-components/CardGrid';
import { EmptyState } from '@/components/ui/card-components/EmptyState';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading cards...</p>
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
        icon="Inbox"
      />
    );
  }

  return (
    <CardGrid 
      cards={cards}
      onCardClick={onCardClick}
      getCardEffects={getCardEffects}
      useVirtualization={useVirtualization}
      isLoading={isLoading}
      error={error}
    />
  );
};
