
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { filterCards } from './gallery/utils/filterCards';
import { GalleryToolbar } from './gallery/GalleryToolbar';
import TagFilter from './gallery/TagFilter';
import CardList from './gallery/CardList';
import { CardGridWrapper } from './gallery/CardGridWrapper';
import { useCardEffects } from './gallery/hooks/useCardEffects';
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
}

const CardGallery: React.FC<CardGalleryProps> = ({ 
  className, 
  viewMode: initialViewMode = 'grid',
  onCardClick,
  cards: propCards,
  teamId,
  collectionId,
  tags: initialTags
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags || []);
  
  const { 
    cards: contextCards, 
    isLoading: isLoadingCards,
    refreshCards 
  } = useCards();
  
  const cards = propCards || contextCards;
  
  const { isMobile, shouldOptimizeAnimations } = useMobileOptimization();
  
  const { cardEffects, isLoading: isLoadingEffects } = useCardEffects(cards);
  
  const filteredCards = useMemo(() => 
    filterCards(cards, searchQuery, selectedTags),
    [cards, searchQuery, selectedTags]
  );
  
  const allTags = useMemo(() => 
    Array.from(new Set(cards.flatMap(card => card.tags || []))),
    [cards]
  );
  
  const isLoading = isLoadingCards || isLoadingEffects;
  
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const handleCardItemClick = (cardId: string) => {
    if (onCardClick) {
      onCardClick(cardId);
    } else {
      navigate(`/card/${cardId}`);
    }
  };
  
  const handleCreateCard = () => {
    navigate('/editor');
  };

  return (
    <div className={cn("", className)}>
      <ErrorBoundary>
        <GalleryToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateCard={handleCreateCard}
        />
        
        <TagFilter 
          allTags={allTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onClearFilters={(selectedTags.length > 0 || searchQuery) ? clearFilters : undefined}
        />
        
        {viewMode === 'grid' ? (
          <CardGridWrapper 
            cards={filteredCards}
            isLoading={isLoading}
            error={null}
            onCardClick={handleCardItemClick}
            getCardEffects={(cardId) => cardEffects[cardId] || []}
            useVirtualization={!isMobile && filteredCards.length > 20}
          />
        ) : (
          <CardList 
            cards={filteredCards}
            isLoading={isLoading}
            onCardClick={handleCardItemClick}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CardGallery;
