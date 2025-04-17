
import { useContext } from 'react';
import { CardContext } from '@/context/CardContext';
import { Card, CardRarity } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { toStandardCard } from '@/lib/utils/cardConverters';

/**
 * Hook to access the card context for managing cards
 */
export function useCards() {
  const context = useContext(CardContext);
  
  if (!context) {
    // Provide a fallback if context is not available
    console.warn('useCards: CardContext not found, using fallback data');
    
    // Ensure sample cards have the required properties
    // and the correct CardRarity type using our converter utility
    const processedSampleCards = sampleCards.map(card => toStandardCard({
      ...card,
      isFavorite: card.isFavorite ?? false,
      description: card.description || '',
      rarity: card.rarity || CardRarity.COMMON
    }));
    
    return {
      cards: processedSampleCards || [],
      favorites: [],
      loading: false,
      isLoading: false,
      error: null,
      collections: [],
      fetchCards: async () => {},
      fetchCollections: async () => {},
      addCard: async (data: Partial<Card>): Promise<Card> => {
        return adaptToCard({
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
          designMetadata: {},
          isFavorite: false,
          ...data
        });
      },
      updateCard: async (id: string, data: Partial<Card>): Promise<Card> => {
        const card = processedSampleCards.find(card => card.id === id);
        return adaptToCard({
          ...(card || {
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
            designMetadata: {},
            isFavorite: false
          }),
          ...data
        });
      },
      deleteCard: async () => true,
      toggleFavorite: () => {},
      getCardById: (id: string) => processedSampleCards.find(card => card.id === id),
      getCard: (id: string) => processedSampleCards.find(card => card.id === id),
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
