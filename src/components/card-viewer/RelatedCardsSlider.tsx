
import React from 'react';
import { Card } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface RelatedCardsSliderProps {
  cards: Card[];
  onCardClick: (cardId: string) => void;
}

const RelatedCardsSlider: React.FC<RelatedCardsSliderProps> = ({ cards, onCardClick }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-white/50 text-center py-12">
        No related cards found
      </div>
    );
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 hover:bg-black/70"
        onClick={scrollLeft}
      >
        <ChevronLeft />
      </Button>

      <ScrollArea className="w-full whitespace-nowrap" ref={scrollRef}>
        <div className="flex gap-4 py-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="inline-block w-[180px] flex-shrink-0 cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => onCardClick(card.id)}
            >
              <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden border border-white/10">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="mt-2 text-sm text-white truncate">{card.title}</h4>
              <p className="text-xs text-gray-400 truncate">{card.tags?.[0] || 'No tags'}</p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 hover:bg-black/70"
        onClick={scrollRight}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default RelatedCardsSlider;
