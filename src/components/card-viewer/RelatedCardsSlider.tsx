
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface RelatedCardsSliderProps {
  cards: Card[];
  onCardClick: (cardId: string) => void;
  className?: string;
}

const RelatedCardsSlider: React.FC<RelatedCardsSliderProps> = ({ cards, onCardClick, className }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [visibleCardIndex, setVisibleCardIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

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

  // Auto-scroll functionality
  useEffect(() => {
    if (cards.length <= 1 || isHovering) return;
    
    const interval = setInterval(() => {
      if (visibleCardIndex >= cards.length - 1) {
        setVisibleCardIndex(0);
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      } else {
        setVisibleCardIndex(prev => prev + 1);
        if (scrollRef.current) {
          scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [visibleCardIndex, cards.length, isHovering]);

  if (cards.length === 0) {
    return (
      <div className="text-white/50 text-center py-6">
        No related cards found
      </div>
    );
  }

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 hover:bg-black/70"
        onClick={scrollLeft}
      >
        <ChevronLeft />
      </Button>

      <ScrollArea className="w-full whitespace-nowrap" ref={scrollRef}>
        <div className="flex gap-4 py-4 px-2">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={cn(
                "inline-block w-[180px] flex-shrink-0 cursor-pointer transform transition-all duration-300",
                index === visibleCardIndex 
                  ? "scale-105 opacity-100" 
                  : "hover:scale-105 opacity-80 hover:opacity-100"
              )}
              onClick={() => onCardClick(card.id)}
            >
              <div 
                className="aspect-[2.5/3.5] rounded-lg overflow-hidden border shadow-lg group relative"
                style={{
                  borderColor: card.designMetadata?.cardStyle?.borderColor || 'rgba(255,255,255,0.1)',
                  borderWidth: card.designMetadata?.cardStyle?.borderWidth || 1,
                  borderRadius: card.designMetadata?.cardStyle?.borderRadius || '0.5rem',
                }}
              >
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Glass drawer effect for card info */}
                <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/30 backdrop-blur-sm p-2">
                  <h4 className="text-sm text-white font-medium truncate">{card.title}</h4>
                  <p className="text-xs text-gray-200 truncate">
                    {card.player || (card.tags && card.tags[0]) || 'No tags'}
                  </p>
                </div>
              </div>
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
