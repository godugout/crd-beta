
import React, { useMemo } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import CardThumbnail from './CardThumbnail';

interface CardGridProps {
  cards: Card[];
  searchQuery?: string;
  selectedTags?: string[];
  sortBy?: string;
  onCardClick: (cardId: string) => void;
  className?: string;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  searchQuery = '',
  selectedTags = [],
  sortBy = 'newest',
  onCardClick,
  className = ''
}) => {
  // Filter and sort the cards based on the provided criteria
  const filteredCards = useMemo(() => {
    // Step 1: Filter cards by search query
    let filtered = cards;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.title.toLowerCase().includes(query) || 
        card.description.toLowerCase().includes(query)
      );
    }
    
    // Step 2: Filter cards by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(card => 
        selectedTags.every(tag => card.tags.includes(tag))
      );
    }
    
    // Step 3: Sort cards
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'popularity':
          // Safely handle viewCount which might be undefined
          const viewCountA = a.viewCount || 0;
          const viewCountB = b.viewCount || 0;
          return viewCountB - viewCountA;
        default:
          return 0;
      }
    });
  }, [cards, searchQuery, selectedTags, sortBy]);

  // Check if there are no cards to display
  if (filteredCards.length === 0) {
    return (
      <div className={cn(`p-8 text-center`, className)}>
        <h3 className="text-lg font-medium mb-2">No cards found</h3>
        <p className="text-muted-foreground">
          {searchQuery || selectedTags.length > 0 
            ? "Try adjusting your filters or search terms."
            : "There are no cards in this collection yet."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn(`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6`, className)}>
      {filteredCards.map(card => (
        <CardThumbnail
          key={card.id}
          src={card.thumbnailUrl || card.imageUrl}
          alt={card.title}
          onClick={() => onCardClick(card.id)}
          className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] aspect-[2.5/3.5]"
        />
      ))}
    </div>
  );
};

export default CardGrid;
