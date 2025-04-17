
import { useContext } from 'react';
import { CardContext, EnhancedCardContextProps } from '@/context/CardContext';
import sampleCards from '@/data/sampleCards';
import { Card, CardRarity } from '@/lib/types';

/**
 * Hook to access the card context for managing cards
 */
export function useCards(): EnhancedCardContextProps {
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
      addCard: async () => ({ 
        id: `fallback-${Date.now()}`, 
        title: 'Fallback Card', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        rarity: CardRarity.COMMON,
        effects: [] 
      }),
      updateCard: async () => ({ 
        id: `fallback-${Date.now()}`, 
        title: 'Fallback Card', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        rarity: CardRarity.COMMON,
        effects: [] 
      }),
      deleteCard: async () => true,
      toggleFavorite: () => {},
      getCardById: () => undefined,
      getCard: () => undefined,
      refreshCards: async () => {}
    } as EnhancedCardContextProps;
  }
  
  return context;
}
