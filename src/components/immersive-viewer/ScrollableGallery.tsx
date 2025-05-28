
import React, { useEffect, useRef } from 'react';
import { Card } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentCardRef = useRef<HTMLButtonElement>(null);
  
  // Scroll to the current card when the component mounts or current card changes
  useEffect(() => {
    if (currentCardRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        currentCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 300);
    }
  }, [currentCardId]);

  // Scroll the gallery left or right
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -250 : 250;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 p-4 z-40 bg-black/50 backdrop-blur-sm", className)}>
      {/* Left scroll button */}
      <Button
        variant="ghost" 
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full z-10 text-white"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide pb-2 px-8"
      >
        <div className="flex gap-4 pb-2 px-4">
          {cards.map((card) => (
            <button
              key={card.id}
              ref={card.id === currentCardId ? currentCardRef : undefined}
              onClick={() => onCardClick(card.id)}
              className={cn(
                "flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden transition-all duration-300",
                card.id === currentCardId ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100 hover:scale-105"
              )}
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              {card.id === currentCardId && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-1 px-2">
                  <div className="h-1 bg-primary rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right scroll button */}
      <Button
        variant="ghost" 
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full z-10 text-white"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ScrollableGallery;
