
import { Card } from '@/lib/types';

export const filterCards = (
  cards: Card[], 
  searchQuery: string, 
  selectedTags: string[]
): Card[] => {
  return cards.filter(card => {
    const matchesSearch = searchQuery === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.tags && card.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesTags = selectedTags.length === 0 || 
      (card.tags && selectedTags.every(tag => card.tags.includes(tag)));
    
    return matchesSearch && matchesTags;
  });
};
