
import { useContext } from 'react';
import { CardContext, EnhancedCardContextProps } from '@/context/CardContext';
import sampleCards from '@/data/sampleCards';

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
        rarity: 'common' as any, 
        effects: [] 
      }),
      updateCard: async () => ({ 
        id: `fallback-${Date.now()}`, 
        title: 'Fallback Card', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        rarity: 'common' as any, 
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
