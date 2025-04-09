
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PlusCircle, Grid, List, AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { filterCards } from './gallery/utils/filterCards';
import { CardGrid as CardGridComponent } from './ui/card-components/CardGrid';
import SearchInput from './gallery/SearchInput';
import TagFilter from './gallery/TagFilter';
import CardList from './gallery/CardList';
import { useCardEffects } from './gallery/hooks/useCardEffects';
import { Card } from '@/lib/types';
import { useCards } from '@/hooks/useCards';

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
    cards: fetchedCards, 
    isLoading: isLoadingCards, 
    error: cardsError, 
    fetchCards: refreshCards 
  } = useCards({
    teamId,
    collectionId,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    autoFetch: !propCards
  });
  
  const cards = propCards || fetchedCards;
  
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
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search cards..."
          />
          
          <div className="flex gap-2">
            <div className="flex rounded-lg border overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-none",
                  viewMode === 'grid' && "bg-gray-100"
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-none",
                  viewMode === 'list' && "bg-gray-100"
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          
            <Button
              onClick={handleCreateCard}
              className="flex items-center justify-center rounded-lg bg-cardshow-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Card
            </Button>
          </div>
        </div>
        
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
            error={cardsError ? (typeof cardsError === 'string' ? new Error(cardsError) : cardsError as Error) : null}
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

interface CardGridProps {
  cards: Card[];
  isLoading: boolean;
  error: Error | null;
  onCardClick: (cardId: string) => void;
  getCardEffects: (cardId: string) => any[];
  useVirtualization?: boolean;
}

const CardGridWrapper: React.FC<CardGridProps> = ({ 
  cards,
  isLoading,
  error,
  onCardClick,
  getCardEffects,
  useVirtualization
}) => {
  const onRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading cards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-red-500">
          <AlertOctagon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load cards</h3>
        <p className="text-gray-600 mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <CardGridComponent 
      cards={cards}
      onCardClick={onCardClick}
      getCardEffects={getCardEffects}
      useVirtualization={useVirtualization}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default CardGallery;
