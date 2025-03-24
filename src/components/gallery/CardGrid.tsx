
import React from 'react';
import { Card } from '@/lib/types';
import CardItem from '@/components/CardItem';

interface CardGridProps {
  cards: Card[];
  cardEffects: Record<string, string[]>;
  onCardClick: (cardId: string) => void;
  className?: string;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  cardEffects, 
  onCardClick,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="animate-scale-in transition-all duration-300"
          onClick={() => onCardClick(card.id)}
        >
          <CardItem 
            card={card}
            activeEffects={cardEffects[card.id] || []} 
          />
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
