
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, CardRarity } from '@/lib/types';

// Enhanced card with additional client-state properties
export interface EnhancedCard extends Card {
  isFavorite?: boolean;
  viewCount?: number;
  lastViewed?: string; // Changed from Date to string for JSON compatibility
}

export interface EnhancedCardContextProps {
  cards: EnhancedCard[];
  favorites: EnhancedCard[];
  loading: boolean;
  error: Error | null;
  fetchCards: () => Promise<void>;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => void;
  getCardById: (id: string) => EnhancedCard | undefined; // Added missing method
}

const CardContext = createContext<EnhancedCardContextProps | undefined>(undefined);

export const useCards = (): EnhancedCardContextProps => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<EnhancedCard[]>([]);
  const [favorites, setFavorites] = useState<EnhancedCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock implementation - replace with actual API calls
  const fetchCards = async (): Promise<void> => {
    try {
      setLoading(true);
      // Simulate API call
      const mockCards: EnhancedCard[] = [
        {
          id: '1',
          title: 'Sample Card 1',
          description: 'This is a sample card',
          imageUrl: '/assets/sample-card-1.jpg',
          thumbnailUrl: '/assets/sample-card-1-thumb.jpg',
          tags: ['sample', 'mock'],
          userId: 'user1',
          isPublic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          effects: [],
          rarity: CardRarity.COMMON, // Using enum instead of string
          designMetadata: {
            cardStyle: { template: 'default', effect: 'none', borderRadius: '12px', borderColor: '#000', shadowColor: '#000', frameWidth: 2, frameColor: '#000' },
            textStyle: { titleColor: '#000', titleAlignment: 'center', titleWeight: 'bold', descriptionColor: '#333' },
            cardMetadata: { category: 'sample', series: 'mock', cardType: 'standard' },
            marketMetadata: { isPrintable: true, isForSale: false, includeInCatalog: true }
          },
          isFavorite: false,
          viewCount: 0,
          lastViewed: new Date().toISOString() // String format
        }
      ];
      
      setCards(mockCards);
      setFavorites(mockCards.filter(card => card.isFavorite));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cards'));
    } finally {
      setLoading(false);
    }
  };

  // Add the getCardById method
  const getCardById = (id: string): EnhancedCard | undefined => {
    return cards.find(card => card.id === id);
  };

  const addCard = async (card: Partial<Card>): Promise<Card> => {
    try {
      // Simulate API call
      const newCard: EnhancedCard = {
        ...card,
        id: `card-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: card.isPublic ?? false,
        tags: card.tags ?? [],
        effects: card.effects ?? [],
        rarity: card.rarity ?? 'common',
        designMetadata: card.designMetadata ?? {
          cardStyle: { template: 'default', effect: 'none', borderRadius: '12px', borderColor: '#000', shadowColor: '#000', frameWidth: 2, frameColor: '#000' },
          textStyle: { titleColor: '#000', titleAlignment: 'center', titleWeight: 'bold', descriptionColor: '#333' },
          cardMetadata: { category: 'custom', series: 'user', cardType: 'standard' },
          marketMetadata: { isPrintable: true, isForSale: false, includeInCatalog: true }
        },
        isFavorite: false,
        viewCount: 0
      } as EnhancedCard;
      
      setCards(prevCards => [...prevCards, newCard]);
      return newCard;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add card'));
      throw err;
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<Card> => {
    try {
      // Simulate API call
      const updatedCard = cards.map(card => 
        card.id === id ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
      );
      
      setCards(updatedCard);
      
      const updated = updatedCard.find(card => card.id === id);
      if (!updated) {
        throw new Error('Card not found');
      }
      
      // Update favorites if needed
      if (updated.isFavorite) {
        setFavorites(prev => 
          prev.some(f => f.id === id) 
            ? prev.map(f => f.id === id ? updated : f)
            : [...prev, updated]
        );
      } else {
        setFavorites(prev => prev.filter(f => f.id !== id));
      }
      
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update card'));
      throw err;
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    try {
      // Simulate API call
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      setFavorites(prevFavorites => prevFavorites.filter(card => card.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete card'));
      throw err;
    }
  };

  const toggleFavorite = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;
    
    const isFavorite = !card.isFavorite;
    updateCard(id, { ...card, isFavorite });
  };

  // Load cards on mount
  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <CardContext.Provider
      value={{
        cards,
        favorites,
        loading,
        error,
        fetchCards,
        addCard,
        updateCard,
        deleteCard,
        toggleFavorite,
        getCardById // Include the new method
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
