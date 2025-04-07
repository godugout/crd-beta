
import { supabase } from '@/integrations/supabase/client';
import { Collection, DbCollection } from '../schema/types';
import { toast } from 'sonner';

/**
 * Repository for collection-related data operations
 */
export const collectionRepository = {
  /**
   * Get all collections
   */
  getCollections: async (userId?: string): Promise<{ data: Collection[] | null; error: any }> => {
    try {
      let query = supabase
        .from('collections')
        .select('*');
      
      if (userId) {
        query = query.eq('owner_id', userId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching collections:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: [], error: null };
      }
      
      const collections: Collection[] = data.map(record => {
        if (!record || typeof record === 'string') {
          console.error('Invalid collection record:', record);
          return null;
        }
        
        return transformCollectionFromDb(record as DbCollection);
      }).filter(Boolean) as Collection[];
      
      return { data: collections, error: null };
    } catch (err) {
      console.error('Unexpected error in getCollections:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Get a collection by ID
   */
  getCollection: async (id: string): Promise<{ data: Collection | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching collection:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: null, error: new Error('Collection not found') };
      }
      
      const collection = transformCollectionFromDb(data as DbCollection);
      
      return { data: collection, error: null };
    } catch (err) {
      console.error('Unexpected error in getCollection:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Create a new collection
   */
  createCollection: async (collection: Partial<Collection>): Promise<{ data: Collection | null; error: any }> => {
    try {
      if (!collection.name) {
        return { data: null, error: new Error('Collection name is required') };
      }
      
      const collectionData = {
        title: collection.name, // Name is stored as title in DB
        description: collection.description,
        cover_image_url: collection.coverImageUrl,
        owner_id: collection.userId || collection.ownerId,
        team_id: collection.teamId,
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
      
      if (!data) {
        return { data: null, error: new Error('No data returned from collection creation') };
      }
      
      const newCollection = transformCollectionFromDb(data as DbCollection);
      toast.success('Collection created successfully');
      
      return { data: newCollection, error: null };
    } catch (err) {
      console.error('Unexpected error in createCollection:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Update a collection
   */
  updateCollection: async (id: string, updates: Partial<Collection>): Promise<{ data: Collection | null; error: any }> => {
    try {
      // Convert to database field names
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) updateData.title = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.coverImageUrl !== undefined) updateData.cover_image_url = updates.coverImageUrl;
      if (updates.visibility !== undefined) updateData.visibility = updates.visibility;
      if (updates.allowComments !== undefined) updateData.allow_comments = updates.allowComments;
      if (updates.teamId !== undefined) updateData.team_id = updates.teamId;
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
      
      if (!data) {
        return { data: null, error: new Error('No data returned from collection update') };
      }
      
      const updatedCollection = transformCollectionFromDb(data as DbCollection);
      toast.success('Collection updated successfully');
      
      return { data: updatedCollection, error: null };
    } catch (err) {
      console.error('Unexpected error in updateCollection:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Delete a collection by ID
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
   * Get public collections
   */
  getPublicCollections: async (): Promise<{ data: Collection[] | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching public collections:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: [], error: null };
      }
      
      const collections: Collection[] = data.map(record => {
        if (!record || typeof record === 'string') {
          console.error('Invalid collection record:', record);
          return null;
        }
        
        return transformCollectionFromDb(record as DbCollection);
      }).filter(Boolean) as Collection[];
      
      return { data: collections, error: null };
    } catch (err) {
      console.error('Unexpected error in getPublicCollections:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Add cards to a collection
   */
  addCardToCollection: async (
    collectionId: string, 
    cardId: string
  ): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('collection_cards')
        .insert({
          collection_id: collectionId,
          card_id: cardId
        });
      
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
   * Get collection cards
   */
  getCollectionCards: async (collectionId: string): Promise<{ data: any[] | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('collection_id', collectionId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching collection cards:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in getCollectionCards:', err);
      return { data: null, error: err };
    }
  }
};

/**
 * Helper to transform database record to Collection type
 */
function transformCollectionFromDb(record: DbCollection): Collection {
  if (!record) return {} as Collection;

  return {
    id: record.id,
    name: record.title, // Title field in DB maps to name in our app
    description: record.description || '',
    coverImageUrl: record.cover_image_url,
    userId: record.owner_id,
    ownerId: record.owner_id, // For backward compatibility
    teamId: record.team_id,
    visibility: record.visibility as 'public' | 'private' | 'team',
    allowComments: record.allow_comments,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    designMetadata: record.design_metadata
  };
}
