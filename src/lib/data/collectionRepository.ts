import { supabase } from '@/lib/supabase';
import { Collection, serializeMetadata } from '@/lib/types';

export const collectionRepository = {
  /**
   * Get a collection by ID
   */
  async getCollectionById(id: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      if (!data) {
        return { data: null, error: 'Collection not found' };
      }
      
      const dbCollection = data;
      const collection: Collection = {
        id: dbCollection.id,
        name: dbCollection.title,
        description: dbCollection.description || '',
        coverImageUrl: dbCollection.cover_image_url || undefined,
        visibility: dbCollection.visibility as 'public' | 'private' | 'team' | 'unlisted',
        allowComments: dbCollection.allow_comments || false,
        designMetadata: dbCollection.design_metadata,
        createdAt: dbCollection.created_at,
        updatedAt: dbCollection.updated_at,
        userId: dbCollection.owner_id,
        teamId: dbCollection.team_id,
        cardIds: [],
        cards: [],
        isPublic: dbCollection.visibility === 'public',
      };
      
      return { data: collection, error: null };
    } catch (err) {
      console.error('Error getting collection by ID:', err);
      return { data: null, error: 'Failed to get collection' };
    }
  },
  
  /**
   * Update a collection
   */
  async updateCollection(id: string, collectionUpdates: Partial<Collection>) {
    try {
      const updateCollectionData: any = {};
      if (collectionUpdates.name !== undefined) updateCollectionData.title = collectionUpdates.name;
      if (collectionUpdates.description !== undefined) updateCollectionData.description = collectionUpdates.description;
      if (collectionUpdates.coverImageUrl !== undefined) updateCollectionData.cover_image_url = collectionUpdates.coverImageUrl;
      if (collectionUpdates.visibility !== undefined) {
        updateCollectionData.visibility = collectionUpdates.visibility;
      }
      if (collectionUpdates.allowComments !== undefined) updateCollectionData.allow_comments = collectionUpdates.allowComments;
      if (collectionUpdates.designMetadata !== undefined) {
        updateCollectionData.design_metadata = serializeMetadata(collectionUpdates.designMetadata);
      }
      if (collectionUpdates.teamId !== undefined) updateCollectionData.team_id = collectionUpdates.teamId;
      
      const { data, error } = await supabase
        .from('collections')
        .update(updateCollectionData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const dbCollection = data;
      const collection: Collection = {
        id: dbCollection.id,
        name: dbCollection.title,
        description: dbCollection.description || '',
        coverImageUrl: dbCollection.cover_image_url || undefined,
        visibility: dbCollection.visibility as 'public' | 'private' | 'team' | 'unlisted',
        allowComments: dbCollection.allow_comments || false,
        designMetadata: dbCollection.design_metadata,
        createdAt: dbCollection.created_at,
        updatedAt: dbCollection.updated_at,
        userId: dbCollection.owner_id,
        teamId: dbCollection.team_id,
        cardIds: [],
        cards: [],
        isPublic: dbCollection.visibility === 'public',
      };
      
      return { data: collection, error: null };
    } catch (err) {
      console.error('Error updating collection:', err);
      return { data: null, error: 'Failed to update collection' };
    }
  },
  
  /**
   * Filter collections based on options
   */
  async filterCollections(filterOptions: {
    userId?: string;
    teamId?: string;
    visibility?: string;
  }) {
    try {
      let queryBuilder = supabase
        .from('collections')
        .select('*');
      
      if (filterOptions.teamId) {
        queryBuilder = queryBuilder.eq('team_id', filterOptions.teamId);
      }
      
      if (filterOptions.userId) {
        queryBuilder = queryBuilder.eq('owner_id', filterOptions.userId);
      }
      
      if (filterOptions.visibility) {
        queryBuilder = queryBuilder.eq('visibility', filterOptions.visibility);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const collections: Collection[] = data.map(dbCollection => ({
        id: dbCollection.id,
        name: dbCollection.title,
        description: dbCollection.description || '',
        coverImageUrl: dbCollection.cover_image_url || undefined,
        visibility: dbCollection.visibility as 'public' | 'private' | 'team' | 'unlisted',
        allowComments: dbCollection.allow_comments || false,
        designMetadata: dbCollection.design_metadata,
        createdAt: dbCollection.created_at,
        updatedAt: dbCollection.updated_at,
        userId: dbCollection.owner_id,
        teamId: dbCollection.team_id,
        cardIds: [],
        cards: [],
        isPublic: dbCollection.visibility === 'public',
      }));
      
      return { data: collections, error: null };
    } catch (err) {
      console.error('Error filtering collections:', err);
      return { data: null, error: 'Failed to filter collections' };
    }
  },
  
  /**
   * Create a new collection
   */
  async createCollection(collection: Partial<Collection>) {
    try {
      const collectionData = {
        title: collection.name,
        description: collection.description || null,
        cover_image_url: collection.coverImageUrl || null,
        visibility: collection.visibility || 'private',
        allow_comments: collection.allowComments !== undefined ? collection.allowComments : true,
        owner_id: collection.userId,
        team_id: collection.teamId || null,
        design_metadata: collection.designMetadata ? serializeMetadata(collection.designMetadata) : {}
      };
      
      const { data, error } = await supabase
        .from('collections')
        .insert(collectionData)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const dbCollection = data;
      const newCollection: Collection = {
        id: dbCollection.id,
        name: dbCollection.title,
        description: dbCollection.description || '',
        coverImageUrl: dbCollection.cover_image_url || undefined,
        visibility: dbCollection.visibility as 'public' | 'private' | 'team' | 'unlisted',
        allowComments: dbCollection.allow_comments || false,
        designMetadata: dbCollection.design_metadata,
        createdAt: dbCollection.created_at,
        updatedAt: dbCollection.updated_at,
        userId: dbCollection.owner_id,
        teamId: dbCollection.team_id,
        cardIds: [],
        cards: [],
        isPublic: dbCollection.visibility === 'public',
      };
      
      return { data: newCollection, error: null };
    } catch (err) {
      console.error('Error creating collection:', err);
      return { data: null, error: 'Failed to create collection' };
    }
  }
};
