
import { supabase } from '@/integrations/supabase/client';
import { Card, CardInsert, CardUpdate, cardSchema } from '../schema/types';
import { toast } from 'sonner';

/**
 * Repository for card-related data operations
 */
export const cardRepository = {
  /**
   * Get all cards with optional filtering
   */
  getCards: async (
    options?: {
      userId?: string;
      teamId?: string;
      collectionId?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<{ data: Card[] | null; error: any }> => {
    try {
      let query = supabase
        .from('cards')
        .select('*, reactions(*)');
      
      // Apply filters if provided
      if (options?.userId) {
        query = query.eq('user_id', options.userId);
      }
      
      if (options?.teamId) {
        query = query.eq('team_id', options.teamId);
      }
      
      if (options?.collectionId) {
        query = query.eq('collection_id', options.collectionId);
      }
      
      if (options?.tags && options.tags.length > 0) {
        query = query.contains('tags', options.tags);
      }
      
      if (options?.isPublic !== undefined) {
        query = query.eq('is_public', options.isPublic);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching cards:', error);
        return { data: null, error };
      }
      
      // Transform database records to our Card type
      const cards = data.map(transformCardFromDb);
      
      // Validate with Zod schema
      try {
        cards.forEach(card => cardSchema.parse(card));
      } catch (validationError) {
        console.error('Card validation error:', validationError);
        // Continue despite validation errors but log them
      }
      
      return { data: cards, error: null };
    } catch (err) {
      console.error('Unexpected error in getCards:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Get a single card by ID
   */
  getCard: async (id: string): Promise<{ data: Card | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*, reactions(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching card:', error);
        return { data: null, error };
      }
      
      const card = transformCardFromDb(data);
      
      // Validate with Zod schema
      try {
        cardSchema.parse(card);
      } catch (validationError) {
        console.error('Card validation error:', validationError);
        // Continue despite validation error but log it
      }
      
      return { data: card, error: null };
    } catch (err) {
      console.error('Unexpected error in getCard:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Create a new card
   */
  createCard: async (card: Omit<CardInsert, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Card | null; error: any }> => {
    try {
      // Prepare data for insertion
      const cardData = {
        title: card.title,
        description: card.description,
        image_url: card.imageUrl,
        thumbnail_url: card.thumbnailUrl,
        collection_id: card.collectionId,
        team_id: card.teamId,
        tags: card.tags || [],
        is_public: card.isPublic || false,
        user_id: card.userId,
      };
      
      const { data, error } = await supabase
        .from('cards')
        .insert(cardData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating card:', error);
        toast.error('Failed to create card');
        return { data: null, error };
      }
      
      const newCard = transformCardFromDb(data);
      
      toast.success('Card created successfully');
      return { data: newCard, error: null };
    } catch (err) {
      console.error('Unexpected error in createCard:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Update an existing card
   */
  updateCard: async (
    id: string, 
    updates: Partial<Omit<CardUpdate, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ data: Card | null; error: any }> => {
    try {
      // Convert to database field names
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.thumbnailUrl !== undefined) updateData.thumbnail_url = updates.thumbnailUrl;
      if (updates.collectionId !== undefined) updateData.collection_id = updates.collectionId;
      if (updates.teamId !== undefined) updateData.team_id = updates.teamId;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
      
      const { data, error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating card:', error);
        toast.error('Failed to update card');
        return { data: null, error };
      }
      
      const updatedCard = transformCardFromDb(data);
      
      toast.success('Card updated successfully');
      return { data: updatedCard, error: null };
    } catch (err) {
      console.error('Unexpected error in updateCard:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Delete a card
   */
  deleteCard: async (id: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete card');
        return { success: false, error };
      }
      
      toast.success('Card deleted successfully');
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in deleteCard:', err);
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  },

  /**
   * Add a reaction to a card
   */
  addReaction: async (
    cardId: string, 
    userId: string, 
    type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry'
  ): Promise<{ success: boolean; error: any }> => {
    try {
      // First check if the user already reacted to this card
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('*')
        .eq('card_id', cardId)
        .eq('user_id', userId)
        .single();
      
      if (existingReaction) {
        // Update existing reaction
        const { error } = await supabase
          .from('reactions')
          .update({ type })
          .eq('id', existingReaction.id);
        
        if (error) {
          console.error('Error updating reaction:', error);
          return { success: false, error };
        }
      } else {
        // Create new reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            card_id: cardId,
            user_id: userId,
            type,
          });
        
        if (error) {
          console.error('Error adding reaction:', error);
          return { success: false, error };
        }
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in addReaction:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Remove a reaction from a card
   */
  removeReaction: async (cardId: string, userId: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('card_id', cardId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error removing reaction:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in removeReaction:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Add a card to a team
   */
  assignToTeam: async (cardId: string, teamId: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({ team_id: teamId })
        .eq('id', cardId);
      
      if (error) {
        console.error('Error assigning card to team:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in assignToTeam:', err);
      return { success: false, error: err };
    }
  }
};

/**
 * Helper to transform database record to Card type
 */
function transformCardFromDb(record: any): Card {
  if (!record) return {} as Card;
  
  return {
    id: record.id,
    title: record.title || '',
    description: record.description || '',
    imageUrl: record.image_url || '',
    thumbnailUrl: record.thumbnail_url || record.image_url || '',
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    userId: record.user_id,
    teamId: record.team_id,
    collectionId: record.collection_id,
    isPublic: record.is_public,
    tags: record.tags || [],
    reactions: record.reactions ? record.reactions.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      cardId: r.card_id,
      type: r.type,
      createdAt: r.created_at
    })) : [],
    // Transform any other fields as needed
    designMetadata: record.design_metadata || {
      cardStyle: {},
      textStyle: {}
    },
  };
}
