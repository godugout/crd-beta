import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardRarity as BaseCardRarity } from '@/lib/types';
import { EnhancedCard, Series, Deck, ReleaseType } from '@/lib/types/enhancedCardTypes';
import { sampleCards } from '@/lib/data/sampleCards';
import { toast } from 'sonner';

export { CardRarity } from '@/lib/types/enhancedCardTypes';

export interface EnhancedCardContextProps {
  cards: EnhancedCard[];
  series: Series[];
  decks: Deck[];
  favorites: string[];
  selectedCardId: string | null;
  selectedSeriesId: string | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCards: () => Promise<void>;
  getCardById: (id: string) => EnhancedCard | undefined;
  addCard: (card: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  updateCard: (id: string, updates: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  deleteCard: (id: string) => Promise<boolean>;
  setSelectedCardId: (id: string | null) => void;
  
  fetchSeries: () => Promise<void>;
  getSeriesById: (id: string) => Series | undefined;
  addSeries: (series: Series) => Promise<Series>;
  updateSeries: (id: string, updates: Partial<Series>) => Promise<Series>;
  deleteSeries: (id: string) => Promise<boolean>;
  setSelectedSeriesId: (id: string | null) => void;
  addCardToSeries: (cardId: string, seriesId: string) => Promise<boolean>;
  removeCardFromSeries: (cardId: string, seriesId: string) => Promise<boolean>;
  getCardsInSeries: (seriesId: string) => EnhancedCard[];
  
  toggleFavorite: (cardId: string) => void;
  
  addDeck: (deck: Partial<Deck>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<boolean>;
  addCardToDeck: (cardId: string, deckId: string) => Promise<boolean>;
  removeCardFromDeck: (cardId: string, deckId: string) => Promise<boolean>;
  
  collections: any[];
  fetchCollections: () => Promise<void>;
  addCollection: (collection: any) => Promise<any>;
  updateCollection: (id: string, updates: any) => Promise<any>;
  deleteCollection: (id: string) => Promise<boolean>;
}

const EnhancedCardContext = createContext<EnhancedCardContextProps | null>(null);

const sampleSeries: Series[] = [
  {
    id: '1',
    title: 'Oakland Collection',
    description: 'A collection of Oakland-themed cards',
    coverImageUrl: 'https://placehold.co/600x400/png',
    artistId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releaseDate: new Date().toISOString(),
    totalCards: 5,
    isPublished: true,
    cardIds: ['card1', 'card2', 'card3'],
    releaseType: 'standard'
  },
  {
    id: '2',
    title: 'Limited Edition',
    description: 'Rare and exclusive cards',
    coverImageUrl: 'https://placehold.co/600x400/png',
    artistId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releaseDate: new Date().toISOString(),
    totalCards: 3,
    isPublished: true,
    cardIds: ['card4', 'card5'],
    releaseType: 'limited'
  }
];

const enhanceCard = (card: Card): EnhancedCard => {
  return {
    ...card,
    cardNumber: card.cardNumber || `${Math.floor(Math.random() * 1000)}`,
    seriesId: card.collectionId,
    artistId: card.userId,
    artistName: 'Unknown Artist',
    edition: 1,
    editionSize: 100,
    releaseDate: card.createdAt,
    qrCodeData: `card-${card.id}`,
    marketData: {
      price: 0,
      currency: 'USD',
      availableForSale: false
    }
  };
};

export const EnhancedCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<EnhancedCard[]>(() => sampleCards.map(enhanceCard));
  const [series, setSeries] = useState<Series[]>(sampleSeries);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to fetch cards');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardById = (id: string) => {
    return cards.find(card => card.id === id);
  };

  const addCard = async (cardData: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    const timestamp = new Date().toISOString();
    
    const newCard: EnhancedCard = {
      id: uuidv4(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
      tags: cardData.tags || [],
      userId: cardData.userId || 'anonymous',
      createdAt: timestamp,
      updatedAt: timestamp,
      rarity: cardData.rarity || BaseCardRarity.COMMON,
      effects: cardData.effects || [],
      designMetadata: cardData.designMetadata || {},
      
      cardNumber: cardData.cardNumber || `${Math.floor(Math.random() * 1000)}`,
      seriesId: cardData.seriesId,
      artistId: cardData.artistId || cardData.userId || 'anonymous',
      artistName: cardData.artistName || 'Unknown Artist',
      edition: cardData.edition || 1,
      editionSize: cardData.editionSize || 100,
      releaseDate: cardData.releaseDate || timestamp,
      qrCodeData: cardData.qrCodeData || `card-${uuidv4()}`,
      marketData: cardData.marketData || {
        price: 0,
        currency: 'USD',
        availableForSale: false
      }
    };
    
    setCards(prev => [...prev, newCard]);
    toast.success('Card added successfully!');
    return newCard;
  };

  const updateCard = async (id: string, updates: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    const cardIndex = cards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      throw new Error('Card not found');
    }
    
    const updatedCard: EnhancedCard = {
      ...cards[cardIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const updatedCards = [...cards];
    updatedCards[cardIndex] = updatedCard;
    setCards(updatedCards);
    
    toast.success('Card updated successfully!');
    return updatedCard;
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    const cardIndex = cards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      return false;
    }
    
    setCards(prev => prev.filter(card => card.id !== id));
    
    setSeries(prev => 
      prev.map(s => ({
        ...s,
        cardIds: s.cardIds.filter(cid => cid !== id),
        totalCards: s.cardIds.filter(cid => cid !== id).length
      }))
    );
    
    toast.success('Card deleted successfully!');
    return true;
  };

  const fetchSeries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to fetch series');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeriesById = (id: string) => {
    return series.find(s => s.id === id);
  };

  const addSeries = async (seriesData: Series): Promise<Series> => {
    const newSeries: Series = {
      ...seriesData,
      id: seriesData.id || uuidv4(),
      createdAt: seriesData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalCards: seriesData.cardIds?.length || 0
    };
    
    setSeries(prev => [...prev, newSeries]);
    toast.success('Series added successfully!');
    return newSeries;
  };

  const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series> => {
    const seriesIndex = series.findIndex(s => s.id === id);
    
    if (seriesIndex === -1) {
      throw new Error('Series not found');
    }
    
    const updatedSeries: Series = {
      ...series[seriesIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      totalCards: updates.cardIds?.length || series[seriesIndex].totalCards
    };
    
    const updatedSeriesList = [...series];
    updatedSeriesList[seriesIndex] = updatedSeries;
    setSeries(updatedSeriesList);
    
    toast.success('Series updated successfully!');
    return updatedSeries;
  };

  const deleteSeries = async (id: string): Promise<boolean> => {
    const seriesIndex = series.findIndex(s => s.id === id);
    
    if (seriesIndex === -1) {
      return false;
    }
    
    setSeries(prev => prev.filter(s => s.id !== id));
    toast.success('Series deleted successfully!');
    return true;
  };

  const addCardToSeries = async (cardId: string, seriesId: string): Promise<boolean> => {
    const seriesIndex = series.findIndex(s => s.id === seriesId);
    
    if (seriesIndex === -1) {
      return false;
    }
    
    const targetSeries = series[seriesIndex];
    
    if (targetSeries.cardIds.includes(cardId)) {
      return true; // Card already in series
    }
    
    const updatedSeries = {
      ...targetSeries,
      cardIds: [...targetSeries.cardIds, cardId],
      totalCards: targetSeries.cardIds.length + 1,
      updatedAt: new Date().toISOString()
    };
    
    const updatedSeriesList = [...series];
    updatedSeriesList[seriesIndex] = updatedSeries;
    setSeries(updatedSeriesList);
    
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      const updatedCard = {
        ...cards[cardIndex],
        seriesId,
        updatedAt: new Date().toISOString()
      };
      
      const updatedCards = [...cards];
      updatedCards[cardIndex] = updatedCard;
      setCards(updatedCards);
    }
    
    toast.success('Card added to series successfully!');
    return true;
  };

  const removeCardFromSeries = async (cardId: string, seriesId: string): Promise<boolean> => {
    const seriesIndex = series.findIndex(s => s.id === seriesId);
    
    if (seriesIndex === -1) {
      return false;
    }
    
    const targetSeries = series[seriesIndex];
    
    if (!targetSeries.cardIds.includes(cardId)) {
      return true; // Card not in series
    }
    
    const updatedSeries = {
      ...targetSeries,
      cardIds: targetSeries.cardIds.filter(cid => cid !== cardId),
      totalCards: targetSeries.cardIds.length - 1,
      updatedAt: new Date().toISOString()
    };
    
    const updatedSeriesList = [...series];
    updatedSeriesList[seriesIndex] = updatedSeries;
    setSeries(updatedSeriesList);
    
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      const updatedCard = {
        ...cards[cardIndex],
        seriesId: undefined,
        updatedAt: new Date().toISOString()
      };
      
      const updatedCards = [...cards];
      updatedCards[cardIndex] = updatedCard;
      setCards(updatedCards);
    }
    
    toast.success('Card removed from series successfully!');
    return true;
  };

  const getCardsInSeries = (seriesId: string): EnhancedCard[] => {
    const targetSeries = series.find(s => s.id === seriesId);
    if (!targetSeries) {
      return [];
    }
    
    return cards.filter(card => targetSeries.cardIds.includes(card.id));
  };

  const toggleFavorite = (cardId: string) => {
    setFavorites(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else {
        return [...prev, cardId];
      }
    });
    toast.success("Favorites updated");
  };

  const addDeck = async (deckData: Partial<Deck>): Promise<Deck> => {
    const timestamp = new Date().toISOString();
    
    const newDeck: Deck = {
      id: uuidv4(),
      name: deckData.name || 'Untitled Deck',
      description: deckData.description || '',
      coverImageUrl: deckData.coverImageUrl || '',
      ownerId: deckData.ownerId || 'anonymous',
      createdAt: timestamp,
      updatedAt: timestamp,
      cardIds: deckData.cardIds || [],
      isPublic: deckData.isPublic || false
    };
    
    setDecks(prev => [...prev, newDeck]);
    toast.success('Deck created successfully!');
    return newDeck;
  };

  const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck> => {
    const deckIndex = decks.findIndex(deck => deck.id === id);
    
    if (deckIndex === -1) {
      throw new Error('Deck not found');
    }
    
    const updatedDeck = {
      ...decks[deckIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    setDecks(updatedDecks);
    
    toast.success('Deck updated successfully!');
    return updatedDeck;
  };

  const deleteDeck = async (id: string): Promise<boolean> => {
    const deckIndex = decks.findIndex(deck => deck.id === id);
    
    if (deckIndex === -1) {
      return false;
    }
    
    setDecks(prev => prev.filter(deck => deck.id !== id));
    toast.success('Deck deleted successfully!');
    return true;
  };

  const addCardToDeck = async (cardId: string, deckId: string): Promise<boolean> => {
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    
    if (deckIndex === -1) {
      return false;
    }
    
    const targetDeck = decks[deckIndex];
    
    if (targetDeck.cardIds.includes(cardId)) {
      return true; // Card already in deck
    }
    
    const updatedDeck = {
      ...targetDeck,
      cardIds: [...targetDeck.cardIds, cardId],
      updatedAt: new Date().toISOString()
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    setDecks(updatedDecks);
    
    toast.success('Card added to deck successfully!');
    return true;
  };

  const removeCardFromDeck = async (cardId: string, deckId: string): Promise<boolean> => {
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    
    if (deckIndex === -1) {
      return false;
    }
    
    const targetDeck = decks[deckIndex];
    
    if (!targetDeck.cardIds.includes(cardId)) {
      return true; // Card not in deck
    }
    
    const updatedDeck = {
      ...targetDeck,
      cardIds: targetDeck.cardIds.filter(id => id !== cardId),
      updatedAt: new Date().toISOString()
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    setDecks(updatedDecks);
    
    toast.success('Card removed from deck successfully!');
    return true;
  };

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      setError('Failed to fetch collections');
    } finally {
      setIsLoading(false);
    }
  };

  const addCollection = async (collection: any) => {
    setCollections(prev => [...prev, {
      ...collection,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }]);
    return collection;
  };

  const updateCollection = async (id: string, updates: any) => {
    const updatedCollections = collections.map(col => 
      col.id === id ? { ...col, ...updates, updatedAt: new Date().toISOString() } : col
    );
    setCollections(updatedCollections);
    return updatedCollections.find(col => col.id === id);
  };

  const deleteCollection = async (id: string) => {
    setCollections(prev => prev.filter(col => col.id !== id));
    return true;
  };

  const contextValue: EnhancedCardContextProps = {
    cards,
    series,
    decks,
    favorites,
    collections,
    selectedCardId,
    selectedSeriesId,
    isLoading,
    error,
    
    fetchCards,
    getCardById,
    addCard,
    updateCard,
    deleteCard,
    setSelectedCardId,
    
    fetchSeries,
    getSeriesById,
    addSeries,
    updateSeries,
    deleteSeries,
    setSelectedSeriesId,
    addCardToSeries,
    removeCardFromSeries,
    getCardsInSeries,
    
    toggleFavorite,
    
    addDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    
    fetchCollections,
    addCollection,
    updateCollection,
    deleteCollection
  };

  return (
    <EnhancedCardContext.Provider value={contextValue}>
      {children}
    </EnhancedCardContext.Provider>
  );
};

export const useEnhancedCards = () => {
  const context = useContext(EnhancedCardContext);
  
  if (!context) {
    throw new Error('useEnhancedCards must be used within a EnhancedCardProvider');
  }
  
  return context;
};
