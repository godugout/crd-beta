
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import CardMedia from './CardMedia';
import EmptyState from './EmptyState';

export interface CardGridProps {
  cards: Card[];
  onCardClick: (cardId: string) => void;
  getCardEffects?: (cardId: string) => string[];
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  getCardEffects,
  onCardClick, 
  className = '',
  isLoading = false,
  error = null
}) => {
  if (isLoading) {
    return (
      <div className={cn(`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`)}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="aspect-[2.5/3.5] bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return <EmptyState 
      isEmpty={false}
      isFiltered={false}
      onRefresh={async () => {
        window.location.reload();
        return Promise.resolve();
      }}
      title="Failed to load cards" 
      description={error.message || "An unexpected error occurred"} 
    />;
  }
  
  if (!cards || cards.length === 0) {
    return <EmptyState 
      isEmpty={true} 
      isFiltered={false} 
      onRefresh={async () => {
        console.log("Refreshing cards");
        return Promise.resolve();
      }} 
      title="No cards found"
      description="There are no cards in this collection yet."
    />;
  }

  return (
    <div className={cn(`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`)}>
      {cards.map((card) => {
        // Skip cards without images
        if (!card.imageUrl && !card.thumbnailUrl) {
          console.warn(`Card ${card.id} has no image URL`);
          return null;
        }
        
        return (
          <CardMedia
            key={card.id}
            card={card}
            onView={() => onCardClick(card.id)}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
          />
        );
      }).filter(Boolean)}
    </div>
  );
};

export default CardGrid;
