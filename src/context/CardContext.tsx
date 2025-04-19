
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

interface CardContextProps {
  cards: Card[];
  collections: Collection[];
  loading: boolean;
  error: Error | null;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  getCardById: (id: string) => Card | undefined;
  isLoading: boolean;
  refreshCards: () => Promise<void>;
  addCollection: (collection: Partial<Collection>) => Promise<Collection>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<boolean>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<boolean>;
}

export const CardContext = createContext<CardContextProps>({
  cards: [],
  collections: [],
  loading: true,
  error: null,
  addCard: async () => ({} as Card),
  updateCard: async () => false,
  deleteCard: async () => false,
  getCardById: () => undefined,
  isLoading: true,
  refreshCards: async () => {},
  addCollection: async () => ({} as Collection),
  updateCollection: async () => false,
  deleteCollection: async () => false,
  addCardToCollection: async () => false,
  removeCardFromCollection: async () => false,
});

// Export Card and Collection types for use in other files
export type { Card, Collection };

// Export the useCardContext hook
export const useCardContext = () => useContext(CardContext);

// Create and export the useCards hook as an alias to useCardContext for backward compatibility
export const useCards = useCardContext;

interface CardProviderProps {
  children: ReactNode;
}

export const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*');

        if (cardsError) {
          throw cardsError;
        }

        if (cardsData) {
          const processedCards = cardsData.map(card => {
            const processedCard = {
              id: card.id,
              title: card.title,
              description: card.description || '',
              imageUrl: card.image_url || '',
              thumbnailUrl: card.thumbnail_url || card.image_url || '',
              collectionId: card.collection_id,
              userId: card.creator_id || card.user_id,
              teamId: card.team_id,
              isPublic: card.is_public,
              tags: card.tags || [],
              effects: [],
              rarity: card.rarity || 'common',
              createdAt: new Date(card.created_at).toISOString(),
              updatedAt: new Date(card.updated_at).toISOString(),
              designMetadata: card.design_metadata || {},
            };
            return processedCard as Card;
          });
          setCards(processedCards);
        }

        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*');

        if (collectionsError) {
          throw collectionsError;
        }

        if (collectionsData) {
          setCollections(collectionsData.map(collection => ({
            id: collection.id,
            title: collection.title,
            name: collection.name,
            description: collection.description || '',
            coverImageUrl: collection.cover_image_url || '',
            userId: collection.owner_id || collection.user_id,
            teamId: collection.team_id,
            isPublic: collection.is_public,
            visibility: collection.visibility || 'public',
            allowComments: collection.allow_comments ?? true,
            designMetadata: collection.design_metadata || {},
            cards: collection.cards || [],
            cardIds: collection.card_ids || [],
            createdAt: new Date(collection.created_at).toISOString(),
            updatedAt: new Date(collection.updated_at).toISOString(),
          })));
        }
      } catch (err) {
        setError(err as Error);
        toast({
          title: 'Error loading data',
          description: (err as Error).message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [toast]);

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    try {
      const newCard = adaptToCard({
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
        thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-1',
        teamId: 'team-1',
        collectionId: cardData.collectionId || '',
        isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
        tags: cardData.tags || [],
        effects: cardData.effects || [],
        ...cardData
      });
      setCards(prev => [newCard, ...prev]);
      return newCard;
    } catch (err) {
      toast({
        title: 'Error creating card',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<boolean> => {
    try {
      setCards(prev =>
        prev.map(card =>
          card.id === id
            ? adaptToCard({ ...card, ...updates, updatedAt: new Date().toISOString() })
            : card
        )
      );
      return true;
    } catch (err) {
      toast({
        title: 'Error updating card',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    try {
      setCards(prev => prev.filter(card => card.id !== id));
      return true;
    } catch (err) {
      toast({
        title: 'Error deleting card',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const refreshCards = async () => {
    try {
      setLoading(true);
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*');

      if (cardsError) {
        throw cardsError;
      }

      if (cardsData) {
        const processedCards = cardsData.map(card => {
          const processedCard = {
            id: card.id,
            title: card.title,
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || card.image_url || '',
            collectionId: card.collection_id,
            userId: card.creator_id || card.user_id,
            teamId: card.team_id,
            isPublic: card.is_public,
            tags: card.tags || [],
            effects: [],
            rarity: card.rarity || 'common',
            createdAt: new Date(card.created_at).toISOString(),
            updatedAt: new Date(card.updated_at).toISOString(),
            designMetadata: card.design_metadata || {},
          };
          return processedCard as Card;
        });
        setCards(processedCards);
      }
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error refreshing cards',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCollection = async (collectionData: Partial<Collection>): Promise<Collection> => {
    try {
      const newCollection: Collection = {
        id: `collection-${Date.now()}`,
        title: collectionData.title || 'Untitled Collection',
        name: collectionData.name || 'Untitled Collection',
        description: collectionData.description || '',
        coverImageUrl: collectionData.coverImageUrl || '',
        userId: 'user-1',
        teamId: collectionData.teamId || 'team-1',
        cards: [],
        isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
        visibility: collectionData.visibility || 'public',
        allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designMetadata: collectionData.designMetadata || {},
        cardIds: collectionData.cardIds || [],
      };
      setCollections(prev => [newCollection, ...prev]);
      return newCollection;
    } catch (err) {
      toast({
        title: 'Error creating collection',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
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
      return true;
    } catch (err) {
      toast({
        title: 'Error updating collection',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    try {
      setCollections(prev => prev.filter(collection => collection.id !== id));
      return true;
    } catch (err) {
      toast({
        title: 'Error deleting collection',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const addCardToCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    try {
      setCollections(prev =>
        prev.map(collection =>
          collection.id === collectionId
            ? {
              ...collection,
              cardIds: [...(collection.cardIds || []), cardId],
              updatedAt: new Date().toISOString()
            }
            : collection
        )
      );
      return true;
    } catch (err) {
      toast({
        title: 'Error adding card to collection',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeCardFromCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    try {
      setCollections(prev =>
        prev.map(collection =>
          collection.id === collectionId
            ? {
              ...collection,
              cardIds: collection.cardIds?.filter(id => id !== cardId) || [],
              updatedAt: new Date().toISOString()
            }
            : collection
        )
      );
      return true;
    } catch (err) {
      toast({
        title: 'Error removing card from collection',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const value = {
    cards,
    collections,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    getCardById,
    isLoading: loading,
    refreshCards,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};
