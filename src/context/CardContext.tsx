
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { sampleCardData } from '@/lib/data/sampleCardData';

export type { Card, Collection };

interface CardContextType {
  cards: Card[];
  collections: Collection[];
  loading: boolean;
  isLoading: boolean; // Added for compatibility
  error: Error | null;
  getCardById: (id: string) => Card | undefined;
  getCard: (id: string) => Card | undefined; // Added alias for getCardById
  fetchCards: () => Promise<void>;
  refreshCards: () => Promise<void>; // Added alias for fetchCards
  createCard: (cardData: Partial<Card>) => Promise<Card>;
  addCard: (cardData: Partial<Card>) => Promise<Card>; // Added alias for createCard
  updateCard: (id: string, updates: Partial<Card>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  
  // Collection operations
  addCollection: (collectionData: Partial<Collection>) => Promise<Collection>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
  addCardToCollection: (collectionId: string, cardId: string) => Promise<boolean>;
  removeCardFromCollection: (collectionId: string, cardId: string) => Promise<boolean>;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  // Alias for getCardById
  const getCard = getCardById;

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Loading sample card data:", sampleCardData.length, "cards");
      setCards(sampleCardData);

      const sampleCollections: Collection[] = [
        {
          id: 'collection-001',
          name: 'Sports Legends',
          description: 'A collection of legendary sports figures',
          coverImageUrl: sampleCardData[0].imageUrl,
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public',
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-001', 'card-002']
        },
        {
          id: 'collection-002',
          name: 'Vintage Collection',
          description: 'Classic cards from the past',
          coverImageUrl: sampleCardData[2].imageUrl,
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public',
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-003', 'card-004']
        },
        {
          id: 'collection-003',
          name: 'Special Editions',
          description: 'Limited and special edition cards',
          coverImageUrl: sampleCardData[4].imageUrl,
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public',
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-005', 'card-006']
        }
      ];
      
      setCollections(sampleCollections);
      
      toast({
        title: "Cards loaded",
        description: `Loaded ${sampleCardData.length} cards with reliable images`,
        variant: "default",
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching cards:', error);
      setError(error);
      toast({
        title: 'Error fetching cards',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Alias for fetchCards
  const refreshCards = fetchCards;

  const createCard = async (cardData: Partial<Card>) => {
    try {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || sampleCardData[0].imageUrl,
        thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || sampleCardData[0].imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-1',
        teamId: 'team-1',
        collectionId: cardData.collectionId || '',
        isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
        tags: cardData.tags || [],
        designMetadata: cardData.designMetadata || {},
        effects: cardData.effects || ['Holographic']
      };
      
      setCards(prev => [newCard, ...prev]);
      
      toast({
        title: "Card created",
        description: `Created card: ${newCard.title}`,
      });
      
      return newCard;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating card:', error);
      toast({
        title: 'Error creating card',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Alias for createCard
  const addCard = createCard;

  const updateCard = async (id: string, updates: Partial<Card>) => {
    try {
      setCards(prev => 
        prev.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date().toISOString() } 
            : card
        )
      );
      
      toast({
        title: "Card updated",
        description: `Updated card: ${updates.title || id}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error updating card:', error);
      toast({
        title: 'Error updating card',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      setCards(prev => prev.filter(card => card.id !== id));
      
      toast({
        title: "Card deleted",
        description: `Deleted card: ${id}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting card:', error);
      toast({
        title: 'Error deleting card',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Collection operations
  const addCollection = async (collectionData: Partial<Collection>): Promise<Collection> => {
    try {
      const newCollection: Collection = {
        id: `collection-${Date.now()}`,
        name: collectionData.name || 'Untitled Collection',
        description: collectionData.description || '',
        coverImageUrl: collectionData.coverImageUrl || '',
        userId: 'user-1',
        teamId: 'team-1',
        visibility: collectionData.visibility || 'public',
        allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
        isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
        cards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designMetadata: collectionData.designMetadata || {},
        cardIds: collectionData.cardIds || []
      };
      
      setCollections(prev => [...prev, newCollection]);
      
      toast({
        title: "Collection created",
        description: `Created collection: ${newCollection.name}`,
      });
      
      return newCollection;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating collection:', error);
      toast({
        title: 'Error creating collection',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateCollection = async (id: string, updates: Partial<Collection>): Promise<boolean> => {
    try {
      setCollections(prev => 
        prev.map(collection => 
          collection.id === id 
            ? { ...collection, ...updates, updatedAt: new Date().toISOString() } 
            : collection
        )
      );
      
      toast({
        title: "Collection updated",
        description: `Updated collection: ${updates.name || id}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error updating collection:', error);
      toast({
        title: 'Error updating collection',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    try {
      setCollections(prev => prev.filter(collection => collection.id !== id));
      
      toast({
        title: "Collection deleted",
        description: `Deleted collection: ${id}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting collection:', error);
      toast({
        title: 'Error deleting collection',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const addCardToCollection = async (collectionId: string, cardId: string): Promise<boolean> => {
    try {
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) {
        throw new Error(`Collection with ID ${collectionId} not found`);
      }
      
      const card = cards.find(c => c.id === cardId);
      if (!card) {
        throw new Error(`Card with ID ${cardId} not found`);
      }
      
      setCollections(prev => 
        prev.map(c => 
          c.id === collectionId 
            ? { 
                ...c, 
                cardIds: [...new Set([...c.cardIds, cardId])],
                updatedAt: new Date().toISOString() 
              } 
            : c
        )
      );
      
      toast({
        title: "Card added to collection",
        description: `Added card to ${collection.name}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error adding card to collection:', error);
      toast({
        title: 'Error adding card to collection',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeCardFromCollection = async (collectionId: string, cardId: string): Promise<boolean> => {
    try {
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) {
        throw new Error(`Collection with ID ${collectionId} not found`);
      }
      
      setCollections(prev => 
        prev.map(c => 
          c.id === collectionId 
            ? { 
                ...c, 
                cardIds: c.cardIds.filter(id => id !== cardId),
                updatedAt: new Date().toISOString() 
              } 
            : c
        )
      );
      
      toast({
        title: "Card removed from collection",
        description: `Removed card from ${collection.name}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error removing card from collection:', error);
      toast({
        title: 'Error removing card from collection',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const value = {
    cards,
    collections,
    loading,
    isLoading: loading, // Alias for loading
    error,
    getCardById,
    getCard, // Alias for getCardById
    fetchCards,
    refreshCards, // Alias for fetchCards
    createCard,
    addCard, // Alias for createCard
    updateCard,
    deleteCard,
    // Collection operations
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

export const useCardContext = useCards;
