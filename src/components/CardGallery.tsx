
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags || []);
  
  const { 
    cards: contextCards, 
    isLoading: contextIsLoading,
    refreshCards 
  } = useCards();
  
  const cards = propCards || contextCards;
  const isLoading = propIsLoading || contextIsLoading;
  
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
  
  // Combined loading state
  const isLoadingAny = isLoading || isLoadingEffects;
  
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
      navigate(`/cards/${cardId}`);
    }
  };
  
  // Debug log
  console.log("CardGallery rendering with cards:", cards.length, "filtered:", filteredCards.length, "loading:", isLoadingAny);

  return (
    <div className={className}>
      <ErrorBoundary>
        <GalleryToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTagCount={selectedTags.length}
          onClearFilters={clearFilters}
        />
        
        {allTags.length > 0 && (
          <TagFilter 
            tags={allTags}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
          />
        )}
        
        {viewMode === 'grid' ? (
          <CardGridWrapper 
            cards={filteredCards}
            onCardClick={handleCardItemClick} 
            isLoading={isLoadingAny}
            cardEffects={cardEffects}
          />
        ) : (
          <CardList
            cards={filteredCards}
            onCardClick={handleCardItemClick}
            isLoading={isLoadingAny}
          />
        )}
        
        {filteredCards.length === 0 && !isLoadingAny && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cards found</p>
            <p className="text-sm text-gray-400 mt-1">Try changing your filters or search term</p>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CardGallery;
