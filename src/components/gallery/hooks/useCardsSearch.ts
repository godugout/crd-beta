
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/lib/types';

interface UseCardsSearchProps {
  cards: Card[];
  initialSearchQuery?: string;
  initialTags?: string[];
}

interface UseCardsSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  filteredCards: Card[];
  allTags: string[];
  isFiltered: boolean;
}

export const useCardsSearch = ({
  cards,
  initialSearchQuery = '',
  initialTags = []
}: UseCardsSearchProps): UseCardsSearchResult => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  
  // Extract all unique tags from cards
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    cards.forEach(card => {
      card.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [cards]);
  
  // Filter cards based on search query and selected tags
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => card.tags?.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [cards, searchQuery, selectedTags]);
  
  // Determine if filters are active
  const isFiltered = searchQuery !== '' || selectedTags.length > 0;
  
  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };
  
  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    toggleTag,
    clearFilters,
    filteredCards,
    allTags,
    isFiltered
  };
};
