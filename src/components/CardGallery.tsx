
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import { useCardEffects } from './gallery/hooks/useCardEffects';
import { filterCards } from './gallery/utils/filterCards';
import SearchInput from './gallery/SearchInput';
import TagFilter from './gallery/TagFilter';
import CardGrid from './gallery/CardGrid';
import CardList from './gallery/CardList';
import EmptyState from './gallery/EmptyState';

interface CardGalleryProps {
  className?: string;
  viewMode?: 'grid' | 'list';
  onCardClick?: (cardId: string) => void;
  cards?: Card[]; // Allow passing cards directly to component
}

const CardGallery: React.FC<CardGalleryProps> = ({ 
  className, 
  viewMode = 'grid',
  onCardClick,
  cards: propCards
}) => {
  const navigate = useNavigate();
  const { cards: contextCards, refreshCards } = useCards();
  const cards = propCards || contextCards; // Use prop cards if provided, otherwise use context
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get card effects
  const { cardEffects, isLoading } = useCardEffects(cards);
  
  // Debug log to check cards
  console.log("CardGallery rendering with cards:", cards?.length, cards);
  
  // Get all unique tags from cards
  const allTags = Array.from(new Set(cards.flatMap(card => card.tags || [])));
  
  // Filter cards based on search query and selected tags
  const filteredCards = filterCards(cards, searchQuery, selectedTags);
  
  // Debug filtered cards
  console.log("Filtered cards:", filteredCards.length);
  
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const handleCardItemClick = (cardId: string) => {
    if (onCardClick) {
      onCardClick(cardId);
    } else {
      // Default behavior if no click handler is provided
      navigate(`/card/${cardId}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-40 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("", className)}>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search cards..."
        />
        
        <button
          onClick={() => navigate('/editor')}
          className="flex items-center justify-center rounded-lg bg-cardshow-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Card
        </button>
      </div>
      
      {/* Tags filter */}
      <TagFilter 
        allTags={allTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onClearFilters={(selectedTags.length > 0 || searchQuery) ? clearFilters : undefined}
      />
      
      {/* Cards display based on view mode */}
      {filteredCards.length > 0 ? (
        viewMode === 'grid' ? (
          <CardGrid 
            cards={filteredCards} 
            cardEffects={cardEffects} 
            onCardClick={handleCardItemClick} 
          />
        ) : (
          <CardList 
            cards={filteredCards} 
            onCardClick={handleCardItemClick} 
          />
        )
      ) : (
        <EmptyState 
          isEmpty={cards.length === 0} 
          isFiltered={cards.length > 0 && filteredCards.length === 0}
          onRefresh={refreshCards}
        />
      )}
    </div>
  );
};

export default CardGallery;

// Don't remove this import, it's used in the file above
import { useCards } from '@/context/CardContext';
