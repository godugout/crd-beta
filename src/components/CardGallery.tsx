
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
}

const CardGallery: React.FC<CardGalleryProps> = ({ 
  className, 
  viewMode: initialViewMode = 'grid',
  onCardClick,
  cards: propCards,
  teamId,
  collectionId,
  tags: initialTags,
  isLoading: propIsLoading = false
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
  
  const { isMobile, shouldOptimizeAnimations } = useMobileOptimization();
  
  const { cardEffects, isLoading: isLoadingEffects } = { cardEffects: {}, isLoading: false };
  
  // Combined loading state
  const isLoadingAny = isLoading || isLoadingEffects;

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
  
  // Debug log
  console.log("CardGallery rendering with cards:", cards.length, "loading:", isLoadingAny);

  return (
    <div className={className}>
      <ErrorBoundary>
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold">Card Gallery</h2>
          <p className="text-gray-500">Filters and tags are temporarily disabled for better image display</p>
        </div>
        
        <CardGridWrapper 
          cards={cards}
          onCardClick={handleCardItemClick} 
          isLoading={isLoadingAny}
          getCardEffects={getCardEffects}
          error={contextError}
        />
        
        {cards.length === 0 && !isLoadingAny && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cards found</p>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CardGallery;
