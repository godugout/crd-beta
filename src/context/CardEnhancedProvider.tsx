
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCards } from './CardContext';
import { Card } from '@/lib/types';
import { Deck, EnhancedCard, Series } from '@/lib/types/CardTypes';

interface CardEnhancedContextType {
  enhancedCards: EnhancedCard[];
  series: Series[];
  decks: Deck[];
  isLoading: boolean;
  error: Error | null;
  getDeckById: (id: string) => Deck | undefined;
  getSeriesById: (id: string) => Series | undefined;
  addCardToDeck: (deckId: string, cardId: string) => void;
  removeCardFromDeck: (deckId: string, cardId: string) => void;
  createDeck: (deck: Partial<Deck>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<void>;
  cards: Card[]; // Include the regular cards too
}

export const CardEnhancedContext = createContext<CardEnhancedContextType | undefined>(undefined);

export const CardEnhancedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cards } = useCards();
  const [enhancedCards, setEnhancedCards] = useState<EnhancedCard[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Convert regular cards to enhanced cards
  useEffect(() => {
    if (cards.length > 0) {
      const enhanced = cards.map(card => ({
        ...card,
        rarity: card.rarity || 'common',
        cardNumber: card.id.substring(0, 6),
        editionSize: 100,
      }));
      
      setEnhancedCards(enhanced);
      setIsLoading(false);
    }
  }, [cards]);

  // Initialize with some sample data
  useEffect(() => {
    // Sample decks data
    const sampleDecks: Deck[] = [
      {
        id: 'deck1',
        name: 'My Favorite Cards',
        description: 'A collection of my favorite trading cards',
        coverImageUrl: '',
        ownerId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cardIds: cards.slice(0, 5).map(card => card.id),
        isPublic: true
      },
      {
        id: 'deck2',
        name: 'Oakland Memories',
        description: 'Special moments from Oakland games',
        coverImageUrl: '',
        ownerId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cardIds: cards.slice(5, 10).map(card => card.id),
        isPublic: false
      }
    ];
    
    // Sample series data
    const sampleSeries: Series[] = [
      {
        id: 'series1',
        title: '2023 Collection',
        description: 'The complete 2023 baseball card collection',
        coverImageUrl: '',
        artistId: 'artist1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        releaseDate: new Date().toISOString(),
        totalCards: 20,
        isPublished: true,
        cardIds: cards.slice(0, 20).map(card => card.id),
        releaseType: 'standard'
      }
    ];
    
    setDecks(sampleDecks);
    setSeries(sampleSeries);
  }, [cards]);

  const getDeckById = (id: string) => {
    return decks.find(deck => deck.id === id);
  };

  const getSeriesById = (id: string) => {
    return series.find(series => series.id === id);
  };

  const addCardToDeck = (deckId: string, cardId: string) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === deckId && !deck.cardIds.includes(cardId)) {
        return {
          ...deck,
          cardIds: [...deck.cardIds, cardId],
          updatedAt: new Date().toISOString()
        };
      }
      return deck;
    }));
  };

  const removeCardFromDeck = (deckId: string, cardId: string) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cardIds: deck.cardIds.filter(id => id !== cardId),
          updatedAt: new Date().toISOString()
        };
      }
      return deck;
    }));
  };

  const createDeck = async (deck: Partial<Deck>): Promise<Deck> => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      name: deck.name || 'New Deck',
      description: deck.description || '',
      coverImageUrl: deck.coverImageUrl || '',
      ownerId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cardIds: deck.cardIds || [],
      isPublic: deck.isPublic || false,
    };
    
    setDecks(prev => [...prev, newDeck]);
    return newDeck;
  };

  const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck> => {
    let updatedDeck: Deck | undefined;
    
    setDecks(prev => prev.map(deck => {
      if (deck.id === id) {
        updatedDeck = {
          ...deck,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return updatedDeck;
      }
      return deck;
    }));
    
    if (!updatedDeck) {
      throw new Error(`Deck with id ${id} not found`);
    }
    
    return updatedDeck;
  };

  const deleteDeck = async (id: string): Promise<void> => {
    setDecks(prev => prev.filter(deck => deck.id !== id));
  };

  const value = {
    enhancedCards,
    series,
    decks,
    isLoading,
    error,
    getDeckById,
    getSeriesById,
    addCardToDeck,
    removeCardFromDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    cards // Include the regular cards too
  };

  return (
    <CardEnhancedContext.Provider value={value}>
      {children}
    </CardEnhancedContext.Provider>
  );
};

export const useCardEnhanced = (): CardEnhancedContextType => {
  const context = useContext(CardEnhancedContext);
  
  if (context === undefined) {
    throw new Error('useEnhancedCards must be used within a CardEnhancedProvider');
  }
  
  return context;
};
