
import React from 'react';
import { Card } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ScrollableGalleryProps {
  cards: Card[];
  currentCardId: string;
  onCardClick: (cardId: string) => void;
  className?: string;
}

const ScrollableGallery: React.FC<ScrollableGalleryProps> = ({
  cards,
  currentCardId,
  onCardClick,
  className
}) => {
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 p-4 z-40 bg-black/50 backdrop-blur-sm", className)}>
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => onCardClick(card.id)}
              className={cn(
                "flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden transition-all",
                card.id === currentCardId ? "ring-2 ring-primary scale-110" : "hover:scale-105"
              )}
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableGallery;
