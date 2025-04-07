
import { supabase } from '@/integrations/supabase/client';
import { Card, DbCard } from '../schema/types';
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
        .select('*');
      
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
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching card:', error);
        return { data: null, error };
      }
      
      const card = transformCardFromDb(data);
      
      return { data: card, error: null };
    } catch (err) {
      console.error('Unexpected error in getCard:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Create a new card
   */
  createCard: async (card: Partial<Card>): Promise<{ data: Card | null; error: any }> => {
    try {
      // Prepare data for insertion
      const cardData = {
        title: card.title,
        description: card.description || '',
        image_url: card.imageUrl,
        thumbnail_url: card.thumbnailUrl,
        collection_id: card.collectionId,
        team_id: card.teamId,
        tags: card.tags || [],
        is_public: card.isPublic || false,
        user_id: card.userId,
        // If database requires creator_id and rarity, include them
        creator_id: card.userId,
        rarity: 'common',
        edition_size: 1,
        design_metadata: card.designMetadata || {}
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
    updates: Partial<Card>
  ): Promise<{ data: Card | null; error: any }> => {
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
  },

  /**
   * Batch update multiple cards
   */
  batchUpdate: async (
    cardIds: string[], 
    updates: Partial<Card>
  ): Promise<{ success: boolean; error: any }> => {
    try {
      // Convert to database field names
      const updateData: Record<string, any> = {};
      
      if (updates.teamId !== undefined) updateData.team_id = updates.teamId;
      if (updates.collectionId !== undefined) updateData.collection_id = updates.collectionId;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      
      const { error } = await supabase
        .from('cards')
        .update(updateData)
        .in('id', cardIds);
      
      if (error) {
        console.error('Error batch updating cards:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in batchUpdate:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Get cards by team with efficient query
   */
  getTeamCards: async (teamId: string): Promise<{ data: Card[] | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching team cards:', error);
        return { data: null, error };
      }
      
      // Transform database records to our Card type
      const cards = data.map(transformCardFromDb);
      
      return { data: cards, error: null };
    } catch (err) {
      console.error('Unexpected error in getTeamCards:', err);
      return { data: null, error: err };
    }
  }
};

/**
 * Helper to transform database record to Card type
 */
function transformCardFromDb(record: DbCard): Card {
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
    designMetadata: record.design_metadata || {
      cardStyle: {},
      textStyle: {}
    },
    reactions: [] // Reactions might need to be loaded separately
  };
}
