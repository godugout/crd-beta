
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';
import { DesignMetadata } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface CardContextProps {
  cards: Card[];
  collections: Collection[];
  loading: boolean;
  error: Error | null;
  getCardById: (id: string) => Card | undefined;
  getCard: (id: string) => Card | undefined; // Added getCard method
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  addCollection: (collection: Partial<Collection>) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => Collection | null;
  deleteCollection: (id: string) => boolean;
  addCardToCollection: (collectionId: string, card: Card) => boolean;
  removeCardFromCollection: (collectionId: string, cardId: string) => boolean;
  fetchCards: () => Promise<void>;
  isLoading?: boolean; // Added for compatibility
  refreshCards?: () => Promise<void>; // Added for compatibility
}

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch cards on mount
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      
      // For now, we'll just simulate fetch with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This would be replaced with actual API call
      setCards([]);
      setCollections([]);
      
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };
  
  // Add refreshCards alias for fetchCards
  const refreshCards = fetchCards;

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };
  
  // Add getCard method as an alias to getCardById for compatibility
  const getCard = (id: string): Card | undefined => {
    return getCardById(id);
  };

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    // Ensure designMetadata is set with defaults if not provided
    const designMetadata: DesignMetadata = cardData.designMetadata || {
      cardStyle: {
        template: 'standard',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameColor: '#FFFFFF',
        frameWidth: 2,
        shadowColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      },
      cardMetadata: {
        category: 'standard',
        cardType: 'basic',
        series: 'default'
      }
    };

    // Create the new card with required fields and defaults
    const newCard: Card = {
      id: cardData.id || uuidv4(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
      userId: cardData.userId || 'current-user-id',
      tags: cardData.tags || [],
      effects: cardData.effects || [],
      createdAt: cardData.createdAt || new Date().toISOString(),
      updatedAt: cardData.updatedAt || new Date().toISOString(),
      designMetadata: designMetadata,
      ...cardData
    };

    setCards(prevCards => [newCard, ...prevCards]);
    
    toast({
      title: 'Success',
      description: 'Card created successfully',
    });
    
    return newCard;
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<boolean> => {
    try {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === id
            ? { ...card, ...updates, updatedAt: new Date().toISOString() }
            : card
        )
      );
      
      toast({
        title: 'Success',
        description: 'Card updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating card:', error);
      toast({
        title: 'Error',
        description: 'Failed to update card',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    try {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      
      toast({
        title: 'Success',
        description: 'Card deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete card',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addCollection = (collectionData: Partial<Collection>): Collection => {
    const newCollection: Collection = {
      id: collectionData.id || uuidv4(),
      title: collectionData.title || 'Untitled Collection',
      description: collectionData.description || '',
      userId: 'current-user-id', // Would come from auth context
      cards: collectionData.cards || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibility: collectionData.visibility || 'public',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      designMetadata: collectionData.designMetadata || {},
      thumbnailUrl: collectionData.thumbnailUrl || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
      tags: collectionData.tags || [],
    };

    setCollections(prevCollections => [...prevCollections, newCollection]);
    
    toast({
      title: 'Success',
      description: 'Collection created successfully',
    });
    
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
      toast({
        title: 'Success',
        description: 'Collection updated successfully',
      });
    }
    
    return updatedCollection;
  };

  const deleteCollection = (id: string): boolean => {
    const collectionExists = collections.some(collection => collection.id === id);
    
    if (collectionExists) {
      setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
      
      toast({
        title: 'Success',
        description: 'Collection deleted successfully',
      });
      
      return true;
    }
    
    return false;
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
              cards: [...cards, card]
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
            cards: collection.cards.filter(card => card.id !== cardId)
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
        collections,
        loading,
        error,
        getCardById,
        getCard,
        addCard,
        updateCard,
        deleteCard,
        addCollection,
        updateCollection,
        deleteCollection,
        addCardToCollection,
        removeCardFromCollection,
        fetchCards,
        isLoading: loading,
        refreshCards
      }}
    >
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

export { CardContext };
