
import { supabase } from '@/integrations/supabase/client';
import { Collection, CollectionInsert, CollectionUpdate, collectionSchema } from '../schema/types';
import { toast } from 'sonner';
import { cardRepository } from './cardRepository';

/**
 * Repository for collection-related data operations
 */
export const collectionRepository = {
  /**
   * Get all collections with optional filtering
   */
  getCollections: async (
    options?: {
      userId?: string;
      teamId?: string;
      includeCards?: boolean;
      visibility?: 'public' | 'private' | 'team';
    }
  ): Promise<{ data: Collection[] | null; error: any }> => {
    try {
      let query = supabase
        .from('collections')
        .select(options?.includeCards ? '*, cards(*)' : '*');
      
      // Apply filters if provided
      if (options?.userId) {
        query = query.eq('user_id', options.userId);
      }
      
      if (options?.teamId) {
        query = query.eq('team_id', options.teamId);
      }
      
      if (options?.visibility) {
        query = query.eq('visibility', options.visibility);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching collections:', error);
        return { data: null, error };
      }
      
      // Transform database records to our Collection type
      const collections = data.map(record => transformCollectionFromDb(record, options?.includeCards));
      
      // Validate with Zod schema
      try {
        collections.forEach(collection => collectionSchema.parse(collection));
      } catch (validationError) {
        console.error('Collection validation error:', validationError);
        // Continue despite validation errors but log them
      }
      
      return { data: collections, error: null };
    } catch (err) {
      console.error('Unexpected error in getCollections:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Get a single collection by ID
   */
  getCollection: async (id: string, includeCards: boolean = true): Promise<{ data: Collection | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(includeCards ? '*, cards(*)' : '*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching collection:', error);
        return { data: null, error };
      }
      
      const collection = transformCollectionFromDb(data, includeCards);
      
      // Validate with Zod schema
      try {
        collectionSchema.parse(collection);
      } catch (validationError) {
        console.error('Collection validation error:', validationError);
        // Continue despite validation error but log it
      }
      
      return { data: collection, error: null };
    } catch (err) {
      console.error('Unexpected error in getCollection:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Create a new collection
   */
  createCollection: async (collection: Omit<CollectionInsert, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Collection | null; error: any }> => {
    try {
      // Prepare data for insertion
      const collectionData = {
        name: collection.name,
        description: collection.description,
        cover_image_url: collection.coverImageUrl,
        team_id: collection.teamId,
        user_id: collection.userId,
        visibility: collection.visibility || 'private',
        allow_comments: collection.allowComments !== undefined ? collection.allowComments : true,
        design_metadata: collection.designMetadata || {}
      };
      
      const { data, error } = await supabase
        .from('collections')
        .insert(collectionData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating collection:', error);
        toast.error('Failed to create collection');
        return { data: null, error };
      }
      
      const newCollection = transformCollectionFromDb(data, false);
      
      toast.success('Collection created successfully');
      return { data: newCollection, error: null };
    } catch (err) {
      console.error('Unexpected error in createCollection:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Update an existing collection
   */
  updateCollection: async (
    id: string, 
    updates: Partial<Omit<CollectionUpdate, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ data: Collection | null; error: any }> => {
    try {
      // Convert to database field names
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.coverImageUrl !== undefined) updateData.cover_image_url = updates.coverImageUrl;
      if (updates.teamId !== undefined) updateData.team_id = updates.teamId;
      if (updates.visibility !== undefined) updateData.visibility = updates.visibility;
      if (updates.allowComments !== undefined) updateData.allow_comments = updates.allowComments;
      if (updates.designMetadata !== undefined) updateData.design_metadata = updates.designMetadata;
      
      const { data, error } = await supabase
        .from('collections')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating collection:', error);
        toast.error('Failed to update collection');
        return { data: null, error };
      }
      
      const updatedCollection = transformCollectionFromDb(data, false);
      
      toast.success('Collection updated successfully');
      return { data: updatedCollection, error: null };
    } catch (err) {
      console.error('Unexpected error in updateCollection:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Delete a collection
   */
  deleteCollection: async (id: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting collection:', error);
        toast.error('Failed to delete collection');
        return { success: false, error };
      }
      
      toast.success('Collection deleted successfully');
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in deleteCollection:', err);
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  },

  /**
   * Add a card to a collection
   */
  addCardToCollection: async (cardId: string, collectionId: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({ collection_id: collectionId })
        .eq('id', cardId);
      
      if (error) {
        console.error('Error adding card to collection:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in addCardToCollection:', err);
      return { success: false, error: err };
    }
  },
  
  /**
   * Remove a card from a collection
   */
  removeCardFromCollection: async (cardId: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({ collection_id: null })
        .eq('id', cardId);
      
      if (error) {
        console.error('Error removing card from collection:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in removeCardFromCollection:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Add a collection to a team
   */
  assignToTeam: async (collectionId: string, teamId: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('collections')
        .update({ team_id: teamId })
        .eq('id', collectionId);
      
      if (error) {
        console.error('Error assigning collection to team:', error);
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
 * Helper to transform database record to Collection type
 */
function transformCollectionFromDb(record: any, includeCards: boolean = false): Collection {
  if (!record) return {} as Collection;
  
  const collection: Collection = {
    id: record.id,
    name: record.name,
    description: record.description || '',
    coverImageUrl: record.cover_image_url || '',
    userId: record.user_id,
    teamId: record.team_id,
    visibility: record.visibility || 'private',
    allowComments: record.allow_comments !== undefined ? record.allow_comments : true,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    cards: [],
    designMetadata: record.design_metadata || {
      wrapperColor: '',
      wrapperPattern: '',
      packType: 'standard'
    }
  };
  
  // Process cards if included and available
  if (includeCards && record.cards) {
    collection.cards = record.cards.map((card: any) => ({
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
      tags: card.tags || [],
    }));
  }
  
  return collection;
}
