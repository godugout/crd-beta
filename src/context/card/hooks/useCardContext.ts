
import { useContext } from 'react';
import { CardContext } from '@/context/CardContext';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { Card, CardRarity } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';

/**
 * Hook for accessing CardContext functionality across the app
 * Provides a fallback implementation if used outside of a CardProvider
 */
export function useCardContext() {
  const context = useContext(CardContext);
  
  if (!context) {
    // Provide a fallback if context is not available
    console.warn('useCardContext: CardContext not found, using fallback data');
    
    return {
      cards: sampleCards || [],
      favorites: [],
      loading: false,
      isLoading: false,
      error: null,
      collections: [],
      fetchCards: async () => {},
      fetchCollections: async () => {},
      addCard: async (data: Partial<Card>): Promise<Card> => {
        const card = adaptToCard({
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
        });
        return { ...card, ...data };
      },
      updateCard: async (id: string, data: Partial<Card>): Promise<Card> => {
        const card = sampleCards.find(card => card.id === id) || adaptToCard({
          id,
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
        });
        return { ...card, ...data };
      },
      deleteCard: async () => true,
      toggleFavorite: () => {},
      getCardById: (id: string) => sampleCards.find(card => card.id === id),
      getCard: (id: string) => sampleCards.find(card => card.id === id),
      addCollection: async () => ({}),
      updateCollection: async () => ({}),
      deleteCollection: async () => true,
      addSeries: async () => ({}),
      updateSeries: async () => ({}),
      refreshCards: async () => {},
      createCollection: async () => ({})
    };
  }
  
  return context;
}

export default useCardContext;
