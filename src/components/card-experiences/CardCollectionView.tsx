
import React, { useState, useMemo } from 'react';
import { useCards } from '@/context/CardContext';
import { Card as CardType } from '@/lib/types';
import CardGrid from '@/components/gallery/CardGrid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardCollectionViewProps {
  cards?: CardType[];
  title?: string;
  onCardClick?: (cardId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const CardCollectionView: React.FC<CardCollectionViewProps> = ({
  cards: propCards,
  title = 'Cards',
  onCardClick,
  isLoading = false,
  emptyMessage = 'No cards found'
}) => {
  const { cards: contextCards } = useCards();
  const [sortOrder, setSortOrder] = useState<string>('newest');
  
  // Use provided cards prop or fallback to context cards
  const cards = useMemo(() => propCards || contextCards || [], [propCards, contextCards]);
  
  // Sort cards based on sort order
  const sortedCards = useMemo(() => {
    if (!cards.length) return [];
    
    return [...cards].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [cards, sortOrder]);
  
  const handleCardClick = (cardId: string) => {
    if (onCardClick) {
      onCardClick(cardId);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        
        <div className="flex items-center gap-2">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <CardGrid 
        cards={sortedCards}
        onCardClick={handleCardClick}
        isLoading={isLoading}
        error={null}
        getCardEffects={() => []}
      />
    </div>
  );
};

export default CardCollectionView;
