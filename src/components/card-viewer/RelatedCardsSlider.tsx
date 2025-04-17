
import React, { useRef } from 'react';
import { Card } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedCardsSliderProps {
  cards: Card[];
  onCardClick: (cardId: string) => void;
}

const RelatedCardsSlider: React.FC<RelatedCardsSliderProps> = ({ cards, onCardClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  if (cards.length === 0) return null;

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map(card => (
          <div 
            key={card.id}
            className="flex-shrink-0 w-36 md:w-40 snap-start cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onCardClick(card.id)}
          >
            <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-lg bg-gray-800 shadow-lg">
              <img 
                src={card.thumbnailUrl || card.imageUrl} 
                alt={card.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-white font-medium truncate">{card.title}</p>
                {card.player && <p className="text-xs text-white/70 truncate">{card.player}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1 rounded-full"
        onClick={scrollLeft}
      >
        <ChevronLeft size={20} />
      </button>
      
      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1 rounded-full"
        onClick={scrollRight}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default RelatedCardsSlider;
