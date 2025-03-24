
import React from 'react';
import { CardData } from '../types/BaseballCard';
import { Link } from 'react-router-dom';

interface CardNavigationProps {
  cards: CardData[];
  currentCardId: string;
}

const CardNavigation: React.FC<CardNavigationProps> = ({ cards, currentCardId }) => {
  return (
    <div className="absolute bottom-20 left-0 right-0 p-4">
      <div className="container mx-auto flex justify-center gap-2">
        {cards.map((card) => (
          <Link 
            key={card.id}
            to={`/baseball-card-viewer/${card.id}`}
            className={`w-3 h-3 rounded-full transition-all ${
              currentCardId === card.id ? 'bg-white scale-125' : 'bg-gray-500 hover:bg-gray-300'
            }`}
            aria-label={card.title}
          />
        ))}
      </div>
    </div>
  );
};

export default CardNavigation;
