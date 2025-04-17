
import { useContext } from 'react';
import { CardContext } from '@/context/CardContext';
import { Card, CardRarity } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';

/**
 * Hook to access the card context for managing cards
 */
export function useCards() {
  const context = useContext(CardContext);
  
  if (!context) {
    // Provide a fallback if context is not available
    console.warn('useCards: CardContext not found, using fallback data');
    
    return {
      cards: sampleCards || [],
      favorites: [],
      loading: false,
      isLoading: false,
      error: null,
      fetchCards: async () => {},
      addCard: async (data: Partial<Card>): Promise<Card> => ({ 
        id: `fallback-${Date.now()}`, 
        title: 'Fallback Card',
        description: '', 
        imageUrl: '',
        thumbnailUrl: '',
        tags: [],
        userId: '',
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        rarity: CardRarity.COMMON,
        effects: [],
        designMetadata: {}
      }),
      updateCard: async () => ({ 
        id: `fallback-${Date.now()}`, 
        title: 'Fallback Card', 
        description: '', 
        imageUrl: '',
        thumbnailUrl: '',
        tags: [],
        userId: '',
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        rarity: CardRarity.COMMON,
        effects: [],
        designMetadata: {}
      }),
      deleteCard: async () => true,
      toggleFavorite: () => {},
      getCardById: (id: string) => sampleCards.find(card => card.id === id),
      getCard: (id: string) => sampleCards.find(card => card.id === id),
      refreshCards: async () => {}
    };
  }
  
  return context;
}
