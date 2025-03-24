
import { Card } from '@/lib/types';

/**
 * Filters cards based on search query and selected tags
 */
export const filterCards = (
  cards: Card[],
  searchQuery: string, 
  selectedTags: string[]
): Card[] => {
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
};
