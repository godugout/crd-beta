
import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';

interface CardDataOptions {
  initialData?: Card[];
  filters?: {
    tags?: string[];
    userId?: string;
    teamId?: string;
    isPublic?: boolean;
    query?: string;
    collectionId?: string;
  };
}

export function useCardData(options: CardDataOptions = {}) {
  const cardsContext = useCards();
  const { cards: contextCards, isLoading: contextLoading } = cardsContext;
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const applyFilters = useCallback((cards: Card[], filters?: CardDataOptions['filters']) => {
    let result = [...cards];
    
    // Apply tag filters
    if (filters?.tags && filters.tags.length > 0) {
      result = result.filter(card => {
        return filters.tags!.some(tag => card.tags.includes(tag));
      });
    }
    
    // Apply user filter
    if (filters?.userId) {
      result = result.filter(card => card.userId === filters.userId);
    }
    
    // Apply team filter
    if (filters?.teamId) {
      result = result.filter(card => card.teamId === filters.teamId);
    }
    
    // Apply public filter
    if (filters?.isPublic !== undefined) {
      result = result.filter(card => card.isPublic === filters.isPublic);
    }
    
    // Apply collection filter
    if (filters?.collectionId) {
      result = result.filter(card => card.collectionId === filters.collectionId);
    }
    
    // Apply search query filter
    if (filters?.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(card => {
        return (
          card.title.toLowerCase().includes(query) ||
          (card.description && card.description.toLowerCase().includes(query)) ||
          card.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }
    
    return result;
  }, []);

  useEffect(() => {
    try {
      const cards = options.initialData || contextCards;
      const filtered = applyFilters(cards, {
        ...options.filters,
        query: searchQuery || options.filters?.query
      });
      setFilteredCards(filtered);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
  }, [contextCards, options.initialData, options.filters, searchQuery, applyFilters]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      if (cardsContext.refreshCards) {
        await cardsContext.refreshCards();
      }
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh cards'));
      setIsLoading(false);
    }
  }, [cardsContext]);

  return {
    cards: filteredCards,
    isLoading: isLoading || contextLoading,
    error,
    searchQuery,
    setSearchQuery,
    refresh
  };
}

export default useCardData;
