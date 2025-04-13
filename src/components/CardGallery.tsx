
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { CardGridWrapper } from './gallery/CardGridWrapper';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';

interface CardGalleryProps {
  className?: string;
  viewMode?: 'grid' | 'list';
  onCardClick?: (cardId: string) => void;
  cards?: Card[]; 
  teamId?: string;
  collectionId?: string;
  tags?: string[];
  isLoading?: boolean;
  searchQuery?: string;
}

const CardGallery: React.FC<CardGalleryProps> = ({ 
  className, 
  viewMode: initialViewMode = 'grid',
  onCardClick,
  cards: propCards,
  teamId,
  collectionId,
  tags: initialTags,
  isLoading: propIsLoading = false,
  searchQuery = ''
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(initialViewMode);
  
  const { 
    cards: contextCards, 
    isLoading: contextIsLoading,
    error: contextError,
    refreshCards 
  } = useCards();
  
  const cards = propCards || contextCards || [];
  const isLoading = propIsLoading || contextIsLoading;
  
  const { isMobile } = useMobileOptimization();
  
  const { cardEffects, isLoading: isLoadingEffects } = { cardEffects: {}, isLoading: false };
  
  // Combined loading state
  const isLoadingAny = isLoading || isLoadingEffects;

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery) return cards;
    const lowerQuery = searchQuery.toLowerCase();
    return cards.filter(card => 
      card.title?.toLowerCase().includes(lowerQuery) || 
      card.description?.toLowerCase().includes(lowerQuery) ||
      card.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [cards, searchQuery]);

  const handleCardItemClick = (cardId: string) => {
    if (onCardClick) {
      onCardClick(cardId);
    } else {
      navigate(`/cards/${cardId}`);
    }
  };
  
  // Function to get card effects for a specific card
  const getCardEffects = (cardId: string) => {
    return [];
  };

  return (
    <div className={cn("", className)}>
      <ErrorBoundary>
        {isLoadingAny ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading cards...</p>
            </div>
          </div>
        ) : (
          <CardGridWrapper 
            cards={filteredCards}
            onCardClick={handleCardItemClick} 
            isLoading={false}
            getCardEffects={getCardEffects}
            error={contextError}
          />
        )}
        
        {filteredCards.length === 0 && !isLoadingAny && !contextError && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cards found</p>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CardGallery;
