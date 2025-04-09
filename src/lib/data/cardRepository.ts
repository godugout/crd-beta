import { supabase } from '@/lib/supabase';
import { Card, DbCard } from '@/lib/types';

/**
 * Maps a database card object to the app's Card interface
 */
const mapDbCardToCard = (dbCard: DbCard): Card => {
  return {
    id: dbCard.id,
    title: dbCard.title,
    description: dbCard.description || '',
    imageUrl: dbCard.image_url || '',
    thumbnailUrl: dbCard.thumbnail_url || undefined,
    tags: dbCard.tags || [],
    collectionId: dbCard.collection_id,
    createdAt: dbCard.created_at,
    updatedAt: dbCard.updated_at,
    userId: dbCard.user_id,
    teamId: dbCard.team_id,
    isPublic: dbCard.is_public,
    designMetadata: dbCard.design_metadata
  };
};

/**
 * Repository for card operations
 */
export const cardRepository = {
  /**
   * Get all cards
   */
  async getAllCards() {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const cards: Card[] = data.map(mapDbCardToCard);
      return { data: cards, error: null };
    } catch (err) {
      console.error('Error getting all cards:', err);
      return { data: null, error: 'Failed to get cards' };
    }
  },
  
  /**
   * Get a card by ID
   */
  async getCardById(id: string) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          reactions (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      if (!data) {
        return { data: null, error: 'Card not found' };
      }
      
      const card: Card = {
        ...mapDbCardToCard(data),
        reactions: data.reactions
      };
      
      return { data: card, error: null };
    } catch (err) {
      console.error('Error getting card by ID:', err);
      return { data: null, error: 'Failed to get card' };
    }
  },
  
  /**
   * Get cards by collection ID
   */
  async getCardsByCollectionId(collectionId: string) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('collection_id', collectionId)
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const cards: Card[] = data.map(mapDbCardToCard);
      return { data: cards, error: null };
    } catch (err) {
      console.error('Error getting cards by collection ID:', err);
      return { data: null, error: 'Failed to get cards' };
    }
  },
  
  /**
   * Get cards by user ID
   */
  async getCardsByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const cards: Card[] = data.map(mapDbCardToCard);
      return { data: cards, error: null };
    } catch (err) {
      console.error('Error getting cards by user ID:', err);
      return { data: null, error: 'Failed to get cards' };
    }
  },
  
  /**
   * Filter cards based on provided criteria
   */
  async filterCards({
    userId,
    collectionId,
    teamId,
    tags,
    isPublic,
    searchQuery
  }: {
    userId?: string;
    collectionId?: string;
    teamId?: string;
    tags?: string[];
    isPublic?: boolean;
    searchQuery?: string;
  }) {
    try {
      let query = supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (collectionId) {
        query = query.eq('collection_id', collectionId);
      }
      
      if (teamId && typeof teamId === 'string') {
        query = query.eq('team_id', teamId);
      }
      
      if (isPublic !== undefined) {
        query = query.eq('is_public', isPublic);
      }
      
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const cards: Card[] = data.map(dbCard => ({
        id: dbCard.id,
        title: dbCard.title,
        description: dbCard.description || '',
        imageUrl: dbCard.image_url || '',
        thumbnailUrl: dbCard.thumbnail_url || undefined,
        tags: dbCard.tags || [],
        collectionId: dbCard.collection_id,
        createdAt: dbCard.created_at,
        updatedAt: dbCard.updated_at,
        userId: dbCard.user_id,
        teamId: dbCard.team_id,
        isPublic: dbCard.is_public,
        designMetadata: dbCard.design_metadata
      }));
      
      return { data: cards, error: null };
    } catch (err) {
      console.error('Error filtering cards:', err);
      return { data: null, error: 'Failed to filter cards' };
    }
  },
  
  /**
   * Create a new card
   */
  async createCard(cardData: Partial<Card>) {
    try {
      const dbCardData = {
        title: cardData.title || '',
        description: cardData.description,
        image_url: cardData.imageUrl,
        thumbnail_url: cardData.thumbnailUrl,
        tags: cardData.tags,
        collection_id: cardData.collectionId,
        user_id: cardData.userId,
        team_id: cardData.teamId,
        is_public: cardData.isPublic !== undefined ? cardData.isPublic : false,
        design_metadata: cardData.designMetadata
      };
      
      const { data, error } = await supabase
        .from('cards')
        .insert(dbCardData)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const card: Card = mapDbCardToCard(data);
      return { data: card, error: null };
    } catch (err) {
      console.error('Error creating card:', err);
      return { data: null, error: 'Failed to create card' };
    }
  },
  
  /**
   * Update an existing card
   */
  async updateCard(id: string, updates: Partial<Card>) {
    try {
      const dbCardUpdates: any = {};
      
      if (updates.title !== undefined) dbCardUpdates.title = updates.title;
      if (updates.description !== undefined) dbCardUpdates.description = updates.description;
      if (updates.imageUrl !== undefined) dbCardUpdates.image_url = updates.imageUrl;
      if (updates.thumbnailUrl !== undefined) dbCardUpdates.thumbnail_url = updates.thumbnailUrl;
      if (updates.tags !== undefined) dbCardUpdates.tags = updates.tags;
      if (updates.collectionId !== undefined) dbCardUpdates.collection_id = updates.collectionId;
      if (updates.isPublic !== undefined) dbCardUpdates.is_public = updates.isPublic;
      if (updates.designMetadata !== undefined) dbCardUpdates.design_metadata = updates.designMetadata;
      
      const { data, error } = await supabase
        .from('cards')
        .update(dbCardUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const updatedCard: Card = mapDbCardToCard(data);
      return { data: updatedCard, error: null };
    } catch (err) {
      console.error('Error updating card:', err);
      return { data: null, error: 'Failed to update card' };
    }
  },
  
  /**
   * Delete a card by ID
   */
  async deleteCard(id: string) {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Error deleting card:', err);
      return { success: false, error: 'Failed to delete card' };
    }
  }
};
