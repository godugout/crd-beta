import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';

interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
  cardIds?: string[];
  isPublic?: boolean;
}

interface Series {
  id: string;
  name: string;
  description?: string;
  cards?: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedCardContextProps {
  cards: Card[];
  collections: Collection[];
  enhancedCards: Card[];
  decks: Deck[];
  favorites: Card[];
  series: Series[];
  loading: boolean;
  error: Error | null;
  fetchCards: () => Promise<void>;
  fetchCollections: () => Promise<void>;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  addCollection: (collection: Partial<Collection>) => Promise<Collection>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<boolean>;
  toggleFavorite: (cardId: string) => void;
  addDeck: (deck: Partial<Deck>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<boolean>;
  addCardToDeck: (deckId: string, cardId: string) => Promise<boolean>;
  removeCardFromDeck: (deckId: string, cardId: string) => Promise<boolean>;
  addSeries: (series: Partial<Series>) => Promise<Series>;
  updateSeries: (id: string, updates: Partial<Series>) => Promise<Series>;
}

export const EnhancedCardContext = createContext<EnhancedCardContextProps | undefined>(undefined);

export const EnhancedCardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [favorites, setFavorites] = useState<Card[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCards = async (): Promise<void> => {
    setLoading(true);
    try {
      // Mock fetching cards
      const mockCards: Card[] = [];
      setCards(mockCards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cards'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async (): Promise<void> => {
    setLoading(true);
    try {
      // Mock fetching collections
      const mockCollections: Collection[] = [];
      setCollections(mockCollections);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || '',
      userId: cardData.userId || 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effects: [],
      ...cardData
    };
    setCards(prev => [...prev, newCard]);
    return newCard;
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<Card> => {
    const updatedCard = cards.find(card => card.id === id);
    if (!updatedCard) {
      throw new Error(`Card with ID ${id} not found`);
    }
    
    const updated = { ...updatedCard, ...updates, updatedAt: new Date().toISOString() };
    setCards(prev => prev.map(card => card.id === id ? updated : card));
    return updated;
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    setCards(prev => prev.filter(card => card.id !== id));
    return true;
  };

  const addCollection = async (collectionData: Partial<Collection>): Promise<Collection> => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      title: collectionData.title || 'New Collection',
      name: collectionData.name || collectionData.title || 'New Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      userId: collectionData.userId || 'user-1',
      visibility: collectionData.visibility || 'private',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  };

  const updateCollection = async (id: string, updates: Partial<Collection>): Promise<Collection> => {
    const updatedCollection = collections.find(collection => collection.id === id);
    if (!updatedCollection) {
      throw new Error(`Collection with ID ${id} not found`);
    }
    
    const updated = { ...updatedCollection, ...updates, updatedAt: new Date().toISOString() };
    setCollections(prev => prev.map(collection => collection.id === id ? updated : collection));
    return updated;
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
    return true;
  };

  const toggleFavorite = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    const isFavorite = favorites.some(f => f.id === cardId);
    if (isFavorite) {
      setFavorites(prev => prev.filter(f => f.id !== cardId));
    } else {
      setFavorites(prev => [...prev, card]);
    }
  };

  const addDeck = async (deckData: Partial<Deck>): Promise<Deck> => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      name: deckData.name || 'New Deck',
      description: deckData.description || '',
      cards: deckData.cards || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDecks(prev => [...prev, newDeck]);
    return newDeck;
  };

  const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck> => {
    const updatedDeck = decks.find(deck => deck.id === id);
    if (!updatedDeck) {
      throw new Error(`Deck with ID ${id} not found`);
    }
    
    const updated = { ...updatedDeck, ...updates, updatedAt: new Date().toISOString() };
    setDecks(prev => prev.map(deck => deck.id === id ? updated : deck));
    return updated;
  };

  const deleteDeck = async (id: string): Promise<boolean> => {
    setDecks(prev => prev.filter(deck => deck.id !== id));
    return true;
  };

  const addCardToDeck = async (deckId: string, cardId: string): Promise<boolean> => {
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return false;
    
    const cardToAdd = cards.find(c => c.id === cardId);
    if (!cardToAdd) return false;
    
    const deckCards = decks[deckIndex].cards;
    if (deckCards.some(c => c.id === cardId)) return true; // Card already in deck
    
    const updatedDeck = {
      ...decks[deckIndex],
      cards: [...deckCards, cardToAdd],
      updatedAt: new Date().toISOString()
    };
    
    setDecks(prev => prev.map(d => d.id === deckId ? updatedDeck : d));
    return true;
  };

  const removeCardFromDeck = async (deckId: string, cardId: string): Promise<boolean> => {
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return false;
    
    const updatedDeck = {
      ...decks[deckIndex],
      cards: decks[deckIndex].cards.filter(c => c.id !== cardId),
      updatedAt: new Date().toISOString()
    };
    
    setDecks(prev => prev.map(d => d.id === deckId ? updatedDeck : d));
    return true;
  };

  const addSeries = async (seriesData: Partial<Series>): Promise<Series> => {
    const newSeries: Series = {
      id: `series-${Date.now()}`,
      name: seriesData.name || 'New Series',
      description: seriesData.description || '',
      cards: seriesData.cards || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSeries(prev => [...prev, newSeries]);
    return newSeries;
  };

  const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series> => {
    const updatedSeries = series.find(s => s.id === id);
    if (!updatedSeries) {
      throw new Error(`Series with ID ${id} not found`);
    }
    
    const updated = { ...updatedSeries, ...updates, updatedAt: new Date().toISOString() };
    setSeries(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  };

  const value: EnhancedCardContextProps = {
    cards,
    collections,
    enhancedCards: cards,
    decks,
    favorites,
    series,
    loading,
    error,
    fetchCards,
    fetchCollections,
    addCard,
    updateCard,
    deleteCard,
    addCollection,
    updateCollection,
    deleteCollection,
    toggleFavorite,
    addDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    addSeries,
    updateSeries
  };

  return (
    <EnhancedCardContext.Provider value={value}>
      {children}
    </EnhancedCardContext.Provider>
  );
};

export const useEnhancedCards = () => {
  const context = useContext(EnhancedCardContext);
  if (!context) {
    throw new Error('useEnhancedCards must be used within an EnhancedCardProvider');
  }
  return context;
};
