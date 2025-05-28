import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, Collection } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { sampleCards } from '@/lib/data/sampleCards';
import { basketballCards } from '@/data/basketballCards';
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
      console.log('Fetching cards...');
      
      // Combine all card sources
      let allCards: Card[] = [];
      
      // First, add the basketball cards (our priority cards)
      allCards = [...basketballCards];
      console.log(`Added ${basketballCards.length} basketball cards`);
      
      // Try to get data from Supabase
      try {
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*');
          
        if (!cardsError && cardsData && cardsData.length > 0) {
          console.log(`Fetched ${cardsData.length} cards from Supabase`);
          
          // Process cards from database
          const processedCards = cardsData.map(card => {
            return {
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
            } as Card;
          });
          
          // Add Supabase cards, avoiding duplicates
          processedCards.forEach(dbCard => {
            if (!allCards.find(card => card.id === dbCard.id)) {
              allCards.push(dbCard);
            }
          });
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
      }
      
      // Add sample cards as fallback, avoiding duplicates
      if (sampleCards && sampleCards.length > 0) {
        const processedSampleCards = sampleCards.map(card => adaptToCard(card));
        processedSampleCards.forEach(sampleCard => {
          if (!allCards.find(card => card.id === sampleCard.id)) {
            allCards.push(sampleCard);
          }
        });
        console.log(`Added ${processedSampleCards.length} sample cards`);
      }
      
      // Ensure we have at least some cards
      if (allCards.length === 0) {
        console.log('No cards found, creating fallback card');
        const fallbackCard: Card = adaptToCard({
          id: 'fallback-card-1',
          title: 'Sample Card',
          description: 'This is a sample card to get you started.',
          imageUrl: '/placeholder-card.png',
          thumbnailUrl: '/placeholder-card.png',
          userId: 'sample-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['sample', 'demo'],
          effects: []
        });
        allCards = [fallbackCard];
      }
      
      console.log(`Total cards loaded: ${allCards.length}`);
      setCards(allCards);
      
      toast({
        title: "Cards loaded",
        description: `Loaded ${allCards.length} cards including basketball collection`,
        variant: "default",
      });
      
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching cards:', error);
      setError(error);
      
      // Even if there's an error, provide the basketball cards
      console.log('Error occurred, using basketball cards as fallback');
      setCards(basketballCards);
      
      toast({
        title: 'Partial load',
        description: `Loaded ${basketballCards.length} basketball cards (some sources unavailable)`,
        variant: 'default',
      });
      
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Automatically fetch cards on initial render
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
      // Try to find in basketball cards as priority fallback
      const basketballCard = basketballCards.find(card => card.id === id);
      if (basketballCard) {
        console.log(`Found card with ID ${id} in basketballCards`);
        return basketballCard;
      }
      // Try to find in sampleCards as secondary fallback
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
    isLoading: loading,
  };
}
