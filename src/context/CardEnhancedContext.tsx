import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/lib/types/cardTypes';
import { EnhancedCard, Series, Deck } from '@/lib/types/enhancedCardTypes';
import { sampleCards } from '@/data/sampleCards';

// Convert sample cards to enhanced cards
const enhancedSampleCards: EnhancedCard[] = sampleCards.map(card => ({
  ...card,
  rarity: Math.random() > 0.8 ? 'rare' : Math.random() > 0.5 ? 'uncommon' : 'common',
  cardNumber: `${Math.floor(Math.random() * 100)}/100`,
  seriesId: Math.random() > 0.5 ? 'series-001' : 'series-002',
  artistId: 'artist-001',
  edition: 1,
  editionSize: 100,
  releaseDate: new Date().toISOString(),
  qrCodeData: `https://example.com/card/${card.id}`,
  hotspots: [],
  effects: card.effects || [],
  designMetadata: {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '12px',
      borderColor: '#000000',
      shadowColor: 'rgba(0,0,0,0.2)',
      frameWidth: 2,
      frameColor: '#000000'
    },
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#666666'
    },
    cardMetadata: {
      category: 'sports',
      series: 'basketball',
      cardType: 'player',
    },
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: true
    }
  },
  marketData: {
    price: Math.floor(Math.random() * 100) + 10,
    currency: 'USD',
    availableForSale: Math.random() > 0.5,
  },
}));

// Sample series
const sampleSeries: Series[] = [
  {
    id: 'series-001',
    title: 'First Edition Collection',
    description: 'The inaugural collection showcasing legendary athletes',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    artistId: 'artist-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releaseDate: new Date().toISOString(),
    totalCards: 5,
    isPublished: true,
    cards: [] as EnhancedCard[],
    cardIds: enhancedSampleCards.filter((_, i) => i < 5).map(card => card.id),
    releaseType: 'standard'
  },
  {
    id: 'series-002',
    title: 'Limited Edition Memorabilia',
    description: 'Rare collectibles featuring game-worn memorabilia',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    artistId: 'artist-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalCards: 3,
    isPublished: true,
    cards: [] as EnhancedCard[],
    cardIds: enhancedSampleCards.filter((_, i) => i >= 5).map(card => card.id),
    releaseType: 'limited'
  }
];

// Sample decks
const sampleDecks: Deck[] = [
  {
    id: 'deck-001',
    name: 'My Favorite Players',
    description: 'A collection of my all-time favorite players',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    ownerId: 'user-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [] as EnhancedCard[],
    cardIds: enhancedSampleCards.filter((_, i) => i % 2 === 0).map(card => card.id),
    isPublic: true
  }
];

interface CardEnhancedContextType {
  cards: EnhancedCard[];
  series: Series[];
  decks: Deck[];
  favorites: string[];
  isLoading: boolean;
  
  // Card operations
  addCard: (card: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  updateCard: (id: string, updates: Partial<EnhancedCard>) => EnhancedCard | null;
  deleteCard: (id: string) => boolean;
  getCard: (id: string) => EnhancedCard | undefined;
  
  // Series operations
  addSeries: (series: Partial<Series>) => Series;
  updateSeries: (id: string, updates: Partial<Series>) => Series | null;
  deleteSeries: (id: string) => boolean;
  getSeries: (id: string) => Series | undefined;
  addCardToSeries: (cardId: string, seriesId: string) => boolean;
  removeCardFromSeries: (cardId: string, seriesId: string) => boolean;
  
  // Deck operations
  addDeck: (deck: Partial<Deck>) => Deck;
  updateDeck: (id: string, updates: Partial<Deck>) => Deck | null;
  deleteDeck: (id: string) => boolean;
  getDeck: (id: string) => Deck | undefined;
  addCardToDeck: (cardId: string, deckId: string) => boolean;
  removeCardFromDeck: (cardId: string, deckId: string) => boolean;
  
  // Favorites
  toggleFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
}

const CardEnhancedContext = createContext<CardEnhancedContextType | undefined>(undefined);

export const CardEnhancedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<EnhancedCard[]>(enhancedSampleCards);
  const [series, setSeries] = useState<Series[]>(sampleSeries);
  const [decks, setDecks] = useState<Deck[]>(sampleDecks);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Card operations
  const addCard = async (cardData: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    const newCard: EnhancedCard = {
      ...cardData as EnhancedCard,
      id: cardData.id || uuidv4(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: cardData.userId || 'anonymous',
      rarity: cardData.rarity || 'common',
      cardNumber: cardData.cardNumber || `1/${cardData.editionSize || 1}`,
      effects: cardData.effects || [],
    };
    
    setCards(prev => [newCard, ...prev]);
    toast.success('Card created successfully');
    
    // If series ID is provided, add to series
    if (newCard.seriesId) {
      addCardToSeries(newCard.id, newCard.seriesId);
    }
    
    return newCard;
  };
  
  const updateCard = (id: string, updates: Partial<EnhancedCard>): EnhancedCard | null => {
    let updatedCard: EnhancedCard | null = null;
    
    setCards(prev => {
      return prev.map(card => {
        if (card.id === id) {
          updatedCard = {
            ...card,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedCard;
        }
        return card;
      });
    });
    
    if (updatedCard) {
      toast.success('Card updated successfully');
    }
    
    return updatedCard;
  };
  
  const deleteCard = (id: string): boolean => {
    const exists = cards.some(card => card.id === id);
    
    if (exists) {
      setCards(prev => prev.filter(card => card.id !== id));
      
      // Remove from series
      setSeries(prev => {
        return prev.map(s => ({
          ...s,
          cards: (s.cards || []).filter(c => c.id !== id),
          cardIds: s.cardIds.filter(cId => cId !== id)
        }));
      });
      
      // Remove from decks
      setDecks(prev => {
        return prev.map(d => ({
          ...d,
          cards: (d.cards || []).filter(c => c.id !== id),
          cardIds: d.cardIds.filter(cId => cId !== id)
        }));
      });
      
      // Remove from favorites
      setFavorites(prev => prev.filter(fId => fId !== id));
      
      toast.success('Card deleted successfully');
      return true;
    }
    
    return false;
  };
  
  const getCard = (id: string): EnhancedCard | undefined => {
    return cards.find(card => card.id === id);
  };
  
  // Series operations
  const addSeries = (seriesData: Partial<Series>): Series => {
    const newSeries: Series = {
      id: seriesData.id || uuidv4(),
      title: seriesData.title || 'Untitled Series',
      description: seriesData.description || '',
      coverImageUrl: seriesData.coverImageUrl || '',
      artistId: seriesData.artistId || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      releaseDate: seriesData.releaseDate || new Date().toISOString(),
      totalCards: seriesData.totalCards || 0,
      isPublished: seriesData.isPublished || false,
      cards: [],
      cardIds: seriesData.cardIds || [],
      releaseType: seriesData.releaseType || 'standard'
    };
    
    setSeries(prev => [newSeries, ...prev]);
    toast.success('Series created successfully');
    return newSeries;
  };
  
  const updateSeries = (id: string, updates: Partial<Series>): Series | null => {
    let updatedSeries: Series | null = null;
    
    setSeries(prev => {
      return prev.map(series => {
        if (series.id === id) {
          updatedSeries = {
            ...series,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedSeries;
        }
        return series;
      });
    });
    
    if (updatedSeries) {
      toast.success('Series updated successfully');
    }
    
    return updatedSeries;
  };
  
  const deleteSeries = (id: string): boolean => {
    const exists = series.some(s => s.id === id);
    
    if (exists) {
      setSeries(prev => prev.filter(s => s.id !== id));
      
      // Update cards to remove series reference
      setCards(prev => {
        return prev.map(card => {
          if (card.seriesId === id) {
            return { ...card, seriesId: undefined };
          }
          return card;
        });
      });
      
      toast.success('Series deleted successfully');
      return true;
    }
    
    return false;
  };
  
  const getSeries = (id: string): Series | undefined => {
    return series.find(s => s.id === id);
  };
  
  const addCardToSeries = (cardId: string, seriesId: string): boolean => {
    const seriesExists = series.some(s => s.id === seriesId);
    const cardExists = cards.some(c => c.id === cardId);
    
    if (!seriesExists || !cardExists) return false;
    
    setSeries(prev => {
      return prev.map(s => {
        if (s.id === seriesId && !s.cardIds.includes(cardId)) {
          return {
            ...s,
            cardIds: [...s.cardIds, cardId],
            totalCards: s.totalCards + 1,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
    });
    
    // Update card with series ID
    setCards(prev => {
      return prev.map(card => {
        if (card.id === cardId) {
          return { ...card, seriesId };
        }
        return card;
      });
    });
    
    return true;
  };
  
  const removeCardFromSeries = (cardId: string, seriesId: string): boolean => {
    const seriesExists = series.some(s => s.id === seriesId);
    
    if (!seriesExists) return false;
    
    setSeries(prev => {
      return prev.map(s => {
        if (s.id === seriesId && s.cardIds.includes(cardId)) {
          return {
            ...s,
            cardIds: s.cardIds.filter(id => id !== cardId),
            totalCards: s.totalCards - 1,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
    });
    
    // Update card to remove series ID
    setCards(prev => {
      return prev.map(card => {
        if (card.id === cardId && card.seriesId === seriesId) {
          return { ...card, seriesId: undefined };
        }
        return card;
      });
    });
    
    return true;
  };
  
  // Deck operations
  const addDeck = (deckData: Partial<Deck>): Deck => {
    const newDeck: Deck = {
      id: deckData.id || uuidv4(),
      name: deckData.name || 'Untitled Deck',
      description: deckData.description || '',
      coverImageUrl: deckData.coverImageUrl || '',
      ownerId: deckData.ownerId || (user?.id || 'anonymous'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: [],
      cardIds: deckData.cardIds || [],
      isPublic: deckData.isPublic || false
    };
    
    setDecks(prev => [newDeck, ...prev]);
    toast.success('Deck created successfully');
    return newDeck;
  };
  
  const updateDeck = (id: string, updates: Partial<Deck>): Deck | null => {
    let updatedDeck: Deck | null = null;
    
    setDecks(prev => {
      return prev.map(deck => {
        if (deck.id === id) {
          updatedDeck = {
            ...deck,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedDeck;
        }
        return deck;
      });
    });
    
    if (updatedDeck) {
      toast.success('Deck updated successfully');
    }
    
    return updatedDeck;
  };
  
  const deleteDeck = (id: string): boolean => {
    const exists = decks.some(d => d.id === id);
    
    if (exists) {
      setDecks(prev => prev.filter(d => d.id !== id));
      toast.success('Deck deleted successfully');
      return true;
    }
    
    return false;
  };
  
  const getDeck = (id: string): Deck | undefined => {
    return decks.find(d => d.id === id);
  };
  
  const addCardToDeck = (cardId: string, deckId: string): boolean => {
    const deckExists = decks.some(d => d.id === deckId);
    const cardExists = cards.some(c => c.id === cardId);
    
    if (!deckExists || !cardExists) return false;
    
    setDecks(prev => {
      return prev.map(d => {
        if (d.id === deckId && !d.cardIds.includes(cardId)) {
          return {
            ...d,
            cardIds: [...d.cardIds, cardId],
            updatedAt: new Date().toISOString()
          };
        }
        return d;
      });
    });
    
    toast.success('Card added to deck');
    return true;
  };
  
  const removeCardFromDeck = (cardId: string, deckId: string): boolean => {
    const deckExists = decks.some(d => d.id === deckId);
    
    if (!deckExists) return false;
    
    setDecks(prev => {
      return prev.map(d => {
        if (d.id === deckId && d.cardIds.includes(cardId)) {
          return {
            ...d,
            cardIds: d.cardIds.filter(id => id !== cardId),
            updatedAt: new Date().toISOString()
          };
        }
        return d;
      });
    });
    
    toast.success('Card removed from deck');
    return true;
  };
  
  // Favorites management
  const toggleFavorite = (cardId: string) => {
    setFavorites(prev => {
      if (prev.includes(cardId)) {
        toast.success('Removed from favorites');
        return prev.filter(id => id !== cardId);
      } else {
        toast.success('Added to favorites');
        return [...prev, cardId];
      }
    });
  };
  
  const isFavorite = (cardId: string): boolean => {
    return favorites.includes(cardId);
  };
  
  // Load user data
  useEffect(() => {
    if (user) {
      // In a real app, we would load user's cards, decks, and favorites from an API
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, just use sample data
        setIsLoading(false);
      }, 500);
    }
  }, [user]);
  
  return (
    <CardEnhancedContext.Provider value={{
      cards,
      series,
      decks,
      favorites,
      isLoading,
      addCard,
      updateCard,
      deleteCard,
      getCard,
      addSeries,
      updateSeries,
      deleteSeries,
      getSeries,
      addCardToSeries,
      removeCardFromSeries,
      addDeck,
      updateDeck,
      deleteDeck,
      getDeck,
      addCardToDeck,
      removeCardFromDeck,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </CardEnhancedContext.Provider>
  );
};

export const useEnhancedCards = () => {
  const context = useContext(CardEnhancedContext);
  if (context === undefined) {
    throw new Error('useEnhancedCards must be used within a CardEnhancedProvider');
  }
  return context;
};
