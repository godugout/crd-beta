
import React from 'react';
import { Card } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface CardListProps {
  cards: Card[];
  onCardClick: (cardId: string) => void;
  className?: string;
}

const CardList: React.FC<CardListProps> = ({ 
  cards, 
  onCardClick,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {cards.map((card) => (
        <div 
          key={card.id}
          className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          onClick={() => onCardClick(card.id)}
        >
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={card.imageUrl} 
              alt={card.title}
              className="w-full h-full object-cover"
            />
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
      ))}
    </div>
  );
};

export default CardList;
