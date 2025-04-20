
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';
import { sampleCards } from '@/data/sampleCards';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface CardContextType {
  cards: Card[];
  isLoading: boolean;
  error: Error | null;
  collections: Collection[];
  
  // Card operations
  addCard: (card: Partial<Card>) => Card;
  updateCard: (card: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  getCard: (cardId: string) => Card | undefined;
  getCardById: (cardId: string) => Card | undefined;
  refreshCards: () => Promise<void>;
  
  // Collection operations
  addCollection: (collection: Partial<Collection>) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => Collection | null;
  deleteCollection: (id: string) => boolean;
  getCollectionById: (id: string) => Collection | undefined;
  addCardToCollection: (collectionId: string, card: Card) => boolean;
  removeCardFromCollection: (collectionId: string, cardId: string) => boolean;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

// Define default values for required fields in Card objects
const defaultCardValues = {
  title: '',
  description: '',
  thumbnailUrl: '',
  imageUrl: '',
  userId: 'anonymous',
  effects: [] as string[],
  tags: [] as string[],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  player: '',
  team: '',
  position: '',
  year: '',
  designMetadata: {
    cardStyle: {
      template: 'classic',
      effect: 'classic',
      borderRadius: '8px',
      borderColor: '#000000',
      frameColor: '#000000',
      frameWidth: 2,
      shadowColor: 'rgba(0,0,0,0.2)',
    },
    textStyle: {
      titleColor: '#FFFFFF',
      titleAlignment: 'left',
      titleWeight: 'bold',
      descriptionColor: '#FFFFFF',
    },
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: true
    },
    cardMetadata: {
      category: 'sports',
      cardType: 'collectible',
      series: 'standard'
    }
  }
};

// Explicitly export CardProvider as a named export
export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize with sample cards
  React.useEffect(() => {
    const loadInitialCards = async () => {
      try {
        setIsLoading(true);
        
        // Transform sample cards to ensure they have all required properties
        const transformedCards = sampleCards.map(card => {
          // Create a new object with all properties from the card and default values
          return {
            ...defaultCardValues,
            ...card,
            thumbnailUrl: card.thumbnailUrl || card.imageUrl || '',
            id: card.id || uuidv4(),
            title: card.title || 'Untitled Card',
            // Ensure all required fields exist
            tags: card.tags || [],
            effects: card.effects || [],
            designMetadata: card.designMetadata ? {
              ...defaultCardValues.designMetadata,
              ...card.designMetadata
            } : defaultCardValues.designMetadata
          } as Card;
        });
        
        setCards(transformedCards);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        toast.error("Failed to load cards");
      }
    };
    
    loadInitialCards();
  }, []);

  const addCard = (card: Partial<Card>): Card => {
    const newCard: Card = {
      ...defaultCardValues,
      ...card,
      id: card.id || uuidv4(),
      title: card.title || 'Untitled Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnailUrl: card.thumbnailUrl || card.imageUrl || '',
      tags: card.tags || [],
      effects: card.effects || [],
      userId: card.userId || 'anonymous',
      designMetadata: card.designMetadata ? {
        ...defaultCardValues.designMetadata,
        ...card.designMetadata
      } : defaultCardValues.designMetadata
    };

    setCards(prevCards => [...prevCards, newCard]);
    toast.success("Card added successfully");
    return newCard;
  };

  const updateCard = (updatedCard: Partial<Card>) => {
    if (!updatedCard.id) {
      console.error("Cannot update card without id");
      return;
    }

    setCards(prevCards => 
      prevCards.map(card => 
        card.id === updatedCard.id
          ? { 
              ...card, 
              ...updatedCard, 
              updatedAt: new Date().toISOString(),
              // Make sure designMetadata is properly merged
              designMetadata: updatedCard.designMetadata ? {
                ...card.designMetadata,
                ...updatedCard.designMetadata
              } : card.designMetadata
            }
          : card
      )
    );
    toast.success("Card updated successfully");
  };

  const deleteCard = (cardId: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    toast.success("Card deleted successfully");
  };

  const getCard = (cardId: string) => {
    return cards.find(card => card.id === cardId);
  };

  const getCardById = (cardId: string) => {
    return cards.find(card => card.id === cardId);
  };

  const refreshCards = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // In a real app, we would make an API call here
      // For demo purposes, just wait a bit then use the same cards
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      toast.success("Cards refreshed");
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      toast.error("Failed to refresh cards");
    }
  };

  // Collection operations
  const addCollection = (collectionData: Partial<Collection>): Collection => {
    const newCollection: Collection = {
      id: collectionData.id || uuidv4(),
      name: collectionData.name || 'Untitled Collection', 
      title: collectionData.title || collectionData.name || 'Untitled Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      thumbnailUrl: collectionData.thumbnailUrl || '',
      userId: collectionData.userId || 'anonymous',
      teamId: collectionData.teamId,
      visibility: collectionData.visibility || 'public',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: collectionData.designMetadata || {},
      cards: collectionData.cards || [],
      cardIds: collectionData.cardIds || [],
      tags: collectionData.tags || [],
      isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
      featured: collectionData.featured || false
    };

    setCollections(prevCollections => [...prevCollections, newCollection]);
    toast.success("Collection created successfully");
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

    if (updatedCollection) {
      toast.success("Collection updated successfully");
    }
    return updatedCollection;
  };

  const deleteCollection = (id: string): boolean => {
    const collectionExists = collections.some(collection => collection.id === id);
    
    if (collectionExists) {
      setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
      toast.success("Collection deleted successfully");
      return true;
    }
    
    return false;
  };

  const getCollectionById = (id: string): Collection | undefined => {
    return collections.find(collection => collection.id === id);
  };

  const addCardToCollection = (collectionId: string, card: Card): boolean => {
    const collectionExists = collections.some(collection => collection.id === collectionId);
    
    if (!collectionExists) {
      return false;
    }

    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === collectionId) {
          const cards = collection.cards || [];
          // Check if card already exists to avoid duplicates
          if (!cards.some(c => c.id === card.id)) {
            return {
              ...collection,
              cards: [...cards, card],
              // Also update cardIds for compatibility
              cardIds: [...(collection.cardIds || []), card.id]
            };
          }
        }
        return collection;
      });
    });

    return true;
  };

  const removeCardFromCollection = (collectionId: string, cardId: string): boolean => {
    const collection = collections.find(collection => collection.id === collectionId);
    
    if (!collection || !collection.cards) {
      return false;
    }

    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === collectionId && collection.cards) {
          return {
            ...collection,
            cards: collection.cards.filter(card => card.id !== cardId),
            // Also update cardIds for compatibility
            cardIds: (collection.cardIds || []).filter(id => id !== cardId)
          };
        }
        return collection;
      });
    });

    return true;
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        isLoading,
        error,
        collections,
        addCard,
        updateCard,
        deleteCard,
        getCard,
        getCardById,
        refreshCards,
        addCollection,
        updateCollection,
        deleteCollection,
        getCollectionById,
        addCardToCollection,
        removeCardFromCollection
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

// Hook to use the card context
export const useCards = () => {
  const context = useContext(CardContext);
  
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  
  return context;
};

export { CardContext };
