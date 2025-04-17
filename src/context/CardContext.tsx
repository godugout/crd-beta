
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, CardRarity } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';

interface CardContextProps {
  cards: Card[];
  favorites: Card[];
  loading: boolean;
  error: Error | null;
  fetchCards: () => Promise<void>;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, card: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => void;
  getCardById: (id: string) => Card | undefined;
  getCard: (id: string) => Card | undefined;
  refreshCards: () => Promise<void>;
}

export const CardContext = createContext<CardContextProps | undefined>(undefined);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>(sampleCards || []);
  const [favorites, setFavorites] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      // In a real app, fetch cards from API
      // For now, we'll use sample cards
      setCards(sampleCards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cards'));
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    setLoading(true);
    try {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.thumbnailUrl || '',
        tags: cardData.tags || [],
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rarity: CardRarity.COMMON,
        effects: [],
        ...cardData
      };
      
      setCards(prevCards => [...prevCards, newCard]);
      return newCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add card');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<Card> => {
    setLoading(true);
    try {
      const cardIndex = cards.findIndex(card => card.id === id);
      if (cardIndex === -1) {
        throw new Error(`Card with ID ${id} not found`);
      }
      
      const updatedCard = {
        ...cards[cardIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const newCards = [...cards];
      newCards[cardIndex] = updatedCard;
      
      setCards(newCards);
      return updatedCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update card');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      setFavorites(prevFavorites => prevFavorites.filter(card => card.id !== id));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete card');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;
    
    const isFavorite = favorites.some(f => f.id === id);
    if (isFavorite) {
      setFavorites(prevFavorites => prevFavorites.filter(f => f.id !== id));
    } else {
      setFavorites(prevFavorites => [...prevFavorites, card]);
    }
  };

  const getCardById = (id: string) => {
    return cards.find(card => card.id === id);
  };

  const refreshCards = async () => {
    return fetchCards();
  };

  const value: CardContextProps = {
    cards,
    favorites,
    loading,
    error,
    fetchCards,
    addCard,
    updateCard,
    deleteCard,
    toggleFavorite,
    getCardById,
    getCard: getCardById, // Alias for consistency
    refreshCards
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};

// Hook to use the card context
export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};
