
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';
import { fetchCards } from '@/lib/api/cards';

interface CardContextProps {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  error: Error | null;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (card: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<void>;
  getCardById: (id: string) => Card | undefined;
  getCard: (id: string) => Card | undefined; // Add this function
  addCollection: (collection: Partial<Collection>) => Promise<Collection>;
  updateCollection: (collection: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
  getCollectionById: (id: string) => Collection | undefined;
  refreshCards: () => Promise<void>; // Add this function
}

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch cards on component mount
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const cardsData = await fetchCards();
      setCards(cardsData);
      // For now, use an empty array for collections
      setCollections([]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh cards
  const refreshCards = async () => {
    await loadCards();
  };

  const addCard = async (card: Partial<Card>): Promise<Card> => {
    // Implementation would go here
    // This is just a placeholder for now
    const newCard: Card = {
      id: Math.random().toString(36).substring(7),
      title: card.title || 'New Card',
      description: card.description || '',
      imageUrl: card.imageUrl || '',
      thumbnailUrl: card.thumbnailUrl || '',
      tags: card.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: card.userId || 'user-1',
      effects: card.effects || [],
      designMetadata: card.designMetadata || {
        cardStyle: {
          template: 'basic',
          effect: 'none',
          borderRadius: '16px',
          borderColor: '#000000',
          frameColor: '#FFFFFF',
          frameWidth: 10,
          shadowColor: '#000000'
        },
        textStyle: {
          titleColor: '#000000',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#333333'
        },
        marketMetadata: {
          isPrintable: false,
          isForSale: false,
          includeInCatalog: false
        },
        cardMetadata: {
          category: 'standard',
          cardType: 'custom',
          series: 'none'
        }
      }
    };
    
    setCards([...cards, newCard]);
    return newCard;
  };

  const updateCard = async (card: Partial<Card>): Promise<Card> => {
    // Implementation would go here
    const updatedCard = { ...card, updatedAt: new Date().toISOString() } as Card;
    setCards(cards.map(c => c.id === card.id ? updatedCard : c));
    return updatedCard;
  };

  const deleteCard = async (id: string): Promise<void> => {
    // Implementation would go here
    setCards(cards.filter(c => c.id !== id));
  };

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  // Alias for getCardById for backward compatibility
  const getCard = (id: string): Card | undefined => {
    return getCardById(id);
  };

  const addCollection = async (collection: Partial<Collection>): Promise<Collection> => {
    // Implementation would go here
    const newCollection: Collection = {
      id: Math.random().toString(36).substring(7),
      name: collection.name || 'New Collection',
      title: collection.title || collection.name || 'New Collection',
      description: collection.description || '',
      coverImageUrl: collection.coverImageUrl || '',
      userId: collection.userId || 'user-1',
      teamId: collection.teamId || '',
      cards: [],
      isPublic: collection.isPublic || false,
      visibility: collection.visibility || 'private',
      allowComments: collection.allowComments || true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: collection.designMetadata || {},
      cardIds: collection.cardIds || []
    };
    
    setCollections([...collections, newCollection]);
    return newCollection;
  };

  const updateCollection = async (collection: Partial<Collection>): Promise<Collection> => {
    // Implementation would go here
    const updatedCollection = { ...collection, updatedAt: new Date().toISOString() } as Collection;
    setCollections(collections.map(c => c.id === collection.id ? updatedCollection : c));
    return updatedCollection;
  };

  const deleteCollection = async (id: string): Promise<void> => {
    // Implementation would go here
    setCollections(collections.filter(c => c.id !== id));
  };

  const getCollectionById = (id: string): Collection | undefined => {
    return collections.find(collection => collection.id === id);
  };

  return (
    <CardContext.Provider value={{ 
      cards, 
      collections, 
      isLoading, 
      error,
      addCard, 
      updateCard, 
      deleteCard, 
      getCardById,
      getCard, 
      addCollection, 
      updateCollection, 
      deleteCollection, 
      getCollectionById,
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

export { CardContext };
