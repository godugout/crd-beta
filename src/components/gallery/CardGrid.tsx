
import React, { useMemo } from 'react';
import { Card } from '@/lib/types';
import CardItem from '@/components/CardItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { MobileSwipeAction } from '@/components/ui/mobile-controls';
import { ResponsiveImage } from '@/components/ui/responsive-image';

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
  const isMobile = useIsMobile();
  const { isLowBandwidth, reducedMotion } = useMobileOptimization();
  
  // On mobile, reduce initial loading by showing fewer animations at once
  const mobileDisplayLimit = useMemo(() => isMobile ? 8 : cards.length, [isMobile, cards.length]);

  // For mobile, enhance cards to show them more efficiently, using reduced animations when needed
  const renderCard = (card: Card, index: number, useDynamicEffects: boolean) => {
    return (
      <div 
        key={card.id} 
        className={
          useDynamicEffects 
            ? "animate-scale-in transition-all duration-300" 
            : "transition-all duration-200"
        }
        onClick={() => onCardClick(card.id)}
      >
        {isMobile ? (
          <MobileSwipeAction onSwipe={(direction) => {
            if (direction === 'up') {
              onCardClick(card.id);
            }
          }}>
            <div className="cursor-pointer">
              <CardItem 
                card={card}
                activeEffects={reducedMotion ? [] : (cardEffects[card.id] || [])}
              />
            </div>
          </MobileSwipeAction>
        ) : (
          <CardItem 
            card={card}
            activeEffects={cardEffects[card.id] || []} 
          />
        )}
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'grid-cols-2 gap-3' : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'} ${className}`}>
      {cards.slice(0, mobileDisplayLimit).map((card, index) => 
        renderCard(card, index, !isLowBandwidth)
      )}
      {isMobile && cards.length > mobileDisplayLimit && (
        <div className="col-span-2 py-4 text-center text-sm text-cardshow-slate">
          {cards.length - mobileDisplayLimit} more cards...
          <button 
            className="block mx-auto mt-2 text-cardshow-blue underline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
          </button>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
