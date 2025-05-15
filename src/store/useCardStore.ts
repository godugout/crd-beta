
import { create } from 'zustand';
import { Card } from '@/types/card';
import cardService from '@/services/cardService';
import { adaptToCard, createBlankCard } from '@/lib/adapters/cardAdapter';

interface CardState {
  // Card data
  cards: Card[];
  selectedCardId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllCards: () => Promise<void>;
  getCardById: (id: string) => Card | undefined;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<void>;
  selectCard: (id: string | null) => void;
  
  // Card effect actions
  addEffectToCard: (cardId: string, effect: string) => Promise<void>;
  removeEffectFromCard: (cardId: string, effect: string) => Promise<void>;
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  selectedCardId: null,
  isLoading: false,
  error: null,
  
  fetchAllCards: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const cards = await cardService.getAllCards();
      set({ cards, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cards',
        isLoading: false
      });
    }
  },
  
  getCardById: (id: string) => {
    return get().cards.find(card => card.id === id);
  },
  
  addCard: async (cardData: Partial<Card>) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = 'current-user'; // Would come from auth in a real app
      const newCard = adaptToCard({
        ...createBlankCard(userId),
        ...cardData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      const savedCard = await cardService.saveCard(newCard);
      
      set(state => ({
        cards: [...state.cards, savedCard],
        isLoading: false
      }));
      
      return savedCard;
    } catch (error) {
      console.error('Failed to add card:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add card',
        isLoading: false
      });
      throw error;
    }
  },
  
  updateCard: async (id: string, updates: Partial<Card>) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedCard = await cardService.updateCard(id, updates);
      
      set(state => ({
        cards: state.cards.map(card => card.id === id ? updatedCard : card),
        isLoading: false
      }));
      
      return updatedCard;
    } catch (error) {
      console.error('Failed to update card:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update card',
        isLoading: false
      });
      throw error;
    }
  },
  
  deleteCard: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await cardService.deleteCard(id);
      
      set(state => ({
        cards: state.cards.filter(card => card.id !== id),
        selectedCardId: state.selectedCardId === id ? null : state.selectedCardId,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to delete card:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete card',
        isLoading: false
      });
      throw error;
    }
  },
  
  selectCard: (id: string | null) => {
    set({ selectedCardId: id });
  },
  
  addEffectToCard: async (cardId: string, effect: string) => {
    const card = get().cards.find(c => c.id === cardId);
    if (!card) return;
    
    const updatedEffects = [...new Set([...card.effects, effect])];
    await get().updateCard(cardId, { effects: updatedEffects });
  },
  
  removeEffectFromCard: async (cardId: string, effect: string) => {
    const card = get().cards.find(c => c.id === cardId);
    if (!card) return;
    
    const updatedEffects = card.effects.filter(e => e !== effect);
    await get().updateCard(cardId, { effects: updatedEffects });
  }
}));

export default useCardStore;
