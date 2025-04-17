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
      
      // First try to get data from Supabase
      console.log('Fetching cards and collections from Supabase...');
      
      // Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*');
        
      if (collectionsError) {
        console.error('Error fetching collections from Supabase:', collectionsError);
      } else if (collectionsData && collectionsData.length > 0) {
        console.log(`Fetched ${collectionsData.length} collections from Supabase`);
        
        // Process collections
        const processedCollections = collectionsData.map(collection => ({
          id: collection.id,
          name: collection.title,
          description: collection.description || '',
          coverImageUrl: collection.cover_image_url || '',
          userId: collection.owner_id,
          teamId: collection.team_id,
          visibility: collection.visibility || 'public',
          allowComments: collection.allow_comments,
          isPublic: collection.visibility === 'public',
          cards: [],
          createdAt: new Date(collection.created_at).toISOString(),
          updatedAt: new Date(collection.updated_at).toISOString(),
          designMetadata: collection.design_metadata || {},
          cardIds: [],
        })) as Collection[];
        
        setCollections(processedCollections);
      }
      
      // Fetch cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*');
        
      if (cardsError) {
        console.error('Error fetching cards from Supabase:', cardsError);
      } else if (cardsData && cardsData.length > 0) {
        console.log(`Fetched ${cardsData.length} cards from Supabase`);
        
        // Process cards
        const processedCards = cardsData.map(card => {
          const processedCard = {
            id: card.id,
            title: card.title,
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || card.image_url || '',
            collectionId: card.collection_id,
            userId: card.creator_id,
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
        
        // Update collection cardIds
        if (processedCards.length > 0 && collections.length > 0) {
          setCollections(prevCollections => {
            return prevCollections.map(collection => {
              const collectionCards = processedCards.filter(card => 
                card.collectionId === collection.id
              );
              return {
                ...collection,
                cardIds: collectionCards.map(card => card.id),
              };
            });
          });
        }
        
        toast({
          title: "Content loaded",
          description: `Loaded ${processedCards.length} cards and ${collectionsData?.length || 0} collections`,
          variant: "default",
        });
        
        return;
      }
      
      // If Supabase data is empty/unavailable, use sample data as fallback
      if ((collections.length === 0 && cards.length === 0) || true) {
        console.log('Using sample data as fallback');
        
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
      }
      
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching cards:', error);
      setError(error);
      toast({
        title: 'Error fetching content',
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
    isLoading: loading,
  };
}
