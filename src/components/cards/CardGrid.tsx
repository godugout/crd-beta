
import React from 'react';
import { Card } from '@/lib/types';
import CardPreview from './CardPreview';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface CardGridProps {
  cards: Card[];
  onCardClick?: (id: string) => void;
  className?: string;
  searchQuery?: string;
  selectedTags?: string[];
  sortBy?: string;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  cards,
  onCardClick,
  className = '',
  searchQuery = '',
  selectedTags = [],
  sortBy = 'newest'
}) => {
  // Filter cards based on search query and selected tags
  const filteredCards = cards.filter(card => {
    // Filter by search query
    const matchesQuery = !searchQuery || 
      card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected tags
    const matchesTags = !selectedTags.length || 
      (card.tags && selectedTags.every(tag => card.tags.includes(tag)));
    
    return matchesQuery && matchesTags;
  });
  
  // Sort cards based on sortBy
  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'az':
        return a.title.localeCompare(b.title);
      case 'za':
        return b.title.localeCompare(a.title);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  if (sortedCards.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No cards found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className={`h-full ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedCards.map(card => (
          <CardPreview 
            key={card.id} 
            card={card} 
            onClick={() => onCardClick?.(card.id)} 
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default CardGrid;
