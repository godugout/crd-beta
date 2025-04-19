import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Card, Collection, DesignMetadata, DEFAULT_DESIGN_METADATA } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';

interface CardContextProps {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  getCard: (id: string) => Card | undefined;
  createCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Card | null>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<Card | null>;
  deleteCard: (id: string) => Promise<boolean>;
  createCollection: (collection: Partial<Collection>) => Promise<Collection | null>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<Collection | null>;
  deleteCollection: (id: string) => Promise<boolean>;
  addCardToCollection: (collectionId: string, cardId: string) => Promise<boolean>;
  removeCardFromCollection: (collectionId: string, cardId: string) => Promise<boolean>;
  getCollection: (id: string) => Collection | undefined;
}

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { supabaseClient } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch cards
        const { data: cardsData, error: cardsError } = await supabaseClient
          .from('cards')
          .select('*');

        if (cardsError) {
          throw new Error(`Error fetching cards: ${cardsError.message}`);
        }

        if (cardsData) {
          const adaptedCards = cardsData.map(card => ({
            id: card.id,
            title: card.title || 'Untitled Card',
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || '',
            tags: card.tags || [],
            userId: card.user_id || '',
            createdAt: card.created_at || new Date().toISOString(),
            updatedAt: card.updated_at || new Date().toISOString(),
            designMetadata: card.design_metadata || DEFAULT_DESIGN_METADATA,
            effects: card.effects || [],
            isPublic: card.is_public || false,
            backImageUrl: card.back_image_url || null,
            player: card.player || null,
            team: card.team || null,
            year: card.year || null,
            sport: card.sport || null,
            cardType: card.card_type || null,
            set: card.set || null,
            condition: card.condition || null,
            manufacturer: card.manufacturer || null,
            cardNumber: card.card_number || null,
            grade: card.grade || null,
            gradingCompany: card.grading_company || null,
            artist: card.artist || null,
            rarity: card.rarity || null,
            reactions: card.reactions || [],
            fabricSwatches: card.fabric_swatches || [],
            viewCount: card.view_count || 0,
            name: card.name || null,
            height: card.height || null,
            width: card.width || null,
            collectionId: card.collection_id || null,
          }));
          setCards(adaptedCards);
        }

        // Fetch collections
        const { data: collectionsData, error: collectionsError } = await supabaseClient
          .from('collections')
          .select('*');

        if (collectionsError) {
          throw new Error(`Error fetching collections: ${collectionsError.message}`);
        }

        if (collectionsData) {
          const adaptedCollections = collectionsData.map(collection => ({
            id: collection.id,
            title: collection.title || 'Untitled Collection',
            name: collection.name || null,
            description: collection.description || null,
            thumbnailUrl: collection.thumbnail_url || null,
            cardCount: collection.card_count || 0,
            createdAt: collection.created_at || new Date().toISOString(),
            updatedAt: collection.updated_at || new Date().toISOString(),
            userId: collection.owner_id || '',
            isPublic: collection.is_public || false,
            coverImageUrl: collection.cover_image_url || null,
            visibility: collection.visibility || 'public',
            featured: collection.featured || false,
            cards: collection.cards || [],
            allowComments: collection.allow_comments !== false,
            designMetadata: collection.design_metadata || DEFAULT_DESIGN_METADATA,
            tags: collection.tags || [],
          }));
          setCollections(adaptedCollections);
        }
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error fetching data",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [supabaseClient, toast]);

  const getCard = useCallback((id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  }, [cards]);

  const createCard = useCallback(async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newCard = {
        ...card,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabaseClient
        .from('cards')
        .insert([
          {
            id: newCard.id,
            title: newCard.title,
            description: newCard.description,
            image_url: newCard.imageUrl,
            thumbnail_url: newCard.thumbnailUrl,
            tags: newCard.tags,
            user_id: newCard.userId,
            created_at: newCard.createdAt,
            updated_at: newCard.updatedAt,
            design_metadata: newCard.designMetadata,
            effects: newCard.effects,
            is_public: newCard.isPublic,
            back_image_url: newCard.backImageUrl,
            player: newCard.player,
            team: newCard.team,
            year: newCard.year,
            sport: newCard.sport,
            card_type: newCard.cardType,
            set: newCard.set,
            condition: newCard.condition,
            manufacturer: newCard.manufacturer,
            card_number: newCard.cardNumber,
            grade: newCard.grade,
            grading_company: newCard.gradingCompany,
            artist: newCard.artist,
            rarity: newCard.rarity,
            reactions: newCard.reactions,
            fabric_swatches: newCard.fabricSwatches,
            view_count: newCard.viewCount,
            name: newCard.name,
            height: newCard.height,
            width: newCard.width,
            collection_id: newCard.collectionId,
          }
        ])
        .select('*')

      if (error) {
        throw new Error(`Error creating card: ${error.message}`);
      }

      if (data && data.length > 0) {
        setCards(prevCards => [...prevCards, newCard]);
        toast({
          title: "Card created",
          description: "Your card has been successfully created.",
        });
        return newCard;
      } else {
        throw new Error("Failed to retrieve created card.");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error creating card",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast]);

  const updateCard = useCallback(async (id: string, updates: Partial<Card>): Promise<Card | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('cards')
        .update({
          title: updates.title,
          description: updates.description,
          image_url: updates.imageUrl,
          thumbnail_url: updates.thumbnailUrl,
          tags: updates.tags,
          user_id: updates.userId,
          updated_at: new Date().toISOString(),
          design_metadata: updates.designMetadata,
          effects: updates.effects,
          is_public: updates.isPublic,
          back_image_url: updates.backImageUrl,
          player: updates.player,
          team: updates.team,
          year: updates.year,
          sport: updates.sport,
          card_type: updates.cardType,
          set: updates.set,
          condition: updates.condition,
          manufacturer: updates.manufacturer,
          card_number: updates.cardNumber,
          grade: updates.grade,
          grading_company: updates.gradingCompany,
          artist: updates.artist,
          rarity: updates.rarity,
          reactions: updates.reactions,
          fabric_swatches: updates.fabricSwatches,
          view_count: updates.viewCount,
          name: updates.name,
          height: updates.height,
          width: updates.width,
          collection_id: updates.collectionId,
        })
        .eq('id', id)
        .select('*');

      if (error) {
        throw new Error(`Error updating card: ${error.message}`);
      }

      if (data && data.length > 0) {
        setCards(prevCards =>
          prevCards.map(card => (card.id === id ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card))
        );
        toast({
          title: "Card updated",
          description: "The card has been successfully updated.",
        });
        return { ...data[0], ...updates } as Card;
      } else {
        throw new Error("Failed to retrieve updated card.");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error updating card",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast]);

  const deleteCard = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting card: ${error.message}`);
      }

      setCards(prevCards => prevCards.filter(card => card.id !== id));
      toast({
        title: "Card deleted",
        description: "The card has been successfully deleted.",
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error deleting card",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast]);

  const createCollection = useCallback(async (collection: Partial<Collection>): Promise<Collection | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newCollection = {
        ...collection,
        cards: collection.cards || [], // Changed from cardIds to cards
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (newCollection.allowComments === undefined) {
        newCollection.allowComments = true;
      }
      if (newCollection.designMetadata === undefined) {
        newCollection.designMetadata = DEFAULT_DESIGN_METADATA;
      }
      
      const { data, error } = await supabaseClient
        .from('collections')
        .insert([
          {
            id: newCollection.id,
            title: newCollection.title,
            description: newCollection.description,
            thumbnail_url: newCollection.thumbnailUrl,
            card_count: newCollection.cardCount,
            created_at: newCollection.createdAt,
            updated_at: newCollection.updatedAt,
            owner_id: newCollection.userId,
            is_public: newCollection.isPublic,
            cover_image_url: newCollection.coverImageUrl,
            visibility: newCollection.visibility,
            featured: newCollection.featured,
            allow_comments: newCollection.allowComments,
            design_metadata: newCollection.designMetadata,
            tags: newCollection.tags,
          }
        ])
        .select('*');

      if (error) {
        throw new Error(`Error creating collection: ${error.message}`);
      }

      if (data && data.length > 0) {
        setCollections(prevCollections => [...prevCollections, newCollection as Collection]);
        toast({
          title: "Collection created",
          description: "Your collection has been successfully created.",
        });
        return newCollection as Collection;
      } else {
        throw new Error("Failed to retrieve created collection.");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error creating collection",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast]);

  const updateCollection = useCallback(async (id: string, updates: Partial<Collection>): Promise<Collection | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('collections')
        .update({
          title: updates.title,
          description: updates.description,
          thumbnail_url: updates.thumbnailUrl,
          card_count: updates.cardCount,
          updated_at: new Date().toISOString(),
          owner_id: updates.userId,
          is_public: updates.isPublic,
          cover_image_url: updates.coverImageUrl,
          visibility: updates.visibility,
          featured: updates.featured,
          allow_comments: updates.allowComments,
          design_metadata: updates.designMetadata,
          tags: updates.tags,
        })
        .eq('id', id)
        .select('*');

      if (error) {
        throw new Error(`Error updating collection: ${error.message}`);
      }

      if (data && data.length > 0) {
        setCollections(prevCollections =>
          prevCollections.map(collection => (collection.id === id ? { ...collection, ...updates } : collection))
        );
        toast({
          title: "Collection updated",
          description: "The collection has been successfully updated.",
        });
        return { ...data[0], ...updates } as Collection;
      } else {
        throw new Error("Failed to retrieve updated collection.");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error updating collection",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast]);

  const deleteCollection = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting collection: ${error.message}`);
      }

      setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
      toast({
        title: "Collection deleted",
        description: "The collection has been successfully deleted.",
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error deleting collection",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast]);

  const addCardToCollection = useCallback(async (collectionId: string, cardId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) {
        throw new Error("Collection not found");
      }

      const updatedCollection = {
        ...collection,
        cards: [...(collection.cards || []), { id: cardId }], // Changed from cardIds to cards
      };

      const { error } = await supabaseClient
        .from('collections')
        .update({ cards: updatedCollection.cards })
        .eq('id', collectionId);

      if (error) {
        throw new Error(`Error adding card to collection: ${error.message}`);
      }

      setCollections(prevCollections =>
        prevCollections.map(c => (c.id === collectionId ? updatedCollection : c))
      );
      toast({
        title: "Card added to collection",
        description: "The card has been successfully added to the collection.",
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error adding card to collection",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast, collections]);

  const removeCardFromCollection = useCallback(async (collectionId: string, cardId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) {
        throw new Error("Collection not found");
      }

      const updatedCollection = {
        ...collection,
        cards: (collection.cards || []).filter(card => card.id !== cardId), // Changed from cardIds to cards
      };

      const { error } = await supabaseClient
        .from('collections')
        .update({ cards: updatedCollection.cards })
        .eq('id', collectionId);

      if (error) {
        throw new Error(`Error removing card from collection: ${error.message}`);
      }

      setCollections(prevCollections =>
        prevCollections.map(c => (c.id === collectionId ? updatedCollection : c))
      );
      toast({
        title: "Card removed from collection",
        description: "The card has been successfully removed from the collection.",
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error removing card from collection",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, toast, collections]);

  const getCollection = useCallback((id: string): Collection | undefined => {
    return collections.find(collection => collection.id === id);
  }, [collections]);

  const value: CardContextProps = {
    cards,
    collections,
    isLoading,
    error,
    getCard,
    createCard,
    updateCard,
    deleteCard,
    createCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    getCollection,
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};
