import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { sampleCards } from '@/data/sampleCards';

// Define the Card type
export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  collectionId?: string;
  tags: string[];
  fabricSwatches?: Array<{
    type: string;
    team: string;
    year: string;
    manufacturer: string;
    position: string;
    size: string;
  }>;
  designMetadata?: {
    cardStyle?: {
      template?: string;
      effect?: string;
      borderRadius?: string;
      borderColor?: string;
      frameColor?: string;
      frameWidth?: number;
      shadowColor?: string;
    };
    textStyle?: {
      titleColor?: string;
      titleAlignment?: string;
      titleWeight?: string;
      descriptionColor?: string;
    };
    marketMetadata?: {
      isPrintable?: boolean;
      isForSale?: boolean;
      includeInCatalog?: boolean;
    };
    cardMetadata?: {
      category?: string;
      cardType?: string;
      series?: string;
    };
    oaklandMemory?: {
      date?: string;
      opponent?: string;
      score?: string;
      location?: string;
      section?: string;
      memoryType?: string;
      attendees?: string[];
      template?: string;
      teamId?: string;
      historicalContext?: string;
      personalSignificance?: string;
    };
  };
}

// Define Collection type
export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  cardIds: string[];
  visibility: 'public' | 'private' | 'team';
  allowComments?: boolean;
  teamId?: string;
  designMetadata?: any;
}

type CardContextType = {
  cards: Card[];
  collections: Collection[];
  isLoading?: boolean;
  addCard: (cardData: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Card | null;
  getCard: (id: string) => Card | undefined;
  getCardById: (id: string) => Card | undefined;
  deleteCard: (id: string) => boolean;
  // Collection methods
  addCollection: (collectionData: Partial<Collection>) => Collection;
  updateCollection: (id: string, collectionData: Partial<Collection>) => Collection | null;
  deleteCollection: (id: string) => boolean;
  addCardToCollection: (cardId: string, collectionId: string) => boolean;
  removeCardFromCollection: (cardId: string, collectionId: string) => boolean;
  refreshCards?: () => Promise<void>;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

// Sample collections for demo purposes
const sampleCollections: Collection[] = [
  {
    id: 'collection-001',
    name: 'Pop Art Cards',
    description: 'A collection of pop art style cards',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    cardIds: ['card-001', 'card-005'],
    visibility: 'public',
    allowComments: true
  },
  {
    id: 'collection-002',
    name: 'Sports Legends',
    description: 'Collection of legendary sports figures',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    cardIds: ['card-002', 'card-003', 'card-004', 'card-006'],
    visibility: 'private',
    allowComments: true
  }
];

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with sample cards
  const [cards, setCards] = useState<Card[]>(sampleCards);
  const [collections, setCollections] = useState<Collection[]>(sampleCollections);
  const [isLoading, setIsLoading] = useState(false);

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    try {
      // Generate a new ID if one isn't provided
      const newCard: Card = {
        id: cardData.id || uuidv4(),
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: cardData.userId || 'anonymous',
        collectionId: cardData.collectionId,
        designMetadata: cardData.designMetadata || {
          cardStyle: {},
          textStyle: {},
          marketMetadata: {},
          cardMetadata: {}
        },
        tags: cardData.tags || [],
        fabricSwatches: cardData.fabricSwatches || [],
      };

      setCards(prevCards => [newCard, ...prevCards]);
      
      // If collection ID is provided, add card to the collection
      if (newCard.collectionId) {
        addCardToCollection(newCard.id, newCard.collectionId);
      }
      
      return newCard;
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
      throw error;
    }
  };

  const updateCard = (id: string, updates: Partial<Card>): Card | null => {
    let updatedCard: Card | null = null;

    setCards(prevCards => {
      return prevCards.map(card => {
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

    return updatedCard;
  };

  const getCard = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const deleteCard = (id: string): boolean => {
    const cardExists = cards.some(card => card.id === id);
    
    if (cardExists) {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      
      // Remove card from all collections
      setCollections(prevCollections => {
        return prevCollections.map(collection => ({
          ...collection,
          cardIds: collection.cardIds.filter(cardId => cardId !== id)
        }));
      });
      
      return true;
    }
    
    return false;
  };

  // Collection methods
  const addCollection = (collectionData: Partial<Collection>): Collection => {
    const newCollection: Collection = {
      id: collectionData.id || uuidv4(),
      name: collectionData.name || 'Untitled Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: collectionData.userId || 'anonymous',
      cardIds: collectionData.cardIds || [],
      visibility: collectionData.visibility || 'private',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      teamId: collectionData.teamId,
      designMetadata: collectionData.designMetadata
    };

    setCollections(prev => [newCollection, ...prev]);
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<Collection>): Collection | null => {
    let updatedCollection: Collection | null = null;

    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === id) {
          updatedCollection = { 
            ...collection, 
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedCollection;
        }
        return collection;
      });
    });

    return updatedCollection;
  };

  const deleteCollection = (id: string): boolean => {
    const collectionExists = collections.some(collection => collection.id === id);
    
    if (collectionExists) {
      setCollections(prevCollections => 
        prevCollections.filter(collection => collection.id !== id)
      );
      return true;
    }
    
    return false;
  };

  const addCardToCollection = (cardId: string, collectionId: string): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return false;
    
    if (collection.cardIds.includes(cardId)) return true; // Card already in collection
    
    setCollections(prevCollections => {
      return prevCollections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            cardIds: [...c.cardIds, cardId],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });
    });
    
    return true;
  };

  const removeCardFromCollection = (cardId: string, collectionId: string): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return false;
    
    if (!collection.cardIds.includes(cardId)) return true; // Card not in collection
    
    setCollections(prevCollections => {
      return prevCollections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            cardIds: c.cardIds.filter(id => id !== cardId),
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });
    });
    
    return true;
  };
  
  // Fetch/refresh cards - this would be used if fetching from an API
  const refreshCards = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // In a real app, we'd fetch from an API here
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // No need to update cards since we're using static sample data
    } catch (error) {
      console.error("Error refreshing cards:", error);
      toast.error("Failed to refresh cards");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContext.Provider value={{ 
      cards, 
      addCard, 
      updateCard, 
      getCard, 
      getCardById,
      deleteCard,
      collections,
      addCollection,
      updateCollection,
      deleteCollection,
      addCardToCollection,
      removeCardFromCollection,
      isLoading,
      refreshCards
    }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};
