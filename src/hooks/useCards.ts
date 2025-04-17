
import { useContext } from 'react';
import { CardContext } from '@/context/CardContext';
import sampleCards from '@/data/sampleCards';

/**
 * Hook to access the card context for managing cards
 */
export function useCards() {
  const context = useContext(CardContext);
  
  if (!context) {
    // Provide a fallback if context is not available
    console.warn('useCards: CardContext not found, using fallback data');
    
    return {
      cards: sampleCards,
      loading: false,
      error: null,
      fetchCards: async () => {},
      addCard: async () => ({ id: '', title: '', description: '', createdAt: '', updatedAt: '', rarity: 'common', effects: [] }),
      updateCard: async () => ({ id: '', title: '', description: '', createdAt: '', updatedAt: '', rarity: 'common', effects: [] }),
      deleteCard: async () => true,
      toggleFavorite: () => {},
      getCardById: () => undefined
    };
  }
  
  return context;
}
