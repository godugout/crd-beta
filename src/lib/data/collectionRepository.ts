
import { supabase } from '@/lib/supabase';
import { Collection, DbCollection, Card } from '@/lib/types';

/**
 * Maps a database collection to our app's Collection interface
 */
const mapDbCollectionToCollection = (dbCollection: DbCollection): Collection => {
  return {
    id: dbCollection.id,
    name: dbCollection.title || '',
    description: dbCollection.description || '',
    coverImageUrl: dbCollection.cover_image_url,
    visibility: (dbCollection.visibility as 'public' | 'private' | 'unlisted' | 'team') || 'private',
    allowComments: dbCollection.allow_comments !== undefined ? dbCollection.allow_comments : true,
    designMetadata: dbCollection.design_metadata,
    createdAt: dbCollection.created_at,
    updatedAt: dbCollection.updated_at,
    userId: dbCollection.owner_id,
    teamId: dbCollection.team_id
  };
};

export const collectionRepository = {
  /**
   * Get all collections
   */
  async getAllCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const collections: Collection[] = data.map(mapDbCollectionToCollection);
      return { data: collections, error: null };
    } catch (err) {
      console.error('Error getting all collections:', err);
      return { data: null, error: 'Failed to get collections' };
    }
  },
  
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
      
      const collection: Collection = mapDbCollectionToCollection(data);
      
      // Get cards in this collection
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('collection_id', id)
        .order('created_at', { ascending: false });
      
      if (!cardsError && cardsData) {
        collection.cards = cardsData.map(card => ({
          id: card.id,
          title: card.title,
          description: card.description || '',
          imageUrl: card.image_url || '',
          thumbnailUrl: card.thumbnail_url,
          tags: card.tags,
          collectionId: card.collection_id,
          userId: card.user_id,
          teamId: card.team_id,
          createdAt: card.created_at,
          updatedAt: card.updated_at,
          isPublic: card.is_public,
          designMetadata: card.design_metadata
        }));
      }
      
      return { data: collection, error: null };
    } catch (err) {
      console.error('Error getting collection by ID:', err);
      return { data: null, error: 'Failed to get collection' };
    }
  },
  
  /**
   * Get collections by user ID
   */
  async getCollectionsByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const collections: Collection[] = data.map(mapDbCollectionToCollection);
      return { data: collections, error: null };
    } catch (err) {
      console.error('Error getting collections by user ID:', err);
      return { data: null, error: 'Failed to get collections' };
    }
  },
  
  /**
   * Get collections by team ID
   */
  async getCollectionsByTeamId(teamId: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const collections: Collection[] = data.map(mapDbCollectionToCollection);
      return { data: collections, error: null };
    } catch (err) {
      console.error('Error getting collections by team ID:', err);
      return { data: null, error: 'Failed to get collections' };
    }
  },
  
  /**
   * Create a new collection
   */
  async createCollection(collectionData: Partial<Collection>) {
    try {
      const dbCollectionData = {
        title: collectionData.name || '',
        description: collectionData.description,
        cover_image_url: collectionData.coverImageUrl,
        visibility: collectionData.visibility || 'private',
        allow_comments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
        design_metadata: collectionData.designMetadata,
        owner_id: collectionData.userId,
        team_id: collectionData.teamId
      };
      
      const { data, error } = await supabase
        .from('collections')
        .insert(dbCollectionData)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const collection: Collection = mapDbCollectionToCollection(data);
      return { data: collection, error: null };
    } catch (err) {
      console.error('Error creating collection:', err);
      return { data: null, error: 'Failed to create collection' };
    }
  },
  
  /**
   * Update an existing collection
   */
  async updateCollection(id: string, updates: Partial<Collection>) {
    try {
      const dbCollectionUpdates: any = {};
      
      if (updates.name !== undefined) dbCollectionUpdates.title = updates.name;
      if (updates.description !== undefined) dbCollectionUpdates.description = updates.description;
      if (updates.coverImageUrl !== undefined) dbCollectionUpdates.cover_image_url = updates.coverImageUrl;
      if (updates.visibility !== undefined) dbCollectionUpdates.visibility = updates.visibility;
      if (updates.allowComments !== undefined) dbCollectionUpdates.allow_comments = updates.allowComments;
      if (updates.designMetadata !== undefined) dbCollectionUpdates.design_metadata = updates.designMetadata;
      if (updates.teamId !== undefined) dbCollectionUpdates.team_id = updates.teamId;
      
      const { data, error } = await supabase
        .from('collections')
        .update(dbCollectionUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const updatedCollection: Collection = mapDbCollectionToCollection(data);
      return { data: updatedCollection, error: null };
    } catch (err) {
      console.error('Error updating collection:', err);
      return { data: null, error: 'Failed to update collection' };
    }
  },
  
  /**
   * Delete a collection by ID
   */
  async deleteCollection(id: string) {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Error deleting collection:', err);
      return { success: false, error: 'Failed to delete collection' };
    }
  },
  
  /**
   * Add a card to a collection
   */
  async addCardToCollection(cardId: string, collectionId: string) {
    try {
      // First update the card's collection_id
      const { error } = await supabase
        .from('cards')
        .update({ collection_id: collectionId })
        .eq('id', cardId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Error adding card to collection:', err);
      return { success: false, error: 'Failed to add card to collection' };
    }
  },
  
  /**
   * Remove a card from a collection
   */
  async removeCardFromCollection(cardId: string) {
    try {
      // Set the card's collection_id to null
      const { error } = await supabase
        .from('cards')
        .update({ collection_id: null })
        .eq('id', cardId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Error removing card from collection:', err);
      return { success: false, error: 'Failed to remove card from collection' };
    }
  },
  
  /**
   * Get public collections
   */
  async getPublicCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const collections: Collection[] = data.map(dbCollection => ({
        id: dbCollection.id,
        name: dbCollection.title || '',
        description: dbCollection.description || '',
        coverImageUrl: dbCollection.cover_image_url,
        visibility: (dbCollection.visibility as 'public' | 'private' | 'unlisted' | 'team') || 'private',
        allowComments: dbCollection.allow_comments !== undefined ? dbCollection.allow_comments : true,
        designMetadata: dbCollection.design_metadata,
        createdAt: dbCollection.created_at,
        updatedAt: dbCollection.updated_at,
        userId: dbCollection.owner_id,
        teamId: dbCollection.team_id
      }));
      
      return { data: collections, error: null };
    } catch (err) {
      console.error('Error getting public collections:', err);
      return { data: null, error: 'Failed to get collections' };
    }
  }
};
