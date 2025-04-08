
import React from 'react';
import CardMedia from './CardMedia';
import EmptyState from './EmptyState';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface CardGridProps {
  cards: Card[];
  cardEffects: string[];
  onCardClick: (id: string) => void;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, cardEffects, onCardClick, className }) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  if (cards.length === 0) {
    return <EmptyState 
      isEmpty={true} 
      isFiltered={false} 
      onRefresh={async () => {
        // Return a Promise
        return Promise.resolve();
      }} 
    />;
  }

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", className)}>
      {cards.map((card) => (
        <CardMedia
          key={card.id}
          card={card}
          onView={() => onCardClick(card.id)}
          className=""
        />
      ))}
    </div>
  );
};

export default CardGrid;
