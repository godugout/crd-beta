import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, Collection } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { sampleCards } from '@/lib/data/sampleCards';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      
      // Process sampleCards and ensure they have valid image URLs and all required properties
      const processedCards = sampleCards.map(card => {
        // Use our adapter to ensure all required properties exist
        return adaptToCard(card);
      });
      
      setCards(processedCards);

      // Demo collections
      const demoCollections = [
        {
          id: 'collection-1',
          name: 'Demo Collection 1',
          description: 'A sample collection',
          coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public' as const,
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-001']
        },
        {
          id: 'collection-2',
          name: 'Demo Collection 2',
          description: 'Another sample collection',
          coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public' as const,
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-002']
        }
      ];
      
      setCollections(demoCollections);
      
      toast({
        title: "Cards loaded",
        description: `Loaded ${processedCards.length} cards`,
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
  }, [toast]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const createCard = useCallback(async (cardData: Partial<Card>) => {
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
            ? adaptToCard({ ...card, ...updates, updatedAt: new Date().toISOString() })
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

  const getCard = useCallback((id: string): Card | undefined => {
    const foundCard = cards.find(card => card.id === id);
    if (!foundCard) {
      console.log(`Card with ID ${id} not found in cards array of length ${cards.length}`);
      // Try to find in sampleCards as fallback
      const sampleCard = sampleCards.find(card => card.id === id);
      if (sampleCard) {
        console.log(`Found card with ID ${id} in sampleCards`);
        return adaptToCard(sampleCard);
      }
    }
    return foundCard;
  }, [cards]);

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
    getCard,
  };
}
