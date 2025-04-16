
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Card } from '@/lib/types';
import { Collection } from '@/lib/types/collection';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { sampleCardData } from '@/lib/data/sampleCardData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Define the context shape
interface CardContextType {
  cards: Card[];
  collections: Collection[];
  loadingCards: boolean;
  isLoading: boolean;
  addCard: (cardData: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Promise<Card>;
  removeCard: (id: string) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  getCardById: (id: string) => Card | undefined;
  getCard: (id: string) => Card | undefined;
  refreshCards: () => Promise<void>;
  
  // Collection operations
  addCollection: (collectionData: Partial<Collection>) => Promise<Collection>;
  updateCollection: (id: string, data: Partial<Collection>) => Promise<Collection | null>;
  deleteCollection: (id: string) => Promise<boolean>;
  addCardToCollection: (collectionId: string, cardId: string) => Promise<boolean>;
  removeCardFromCollection: (collectionId: string, cardId: string) => Promise<boolean>;
}

// Create context with default undefined value
const CardContext = createContext<CardContextType | undefined>(undefined);

// Provider component
interface CardProviderProps {
  children: ReactNode;
}

export const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCards, setLoadingCards] = useState<boolean>(true);

  // Load cards from storage or use samples on initial render
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // In a real app, this would load from API/database
        // For now, we'll use the sample data
        const storedCards = localStorage.getItem('cards');
        if (storedCards) {
          const parsedCards = JSON.parse(storedCards);
          // Ensure all cards have the required properties using adaptToCard
          setCards(parsedCards.map((card: Partial<Card>) => adaptToCard(card)));
        } else {
          // Use sample data if no stored cards
          setCards(sampleCardData);
        }

        // Load collections
        const storedCollections = localStorage.getItem('collections');
        if (storedCollections) {
          setCollections(JSON.parse(storedCollections));
        } else {
          // Demo collections
          const demoCollections = [
            {
              id: 'collection-1',
              name: 'Demo Collection 1',
              description: 'A sample collection',
              coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
              userId: 'user1',
              teamId: 'team-1',
              visibility: 'public' as const,
              allowComments: true,
              isPublic: true,
              cards: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              designMetadata: {},
              cardIds: ['1']
            }
          ];
          setCollections(demoCollections);
        }
      } catch (error) {
        console.error('Error loading cards:', error);
        // Fallback to sample data on error
        setCards(sampleCardData);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, []);

  // Save cards and collections to storage whenever they change
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem('cards', JSON.stringify(cards));
    }
    
    if (collections.length > 0) {
      localStorage.setItem('collections', JSON.stringify(collections));
    }
  }, [cards, collections]);

  // Refresh cards - useful for components that need to trigger a refresh
  const refreshCards = async (): Promise<void> => {
    try {
      // In a real app, this would re-fetch from API
      // For now just reload from local storage
      const storedCards = localStorage.getItem('cards');
      if (storedCards) {
        const parsedCards = JSON.parse(storedCards);
        setCards(parsedCards.map((card: Partial<Card>) => adaptToCard(card)));
      }
      
      const storedCollections = localStorage.getItem('collections');
      if (storedCollections) {
        setCollections(JSON.parse(storedCollections));
      }
    } catch (error) {
      console.error('Error refreshing cards:', error);
    }
  };

  // Add a new card
  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    try {
      const timestamp = new Date().toISOString();
      
      const newCard = adaptToCard({
        id: uuidv4(),
        ...cardData,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: 'user1', // In a real app, this would be the current user's ID
        effects: cardData.effects || [],
        designMetadata: cardData.designMetadata || DEFAULT_DESIGN_METADATA
      });
      
      setCards(prevCards => [...prevCards, newCard]);
      return newCard;
    } catch (error) {
      console.error('Error adding card:', error);
      throw new Error('Failed to add card');
    }
  };

  // Update an existing card
  const updateCard = async (id: string, cardData: Partial<Card>): Promise<Card> => {
    try {
      const existingCard = cards.find(card => card.id === id);
      
      if (!existingCard) {
        throw new Error(`Card with id ${id} not found`);
      }
      
      const updatedCard = adaptToCard({
        ...existingCard,
        ...cardData,
        updatedAt: new Date().toISOString(),
        designMetadata: {
          ...existingCard.designMetadata,
          ...cardData.designMetadata
        }
      });
      
      setCards(prevCards =>
        prevCards.map(card => (card.id === id ? updatedCard : card))
      );
      
      return updatedCard;
    } catch (error) {
      console.error('Error updating card:', error);
      throw new Error('Failed to update card');
    }
  };

  // Remove a card (alias for deleteCard)
  const removeCard = async (id: string): Promise<boolean> => {
    try {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing card:', error);
      return false;
    }
  };

  // Delete a card
  const deleteCard = async (id: string): Promise<boolean> => {
    try {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      // Also remove the card from any collections
      setCollections(prevCollections => 
        prevCollections.map(collection => ({
          ...collection,
          cardIds: collection.cardIds?.filter(cardId => cardId !== id) || []
        }))
      );
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  };

  // Get a card by ID
  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  // Collection operations
  const addCollection = async (collectionData: Partial<Collection>): Promise<Collection> => {
    try {
      const timestamp = new Date().toISOString();
      
      const newCollection: Collection = {
        id: collectionData.id || uuidv4(),
        name: collectionData.name || 'Untitled Collection',
        description: collectionData.description || '',
        userId: 'user1',
        cards: [],
        coverImageUrl: collectionData.coverImageUrl || '',
        isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
        visibility: collectionData.visibility || 'public',
        allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
        createdAt: timestamp,
        updatedAt: timestamp,
        designMetadata: collectionData.designMetadata || {},
        cardIds: collectionData.cardIds || [],
        ...(collectionData.teamId && { teamId: collectionData.teamId }),
      };
      
      setCollections(prevCollections => [...prevCollections, newCollection]);
      return newCollection;
    } catch (error) {
      console.error('Error adding collection:', error);
      throw new Error('Failed to add collection');
    }
  };

  const updateCollection = async (id: string, data: Partial<Collection>): Promise<Collection | null> => {
    try {
      const existingCollection = collections.find(collection => collection.id === id);
      
      if (!existingCollection) {
        throw new Error(`Collection with id ${id} not found`);
      }
      
      const updatedCollection: Collection = {
        ...existingCollection,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      setCollections(prevCollections =>
        prevCollections.map(collection => (collection.id === id ? updatedCollection : collection))
      );
      
      return updatedCollection;
    } catch (error) {
      console.error('Error updating collection:', error);
      return null;
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    try {
      setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      return false;
    }
  };

  const addCardToCollection = async (collectionId: string, cardId: string): Promise<boolean> => {
    try {
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) return false;
      
      const card = cards.find(c => c.id === cardId);
      if (!card) return false;
      
      setCollections(prevCollections =>
        prevCollections.map(collection => {
          if (collection.id === collectionId) {
            const cardIds = collection.cardIds || [];
            if (!cardIds.includes(cardId)) {
              return {
                ...collection,
                cardIds: [...cardIds, cardId],
              };
            }
          }
          return collection;
        })
      );
      
      return true;
    } catch (error) {
      console.error('Error adding card to collection:', error);
      return false;
    }
  };

  const removeCardFromCollection = async (collectionId: string, cardId: string): Promise<boolean> => {
    try {
      setCollections(prevCollections =>
        prevCollections.map(collection => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              cardIds: (collection.cardIds || []).filter(id => id !== cardId)
            };
          }
          return collection;
        })
      );
      
      return true;
    } catch (error) {
      console.error('Error removing card from collection:', error);
      return false;
    }
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        collections,
        loadingCards,
        isLoading: loadingCards, // Alias for backward compatibility
        addCard,
        updateCard,
        removeCard,
        deleteCard,
        getCardById,
        getCard: getCardById, // Alias for compatibility
        refreshCards,
        addCollection,
        updateCollection,
        deleteCollection,
        addCardToCollection,
        removeCardFromCollection
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

// Custom hook for using the context
export const useCards = (): CardContextType => {
  const context = useContext(CardContext);
  
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  
  return context;
};

// Export the Card and Collection types from this context module
export type { Card, Collection };

// For backward compatibility
export const useCardContext = useCards;
