import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EnhancedCard, Series, Deck, CardRarity } from '@/lib/types/enhancedCardTypes';
import { toast } from 'sonner';

// Sample data
const sampleEnhancedCards: EnhancedCard[] = [
  {
    id: '1',
    title: 'Michael Jordan Rookie',
    description: 'Rare rookie card from the greatest basketball player of all time',
    imageUrl: 'https://example.com/mj-rookie.jpg',
    thumbnailUrl: 'https://example.com/mj-rookie-thumb.jpg',
    tags: ['basketball', 'rookie', 'legend'],
    userId: 'user123',
    isPublic: true,
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z',
    rarity: 'legendary' as CardRarity,
    cardNumber: '23/100',
    seriesId: 'bulls-legends',
    artistId: 'artist1',
    artistName: 'Jane Smith',
    edition: 1,
    editionSize: 100,
    releaseDate: '2023-01-01T00:00:00Z',
    qrCodeData: 'https://verify.cardcollection.io/card/1',
    effects: ['holographic', 'glow'],
    designMetadata: {
      cardStyle: {
        template: 'premium',
        effect: 'holographic',
        borderRadius: '10px',
        borderColor: '#d4af37',
        shadowColor: '#000000',
        frameWidth: 5,
        frameColor: '#d4af37'
      },
      textStyle: {
        titleColor: '#ffffff',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#cccccc'
      },
      cardMetadata: {
        category: 'sports',
        series: 'legends',
        cardType: 'premium'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    },
    marketData: {
      price: 5000,
      currency: 'USD',
      availableForSale: true,
      lastSoldPrice: 4500,
      lastSoldDate: '2022-12-15T00:00:00Z'
    }
  },
  // Add more sample enhanced cards as needed
];

// Context types
interface EnhancedCardContextProps {
  enhancedCards: EnhancedCard[];
  series: Series[];
  decks: Deck[];
  isLoading: boolean;
  error: Error | null;
  getEnhancedCardById: (id: string) => EnhancedCard | undefined;
  getSeriesById: (id: string) => Series | undefined;
  getDeckById: (id: string) => Deck | undefined;
  addEnhancedCard: (card: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  updateEnhancedCard: (id: string, updates: Partial<EnhancedCard>) => Promise<boolean>;
  deleteEnhancedCard: (id: string) => Promise<boolean>;
  addSeries: (series: Partial<Series>) => Promise<Series>;
  updateSeries: (id: string, updates: Partial<Series>) => Promise<boolean>;
  deleteSeries: (id: string) => Promise<boolean>;
  addCardToSeries: (cardId: string, seriesId: string) => Promise<boolean>;
  removeCardFromSeries: (cardId: string, seriesId: string) => Promise<boolean>;
  addDeck: (deck: Partial<Deck>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<boolean>;
  deleteDeck: (id: string) => Promise<boolean>;
  addCardToDeck: (cardId: string, deckId: string) => Promise<boolean>;
  removeCardFromDeck: (cardId: string, deckId: string) => Promise<boolean>;
}

// Create context with default values
const EnhancedCardContext = createContext<EnhancedCardContextProps | undefined>(undefined);

// Provider component
export const EnhancedCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enhancedCards, setEnhancedCards] = useState<EnhancedCard[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize with sample data
  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch from an API
        // For now, use sample data
        setEnhancedCards(sampleEnhancedCards);
        
        // Sample series data
        setSeries([
          {
            id: 'bulls-legends',
            title: 'Chicago Bulls Legends',
            description: 'Collection of legendary Bulls players',
            coverImageUrl: 'https://example.com/bulls-legends.jpg',
            artistId: 'artist1',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            releaseDate: '2023-01-15T00:00:00Z',
            totalCards: 10,
            isPublished: true,
            cardIds: ['1'],
            releaseType: 'limited'
          }
        ]);
        
        // Sample decks data
        setDecks([
          {
            id: 'user-favorites',
            name: 'My Favorites',
            description: 'User collection of favorite cards',
            coverImageUrl: 'https://example.com/favorites.jpg',
            ownerId: 'user123',
            createdAt: '2023-01-05T00:00:00Z',
            updatedAt: '2023-01-05T00:00:00Z',
            cardIds: ['1'],
            isPublic: true
          }
        ]);
        
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Unknown error loading enhanced cards');
        setError(err);
        console.error('Error loading enhanced card data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Helper functions
  const getEnhancedCardById = useCallback((id: string) => {
    return enhancedCards.find(card => card.id === id);
  }, [enhancedCards]);

  const getSeriesById = useCallback((id: string) => {
    return series.find(s => s.id === id);
  }, [series]);

  const getDeckById = useCallback((id: string) => {
    return decks.find(d => d.id === id);
  }, [decks]);

  // Card CRUD operations
  const addEnhancedCard = useCallback(async (card: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    try {
      const newCard: EnhancedCard = {
        id: uuidv4(),
        title: card.title || 'Untitled Card',
        description: card.description || '',
        imageUrl: card.imageUrl || '',
        thumbnailUrl: card.thumbnailUrl || '',
        tags: card.tags || [],
        userId: card.userId || 'anonymous',
        isPublic: card.isPublic ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rarity: card.rarity || 'common',
        cardNumber: card.cardNumber || '',
        seriesId: card.seriesId || '',
        artistId: card.artistId || '',
        artistName: card.artistName || '',
        edition: card.edition || 1,
        editionSize: card.editionSize || 0,
        releaseDate: card.releaseDate || new Date().toISOString(),
        qrCodeData: card.qrCodeData || '',
        effects: card.effects || [],
        designMetadata: card.designMetadata || {
          cardStyle: {
            template: 'standard',
            effect: 'standard',
            borderRadius: '8px',
            borderColor: '#000000',
            shadowColor: '#000000',
            frameWidth: 5,
            frameColor: '#000000'
          },
          textStyle: {
            titleColor: '#000000',
            titleAlignment: 'center',
            titleWeight: 'bold',
            descriptionColor: '#333333'
          },
          cardMetadata: {
            category: 'standard',
            series: 'default',
            cardType: 'standard'
          },
          marketMetadata: {
            isPrintable: true,
            isForSale: false,
            includeInCatalog: false
          }
        },
        marketData: card.marketData || {
          price: 0,
          currency: 'USD',
          availableForSale: false
        }
      };
      
      setEnhancedCards(prev => [...prev, newCard]);
      toast.success('Card created successfully');
      return newCard;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to add card');
      toast.error(`Error creating card: ${err.message}`);
      throw err;
    }
  }, []);

  const updateEnhancedCard = useCallback(async (id: string, updates: Partial<EnhancedCard>): Promise<boolean> => {
    try {
      const cardExists = enhancedCards.some(card => card.id === id);
      if (!cardExists) {
        toast.error(`Card with ID ${id} not found`);
        return false;
      }
      
      setEnhancedCards(prev => 
        prev.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date().toISOString() } 
            : card
        )
      );
      
      toast.success('Card updated successfully');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update card');
      toast.error(`Error updating card: ${err.message}`);
      return false;
    }
  }, [enhancedCards]);

  const deleteEnhancedCard = useCallback(async (id: string): Promise<boolean> => {
    try {
      const cardExists = enhancedCards.some(card => card.id === id);
      if (!cardExists) {
        toast.error(`Card with ID ${id} not found`);
        return false;
      }
      
      setEnhancedCards(prev => prev.filter(card => card.id !== id));
      
      // Also remove from any series or decks
      setSeries(prev => 
        prev.map(s => ({
          ...s,
          cardIds: s.cardIds.filter(cardId => cardId !== id)
        }))
      );
      
      setDecks(prev => 
        prev.map(d => ({
          ...d,
          cardIds: d.cardIds.filter(cardId => cardId !== id)
        }))
      );
      
      toast.success('Card deleted successfully');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to delete card');
      toast.error(`Error deleting card: ${err.message}`);
      return false;
    }
  }, [enhancedCards]);

  // Series CRUD operations
  const addSeries = useCallback(async (seriesData: Partial<Series>): Promise<Series> => {
    try {
      const newSeries: Series = {
        id: uuidv4(),
        title: seriesData.title || 'Untitled Series',
        description: seriesData.description || '',
        coverImageUrl: seriesData.coverImageUrl || '',
        artistId: seriesData.artistId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        releaseDate: seriesData.releaseDate || new Date().toISOString(),
        totalCards: seriesData.totalCards || 0,
        isPublished: seriesData.isPublished ?? false,
        cardIds: seriesData.cardIds || [],
        releaseType: seriesData.releaseType || 'standard'
      };
      
      setSeries(prev => [...prev, newSeries]);
      toast.success('Series created successfully');
      return newSeries;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to add series');
      toast.error(`Error creating series: ${err.message}`);
      throw err;
    }
  }, []);

  const updateSeries = useCallback(async (id: string, updates: Partial<Series>): Promise<boolean> => {
    try {
      const seriesExists = series.some(s => s.id === id);
      if (!seriesExists) {
        toast.error(`Series with ID ${id} not found`);
        return false;
      }
      
      setSeries(prev => 
        prev.map(s => 
          s.id === id 
            ? { ...s, ...updates, updatedAt: new Date().toISOString() } 
            : s
        )
      );
      
      toast.success('Series updated successfully');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update series');
      toast.error(`Error updating series: ${err.message}`);
      return false;
    }
  }, [series]);

  const deleteSeries = useCallback(async (id: string): Promise<boolean> => {
    try {
      const seriesExists = series.some(s => s.id === id);
      if (!seriesExists) {
        toast.error(`Series with ID ${id} not found`);
        return false;
      }
      
      setSeries(prev => prev.filter(s => s.id !== id));
      
      // Update cards that were in this series
      setEnhancedCards(prev => 
        prev.map(card => 
          card.seriesId === id 
            ? { ...card, seriesId: '', updatedAt: new Date().toISOString() } 
            : card
        )
      );
      
      toast.success('Series deleted successfully');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to delete series');
      toast.error(`Error deleting series: ${err.message}`);
      return false;
    }
  }, [series]);

  const addCardToSeries = useCallback(async (cardId: string, seriesId: string): Promise<boolean> => {
    try {
      const card = enhancedCards.find(c => c.id === cardId);
      if (!card) {
        toast.error(`Card with ID ${cardId} not found`);
        return false;
      }
      
      const seriesItem = series.find(s => s.id === seriesId);
      if (!seriesItem) {
        toast.error(`Series with ID ${seriesId} not found`);
        return false;
      }
      
      // Check if card is already in the series
      if (seriesItem.cardIds.includes(cardId)) {
        toast.info('Card is already in this series');
        return true;
      }
      
      // Update series
      setSeries(prev => 
        prev.map(s => 
          s.id === seriesId 
            ? { 
                ...s, 
                cardIds: [...s.cardIds, cardId],
                totalCards: s.totalCards + 1,
                updatedAt: new Date().toISOString() 
              } 
            : s
        )
      );
      
      // Update card
      setEnhancedCards(prev => 
        prev.map(c => 
          c.id === cardId 
            ? { ...c, seriesId, updatedAt: new Date().toISOString() } 
            : c
        )
      );
      
      toast.success('Card added to series');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to add card to series');
      toast.error(`Error adding card to series: ${err.message}`);
      return false;
    }
  }, [enhancedCards, series]);

  const removeCardFromSeries = useCallback(async (cardId: string, seriesId: string): Promise<boolean> => {
    try {
      const card = enhancedCards.find(c => c.id === cardId);
      if (!card) {
        toast.error(`Card with ID ${cardId} not found`);
        return false;
      }
      
      const seriesItem = series.find(s => s.id === seriesId);
      if (!seriesItem) {
        toast.error(`Series with ID ${seriesId} not found`);
        return false;
      }
      
      // Check if card is in the series
      if (!seriesItem.cardIds.includes(cardId)) {
        toast.info('Card is not in this series');
        return true;
      }
      
      // Update series
      setSeries(prev => 
        prev.map(s => 
          s.id === seriesId 
            ? { 
                ...s, 
                cardIds: s.cardIds.filter(id => id !== cardId),
                totalCards: Math.max(0, s.totalCards - 1),
                updatedAt: new Date().toISOString() 
              } 
            : s
        )
      );
      
      // Update card
      setEnhancedCards(prev => 
        prev.map(c => 
          c.id === cardId && c.seriesId === seriesId
            ? { ...c, seriesId: '', updatedAt: new Date().toISOString() } 
            : c
        )
      );
      
      toast.success('Card removed from series');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to remove card from series');
      toast.error(`Error removing card from series: ${err.message}`);
      return false;
    }
  }, [enhancedCards, series]);

  // Deck CRUD operations
  const addDeck = useCallback(async (deckData: Partial<Deck>): Promise<Deck> => {
    try {
      const newDeck: Deck = {
        id: uuidv4(),
        name: deckData.name || 'Untitled Deck',
        description: deckData.description || '',
        coverImageUrl: deckData.coverImageUrl || '',
        ownerId: deckData.ownerId || 'anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cardIds: deckData.cardIds || [],
        isPublic: deckData.isPublic ?? false
      };
      
      setDecks(prev => [...prev, newDeck]);
      toast.success('Deck created successfully');
      return newDeck;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to add deck');
      toast.error(`Error creating deck: ${err.message}`);
      throw err;
    }
  }, []);

  const updateDeck = useCallback(async (id: string, updates: Partial<Deck>): Promise<boolean> => {
    try {
      const deckExists = decks.some(d => d.id === id);
      if (!deckExists) {
        toast.error(`Deck with ID ${id} not found`);
        return false;
      }
      
      setDecks(prev => 
        prev.map(d => 
          d.id === id 
            ? { ...d, ...updates, updatedAt: new Date().toISOString() } 
            : d
        )
      );
      
      toast.success('Deck updated successfully');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update deck');
      toast.error(`Error updating deck: ${err.message}`);
      return false;
    }
  }, [decks]);

  const deleteDeck = useCallback(async (id: string): Promise<boolean> => {
    try {
      const deckExists = decks.some(d => d.id === id);
      if (!deckExists) {
        toast.error(`Deck with ID ${id} not found`);
        return false;
      }
      
      setDecks(prev => prev.filter(d => d.id !== id));
      toast.success('Deck deleted successfully');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to delete deck');
      toast.error(`Error deleting deck: ${err.message}`);
      return false;
    }
  }, [decks]);

  const addCardToDeck = useCallback(async (cardId: string, deckId: string): Promise<boolean> => {
    try {
      const card = enhancedCards.find(c => c.id === cardId);
      if (!card) {
        toast.error(`Card with ID ${cardId} not found`);
        return false;
      }
      
      const deck = decks.find(d => d.id === deckId);
      if (!deck) {
        toast.error(`Deck with ID ${deckId} not found`);
        return false;
      }
      
      // Check if card is already in the deck
      if (deck.cardIds.includes(cardId)) {
        toast.info('Card is already in this deck');
        return true;
      }
      
      // Update deck
      setDecks(prev => 
        prev.map(d => 
          d.id === deckId 
            ? { 
                ...d, 
                cardIds: [...d.cardIds, cardId],
                updatedAt: new Date().toISOString() 
              } 
            : d
        )
      );
      
      toast.success('Card added to deck');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to add card to deck');
      toast.error(`Error adding card to deck: ${err.message}`);
      return false;
    }
  }, [enhancedCards, decks]);

  const removeCardFromDeck = useCallback(async (cardId: string, deckId: string): Promise<boolean> => {
    try {
      const deck = decks.find(d => d.id === deckId);
      if (!deck) {
        toast.error(`Deck with ID ${deckId} not found`);
        return false;
      }
      
      // Check if card is in the deck
      if (!deck.cardIds.includes(cardId)) {
        toast.info('Card is not in this deck');
        return true;
      }
      
      // Update deck
      setDecks(prev => 
        prev.map(d => 
          d.id === deckId 
            ? { 
                ...d, 
                cardIds: d.cardIds.filter(id => id !== cardId),
                updatedAt: new Date().toISOString() 
              } 
            : d
        )
      );
      
      toast.success('Card removed from deck');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to remove card from deck');
      toast.error(`Error removing card from deck: ${err.message}`);
      return false;
    }
  }, [decks]);

  // Return context provider 
  return (
    <EnhancedCardContext.Provider value={{
      enhancedCards,
      series,
      decks,
      isLoading,
      error,
      getEnhancedCardById,
      getSeriesById,
      getDeckById,
      addEnhancedCard,
      updateEnhancedCard,
      deleteEnhancedCard,
      addSeries,
      updateSeries,
      deleteSeries,
      addCardToSeries,
      removeCardFromSeries,
      addDeck,
      updateDeck,
      deleteDeck,
      addCardToDeck,
      removeCardFromDeck
    }}>
      {children}
    </EnhancedCardContext.Provider>
  );
};

// Custom hook to use the enhanced card context
export const useEnhancedCards = (): EnhancedCardContextProps => {
  const context = useContext(EnhancedCardContext);
  if (context === undefined) {
    throw new Error('useEnhancedCards must be used within an EnhancedCardProvider');
  }
  return context;
};
