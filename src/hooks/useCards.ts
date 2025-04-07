import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DbCard } from '@/lib/supabase/typeHelpers';

interface UseCardsOptions {
  teamId?: string;
  collectionId?: string;
  tags?: string[];
  autoFetch?: boolean;
}

export function useCards(options: UseCardsOptions = {}) {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!user) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('cards')
        .select('*');
      
      // Apply filters if provided
      if (options.teamId) {
        query = query.eq('team_id', options.teamId);
      }
      
      if (options.collectionId) {
        query = query.eq('collection_id', options.collectionId);
      }
      
      if (options.tags && options.tags.length > 0) {
        query = query.contains('tags', options.tags);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching cards:', error);
        setError(error.message || 'Failed to load cards');
        toast.error('Failed to load cards');
        return;
      }

      if (data) {
        // Transform database records to our Card type
        const transformedCards: Card[] = (data as DbCard[]).map(card => ({
          id: card.id,
          title: card.title || '',
          description: card.description || '',
          imageUrl: card.image_url || '',
          thumbnailUrl: card.thumbnail_url || card.image_url || '',
          createdAt: card.created_at,
          updatedAt: card.updated_at,
          userId: card.user_id,
          teamId: card.team_id,
          collectionId: card.collection_id,
          isPublic: card.is_public || false,
          tags: card.tags || [],
          designMetadata: card.design_metadata || {},
          reactions: []
        }));

        setCards(transformedCards);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching cards:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  }, [user, options.teamId, options.collectionId, options.tags]);

  // Initial fetch
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchCards();
    }
  }, [fetchCards, options.autoFetch]);

  const addCard = useCallback(async (cardData: Partial<Card>) => {
    if (!user) {
      toast.error('You must be logged in to create cards');
      return null;
    }

    try {
      // Transform Card type to database schema
      const cardToInsert = {
        title: cardData.title,
        description: cardData.description,
        image_url: cardData.imageUrl,
        thumbnail_url: cardData.thumbnailUrl,
        collection_id: cardData.collectionId,
        team_id: cardData.teamId,
        tags: cardData.tags || [],
        is_public: cardData.isPublic || false,
        user_id: user.id,
        creator_id: user.id, // Required by current db schema
        rarity: 'common', // Required by current db schema
        design_metadata: cardData.designMetadata || {},
        edition_size: 1 // Required by current db schema
      };

      const { data, error } = await supabase
        .from('cards')
        .insert(cardToInsert)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating card:', error);
        toast.error('Failed to create card');
        return null;
      }

      if (data) {
        // Transform back to our Card type
        const dbCard = data as DbCard;
        const newCard: Card = {
          id: dbCard.id,
          title: dbCard.title || '',
          description: dbCard.description || '',
          imageUrl: dbCard.image_url || '',
          thumbnailUrl: dbCard.thumbnail_url || dbCard.image_url || '',
          createdAt: dbCard.created_at,
          updatedAt: dbCard.updated_at,
          userId: dbCard.user_id,
          teamId: dbCard.team_id,
          collectionId: dbCard.collection_id,
          isPublic: dbCard.is_public || false,
          tags: dbCard.tags || [],
          designMetadata: dbCard.design_metadata || {},
          reactions: []
        };

        setCards(prev => [newCard, ...prev]);
        toast.success('Card created successfully');
        return newCard;
      }
    } catch (err: any) {
      console.error('Error creating card:', err);
      toast.error('Failed to create card');
    }

    return null;
  }, [user]);

  const updateCard = useCallback(async (id: string, updates: Partial<Card>) => {
    try {
      // Convert to database field names
      const updateData: Record<string, any> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.thumbnailUrl !== undefined) updateData.thumbnail_url = updates.thumbnailUrl;
      if (updates.collectionId !== undefined) updateData.collection_id = updates.collectionId;
      if (updates.teamId !== undefined) updateData.team_id = updates.teamId;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
      if (updates.designMetadata !== undefined) updateData.design_metadata = updates.designMetadata;
      
      const { data, error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating card:', error);
        toast.error('Failed to update card');
        return null;
      }

      if (data) {
        // Transform back to our Card type
        const dbCard = data as DbCard;
        const updatedCard: Card = {
          id: dbCard.id,
          title: dbCard.title || '',
          description: dbCard.description || '',
          imageUrl: dbCard.image_url || '',
          thumbnailUrl: dbCard.thumbnail_url || dbCard.image_url || '',
          createdAt: dbCard.created_at,
          updatedAt: dbCard.updated_at,
          userId: dbCard.user_id,
          teamId: dbCard.team_id,
          collectionId: dbCard.collection_id,
          isPublic: dbCard.is_public || false,
          tags: dbCard.tags || [],
          designMetadata: dbCard.design_metadata ? dbCard.design_metadata : {},
          reactions: []
        };
        
        setCards(prev => prev.map(card => card.id === id ? updatedCard : card));
        toast.success('Card updated successfully');
        return updatedCard;
      }
    } catch (err: any) {
      console.error('Error updating card:', err);
      toast.error('Failed to update card');
    }

    return null;
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete card');
        return false;
      }
      
      setCards(prev => prev.filter(card => card.id !== id));
      toast.success('Card deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting card:', err);
      toast.error('Failed to delete card');
      return false;
    }
  }, []);

  const getCard = useCallback((id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  }, [cards]);

  const addReaction = useCallback(async (
    cardId: string,
    type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry'
  ) => {
    if (!user) {
      toast.error('You must be logged in to react to cards');
      return false;
    }

    try {
      // First check if user already reacted
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('id')
        .eq('card_id', cardId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      let result;
      
      if (existingReaction) {
        // Update existing reaction
        result = await supabase
          .from('reactions')
          .update({ type })
          .eq('id', existingReaction.id);
      } else {
        // Add new reaction
        result = await supabase
          .from('reactions')
          .insert({
            card_id: cardId,
            user_id: user.id,
            type
          });
      }
      
      if (result.error) {
        console.error('Error adding reaction:', result.error);
        toast.error('Failed to add reaction');
        return false;
      }
      
      // Optimistic update
      setCards(prev => prev.map(card => {
        if (card.id !== cardId) return card;
        
        const existingReactionIndex = card.reactions?.findIndex(r => r.userId === user.id);
        const reactions = [...(card.reactions || [])];
        
        if (existingReactionIndex !== undefined && existingReactionIndex >= 0) {
          // Update existing reaction
          reactions[existingReactionIndex] = {
            ...reactions[existingReactionIndex],
            type
          };
        } else {
          // Add new reaction
          reactions.push({
            id: 'temp-' + Date.now(),
            userId: user.id,
            cardId,
            type,
            createdAt: new Date().toISOString()
          });
        }
        
        return {
          ...card,
          reactions
        };
      }));

      return true;
    } catch (err) {
      console.error('Error adding reaction:', err);
      return false;
    }
  }, [user]);

  const removeReaction = useCallback(async (cardId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('card_id', cardId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error removing reaction:', error);
        return false;
      }
      
      // Optimistic update
      setCards(prev => prev.map(card => {
        if (card.id !== cardId) return card;
        
        return {
          ...card,
          reactions: (card.reactions || []).filter(r => r.userId !== user.id)
        };
      }));
      
      return true;
    } catch (err) {
      console.error('Error removing reaction:', err);
      return false;
    }
  }, [user]);

  return {
    cards,
    isLoading,
    error,
    fetchCards,
    addCard,
    updateCard: () => {},
    deleteCard: () => {},
    getCard: () => {},
    addReaction: () => {},
    removeReaction: () => {}
  };
}
