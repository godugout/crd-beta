
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, CardRarity } from '@/lib/types';
import { EnhancedCard, Deck, Series } from '@/lib/types/enhancedCardTypes';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { adaptToEnhancedCard, cardToEnhancedCard } from '@/lib/adapters/EnhancedCardAdapter';

/**
 * Enhanced Card Context Props
 */
export interface EnhancedCardContextProps {
  cards: EnhancedCard[];
  decks: Deck[];
  series: Series[];
  favorites: string[];
  loading: boolean;
  error: Error | null;
  isLoading: boolean;
  fetchCards: () => Promise<void>;
  fetchDecks: () => Promise<void>;
  fetchSeries: () => Promise<void>;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, card: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => void;
  getCard: (id: string) => EnhancedCard | undefined;
  addDeck: (deck: Partial<Deck>) => Promise<Deck>;
  updateDeck: (id: string, deck: Partial<Deck>) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<boolean>;
  addCardToDeck: (deckId: string, cardId: string) => Promise<boolean>;
  removeCardFromDeck: (deckId: string, cardId: string) => Promise<boolean>;
  addSeries: (series: Partial<Series>) => Promise<Series>;
  updateSeries: (id: string, series: Partial<Series>) => Promise<Series>;
  deleteSeries: (id: string) => Promise<boolean>;
  addCardToSeries: (seriesId: string, cardId: string) => Promise<boolean>;
  removeCardFromSeries: (seriesId: string, cardId: string) => Promise<boolean>;
}

/**
 * Enhanced Card Context
 */
export const EnhancedCardContext = createContext<EnhancedCardContextProps | undefined>(undefined);

export const EnhancedCardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<EnhancedCard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [seriesItems, setSeries] = useState<Series[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock data loading
    setLoading(true);
    setTimeout(() => {
      setCards([
        {
          id: '1',
          title: 'Enhanced Card 1',
          description: 'Description for enhanced card 1',
          imageUrl: 'https://via.placeholder.com/150',
          thumbnailUrl: 'https://via.placeholder.com/150',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          effects: [],
          isFavorite: false,
          rarity: CardRarity.COMMON,
          views: 10,
          likes: 2,
          shares: 1,
          tags: [] // Added required tags property
        },
        {
          id: '2',
          title: 'Enhanced Card 2',
          description: 'Description for enhanced card 2',
          imageUrl: 'https://via.placeholder.com/150',
          thumbnailUrl: 'https://via.placeholder.com/150',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          effects: [],
          isFavorite: true,
          rarity: CardRarity.RARE,
          views: 15,
          likes: 5,
          shares: 2,
          tags: [] // Added required tags property
        }
      ]);
      setDecks([
        {
          id: 'deck-1',
          name: 'My First Deck',
          description: 'A sample deck',
          ownerId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cardIds: ['1', '2'],
          isPublic: true
        }
      ]);
      setSeries([
        {
          id: 'series-1',
          name: 'Sample Series',
          description: 'A sample series',
          coverImageUrl: 'https://via.placeholder.com/150',
          artistId: 'artist-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          releaseDate: new Date().toISOString(),
          totalCards: 2,
          isPublished: true,
          cardIds: ['1', '2'],
          releaseType: 'standard'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const fetchCards = async () => {
    // Fetch cards logic
  };

  const fetchDecks = async () => {
    // Fetch decks logic
  };

  const fetchSeries = async () => {
    // Fetch series logic
  };

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    setLoading(true);
    try {
      const baseCard = adaptToCard({
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.thumbnailUrl || '',
        tags: cardData.tags || [],
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rarity: cardData.rarity || CardRarity.COMMON,
        effects: [],
        isFavorite: cardData.isFavorite ?? false,
        ...cardData
      });
      
      // Convert to enhanced card for storage
      const enhancedCard = cardToEnhancedCard(baseCard);
      
      setCards(prevCards => [...prevCards, enhancedCard]);
      return baseCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add card');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<Card> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cardIndex = cards.findIndex(card => card.id === id);
        if (cardIndex === -1) {
          reject(new Error(`Card with ID ${id} not found`));
          return;
        }

        const updatedEnhancedCard = {
          ...cards[cardIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        const newCards = [...cards];
        newCards[cardIndex] = updatedEnhancedCard;

        setCards(newCards);
        
        // Convert EnhancedCard to Card for return value
        const cardToReturn = adaptToCard({
          ...updatedEnhancedCard,
          edition: typeof updatedEnhancedCard.edition === 'number' ? 
            { number: updatedEnhancedCard.edition, total: 1 } : 
            updatedEnhancedCard.edition
        });
        
        resolve(cardToReturn);
      }, 500);
    });
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
        setFavorites(prevFavorites => prevFavorites.filter(favId => favId !== id));
        resolve(true);
      }, 500);
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter(favId => favId !== id);
      } else {
        return [...prevFavorites, id];
      }
    });
  };

  const addDeck = async (deckData: Partial<Deck>): Promise<Deck> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDeck: Deck = {
          id: `deck-${Date.now()}`,
          name: deckData.name || 'Untitled Deck',
          description: deckData.description || '',
          ownerId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cardIds: deckData.cardIds || [],
          isPublic: deckData.isPublic ?? false
        };
        setDecks(prevDecks => [...prevDecks, newDeck]);
        resolve(newDeck);
      }, 500);
    });
  };

  const updateDeck = async (id: string, deckUpdates: Partial<Deck>): Promise<Deck> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const deckIndex = decks.findIndex(deck => deck.id === id);
        if (deckIndex === -1) {
          reject(new Error(`Deck with ID ${id} not found`));
          return;
        }

        const updatedDeck: Deck = {
          ...decks[deckIndex],
          ...deckUpdates,
          updatedAt: new Date().toISOString()
        };

        const newDecks = [...decks];
        newDecks[deckIndex] = updatedDeck;

        setDecks(newDecks);
        resolve(updatedDeck);
      }, 500);
    });
  };

  const deleteDeck = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDecks(prevDecks => prevDecks.filter(deck => deck.id !== id));
        resolve(true);
      }, 500);
    });
  };

  const addCardToDeck = async (deckId: string, cardId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDecks(prevDecks => {
        const deckIndex = prevDecks.findIndex(deck => deck.id === deckId);
        if (deckIndex === -1) {
          console.warn(`Deck with ID ${deckId} not found`);
          return prevDecks;
        }

        const deck = prevDecks[deckIndex];
        if (deck.cardIds.includes(cardId)) {
          console.warn(`Card ${cardId} already in deck ${deckId}`);
          return prevDecks;
        }

        const updatedDeck: Deck = {
          ...deck,
          cardIds: [...deck.cardIds, cardId],
          updatedAt: new Date().toISOString()
        };

        const newDecks = [...prevDecks];
        newDecks[deckIndex] = updatedDeck;
        resolve(true);
        return newDecks;
      });
    });
  };

  const removeCardFromDeck = async (deckId: string, cardId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDecks(prevDecks => {
        const deckIndex = prevDecks.findIndex(deck => deck.id === deckId);
        if (deckIndex === -1) {
          console.warn(`Deck with ID ${deckId} not found`);
          return prevDecks;
        }

        const deck = prevDecks[deckIndex];
        if (!deck.cardIds.includes(cardId)) {
          console.warn(`Card ${cardId} not in deck ${deckId}`);
          return prevDecks;
        }

        const updatedDeck: Deck = {
          ...deck,
          cardIds: deck.cardIds.filter(id => id !== cardId),
          updatedAt: new Date().toISOString()
        };

        const newDecks = [...prevDecks];
        newDecks[deckIndex] = updatedDeck;
        resolve(true);
        return newDecks;
      });
    });
  };

  const addSeries = async (seriesData: Partial<Series>): Promise<Series> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSeries: Series = {
          id: `series-${Date.now()}`,
          name: seriesData.name || 'Untitled Series',
          description: seriesData.description || '',
          coverImageUrl: seriesData.coverImageUrl || '',
          artistId: 'artist-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          releaseDate: new Date().toISOString(),
          totalCards: seriesData.totalCards || 0,
          isPublished: seriesData.isPublished ?? false,
          cardIds: seriesData.cardIds || [],
          releaseType: seriesData.releaseType || 'standard'
        };
        setSeries(prevSeries => [...prevSeries, newSeries]);
        resolve(newSeries);
      }, 500);
    });
  };

  const updateSeries = async (id: string, seriesUpdates: Partial<Series>): Promise<Series> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const seriesIndex = seriesItems.findIndex(s => s.id === id);
        if (seriesIndex === -1) {
          reject(new Error(`Series with ID ${id} not found`));
          return;
        }

        const updatedSeries: Series = {
          ...seriesItems[seriesIndex],
          ...seriesUpdates,
          updatedAt: new Date().toISOString()
        };

        const newSeries = [...seriesItems];
        newSeries[seriesIndex] = updatedSeries;

        setSeries(newSeries);
        resolve(updatedSeries);
      }, 500);
    });
  };

  const deleteSeries = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSeries(prevSeries => prevSeries.filter(s => s.id !== id));
        resolve(true);
      }, 500);
    });
  };

  const addCardToSeries = async (seriesId: string, cardId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const seriesIndex = seriesItems.findIndex(s => s.id === seriesId);
        if (seriesIndex === -1) {
          console.warn(`Series with ID ${seriesId} not found`);
          resolve(false);
          return;
        }

        const currentSeries = seriesItems[seriesIndex];
        if (currentSeries.cardIds.includes(cardId)) {
          console.warn(`Card ${cardId} already in series ${seriesId}`);
          resolve(false);
          return;
        }

        const updatedSeries: Series = {
          ...currentSeries,
          cardIds: [...currentSeries.cardIds, cardId],
          updatedAt: new Date().toISOString()
        };

        const newSeries = [...seriesItems];
        newSeries[seriesIndex] = updatedSeries;
        setSeries(newSeries);
        resolve(true);
      }, 500);
    });
  };

  const removeCardFromSeries = async (seriesId: string, cardId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const seriesIndex = seriesItems.findIndex(s => s.id === seriesId);
        if (seriesIndex === -1) {
          console.warn(`Series with ID ${seriesId} not found`);
          resolve(false);
          return;
        }

        const currentSeries = seriesItems[seriesIndex];
        if (!currentSeries.cardIds.includes(cardId)) {
          console.warn(`Card ${cardId} not in series ${seriesId}`);
          resolve(false);
          return;
        }

        const updatedSeries: Series = {
          ...currentSeries,
          cardIds: currentSeries.cardIds.filter(id => id !== cardId),
          updatedAt: new Date().toISOString()
        };

        const newSeries = [...seriesItems];
        newSeries[seriesIndex] = updatedSeries;
        setSeries(newSeries);
        resolve(true);
      }, 500);
    });
  };

  const getCard = (id: string): EnhancedCard | undefined => {
    return cards.find(card => card.id === id);
  };

  const value: EnhancedCardContextProps = {
    cards,
    decks,
    series: seriesItems,
    favorites,
    loading,
    isLoading,
    error,
    fetchCards,
    fetchDecks,
    fetchSeries,
    addCard,
    updateCard,
    deleteCard,
    toggleFavorite,
    getCard,
    addDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    addSeries,
    updateSeries,
    deleteSeries,
    addCardToSeries,
    removeCardFromSeries
  };

  return (
    <EnhancedCardContext.Provider value={value}>
      {children}
    </EnhancedCardContext.Provider>
  );
};

/**
 * Hook to use the enhanced card context
 */
export const useEnhancedCards = () => {
  const context = useContext(EnhancedCardContext);
  if (!context) {
    throw new Error('useEnhancedCards must be used within an EnhancedCardProvider');
  }
  return context;
};
