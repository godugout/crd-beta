import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, Collection } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      
      const demoCards: Card[] = [
        {
          id: 'card-1',
          title: 'Demo Card 1',
          description: 'This is a sample card',
          imageUrl: '/lovable-uploads/0edc670d-08ee-42a5-b42a-b2a3bea81c04.png',
          thumbnailUrl: '/lovable-uploads/0edc670d-08ee-42a5-b42a-b2a3bea81c04.png',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user-1',
          teamId: 'team-1',
          collectionId: 'collection-1',
          isPublic: true,
          tags: ['sample', 'demo'],
          designMetadata: {},
          reactions: [],
          effects: [] // Add required effects property
        },
        {
          id: 'card-2',
          title: 'Demo Card 2',
          description: 'Another sample card',
          imageUrl: '/lovable-uploads/0edc670d-08ee-42a5-b42a-b2a3bea81c04.png',
          thumbnailUrl: '/lovable-uploads/0edc670d-08ee-42a5-b42a-b2a3bea81c04.png',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user-1',
          teamId: 'team-1',
          collectionId: 'collection-2',
          isPublic: true,
          tags: ['sample', 'featured'],
          designMetadata: {},
          reactions: [],
          effects: ['Holographic'] // Add required effects property
        }
      ];
      
      setCards(demoCards);

      // Demo collections
      const demoCollections = [
        {
          id: 'collection-1',
          name: 'Demo Collection 1',
          description: 'A sample collection',
          coverImageUrl: '/collection1.jpg',
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public' as const,
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-1']
        },
        {
          id: 'collection-2',
          name: 'Demo Collection 2',
          description: 'Another sample collection',
          coverImageUrl: '/collection2.jpg',
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public' as const,
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-2']
        }
      ];
      
      setCollections(demoCollections);
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
  }, [toast]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const createCard = useCallback(async (cardData: Partial<Card>) => {
    try {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.thumbnailUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-1',
        teamId: 'team-1',
        collectionId: cardData.collectionId || '',
        isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
        tags: cardData.tags || [],
        designMetadata: cardData.designMetadata || {},
        reactions: [],
        effects: cardData.effects || [] // Add required effects property
      };
      
      setCards(prev => [newCard, ...prev]);
      
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
  }, [toast]);

  const updateCard = useCallback(async (id: string, updates: Partial<Card>) => {
    try {
      setCards(prev => 
        prev.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date().toISOString() } 
            : card
        )
      );
      
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
  }, [toast]);

  const deleteCard = useCallback(async (id: string) => {
    try {
      setCards(prev => prev.filter(card => card.id !== id));
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
  }, [toast]);

  const createCollection = useCallback(async (collectionData: Partial<Collection>) => {
    try {
      const newCollection: Collection = {
        id: `collection-${Date.now()}`,
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
      const error = err as Error;
      console.error('Error creating collection:', error);
      toast({
        title: 'Error creating collection',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  return {
    cards,
    collections,
    loading,
    error,
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
    createCollection,
  };
}
