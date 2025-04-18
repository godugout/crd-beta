
import { supabase } from './client';
import { Collection } from '@/lib/types';

// Collection operations for Supabase
export const collectionOperations = {
  /**
   * Get all collections
   */
  async getCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });
        
      return { data, error };
    } catch (err: any) {
      console.error('Error getting collections:', err);
      return { data: null, error: { message: 'Failed to get collections' } };
    }
  },
  
  /**
   * Get a collection by ID
   */
  async getCollection(id: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        return { data: null, error };
      }
      
      if (!data) {
        return { data: null, error: { message: 'Collection not found' } };
      }
      
      const collection = convertDbCollectionToApp(data);
      return { data: collection, error: null };
    } catch (err: any) {
      console.error('Error getting collection:', err);
      return { data: null, error: { message: 'Failed to get collection: ' + (err.message || 'Unknown error') } };
    }
  },
  
  /**
   * Get collection with cards
   */
  async getCollectionWithCards(id: string) {
    try {
      // First get the collection
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (collectionError) {
        console.error('Error fetching collection:', collectionError);
        return { data: null, error: collectionError };
      }
      
      if (!collectionData) {
        console.log('Collection not found in Supabase');
        return { data: null, error: { message: 'Collection not found' } };
      }
      
      // Then get the cards for this collection
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('collection_id', id);
        
      if (cardsError) {
        console.error('Error fetching collection cards:', cardsError);
        return { 
          data: { collection: collectionData, cards: [] }, 
          error: { message: 'Failed to fetch collection cards' } 
        };
      }
      
      return { 
        data: { collection: collectionData, cards: cardsData || [] },
        error: null
      };
    } catch (err: any) {
      console.error('Error getting collection with cards:', err);
      return { data: null, error: { message: 'Failed to get collection with cards: ' + (err.message || 'Unknown error') } };
    }
  },
  
  /**
   * Create a collection
   */
  async createCollection(collection: Partial<Collection>) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          title: collection.name,
          description: collection.description,
          cover_image_url: collection.coverImageUrl,
          visibility: collection.visibility || 'private',
          owner_id: collection.userId,
          team_id: collection.teamId,
          design_metadata: collection.designMetadata || {},
          allow_comments: collection.allowComments
        })
        .select()
        .single();
        
      if (error) {
        return { data: null, error };
      }
      
      const convertedCollection = convertDbCollectionToApp(data);
      return { data: convertedCollection, error: null };
    } catch (err: any) {
      console.error('Error creating collection:', err);
      return { data: null, error: { message: 'Failed to create collection: ' + (err.message || 'Unknown error') } };
    }
  },
  
  /**
   * Update a collection
   */
  async updateCollection(id: string, updates: Partial<Collection>) {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.title = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.coverImageUrl !== undefined) updateData.cover_image_url = updates.coverImageUrl;
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
        return { data: null, error };
      }
      
      const convertedCollection = convertDbCollectionToApp(data);
      return { data: convertedCollection, error: null };
    } catch (err: any) {
      console.error('Error updating collection:', err);
      return { data: null, error: { message: 'Failed to update collection: ' + (err.message || 'Unknown error') } };
    }
  },
  
  /**
   * Delete a collection
   */
  async deleteCollection(id: string) {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
        
      return { error };
    } catch (err: any) {
      console.error('Error deleting collection:', err);
      return { error: { message: 'Failed to delete collection: ' + (err.message || 'Unknown error') } };
    }
  },
  
  /**
   * Add a card to a collection
   */
  async addCardToCollection(cardId: string, collectionId: string) {
    try {
      // First update the card to set its collection_id
      const { error: cardError } = await supabase
        .from('cards')
        .update({ collection_id: collectionId })
        .eq('id', cardId);
      
      if (cardError) {
        return { error: cardError };
      }
      
      // Now create the join table entry if needed
      const { error: joinError } = await supabase
        .from('collection_cards')
        .upsert({
          collection_id: collectionId,
          card_id: cardId
        });
        
      return { error: joinError };
    } catch (err: any) {
      console.error('Error adding card to collection:', err);
      return { error: { message: 'Failed to add card to collection: ' + (err.message || 'Unknown error') } };
    }
  },
  
  /**
   * Remove a card from a collection
   */
  async removeCardFromCollection(cardId: string) {
    try {
      // Update the card to remove its collection_id
      const { error: cardError } = await supabase
        .from('cards')
        .update({ collection_id: null })
        .eq('id', cardId);
      
      if (cardError) {
        return { error: cardError };
      }
      
      // Remove the join table entry
      const { error: joinError } = await supabase
        .from('collection_cards')
        .delete()
        .eq('card_id', cardId);
        
      return { error: joinError };
    } catch (err: any) {
      console.error('Error removing card from collection:', err);
      return { error: { message: 'Failed to remove card from collection: ' + (err.message || 'Unknown error') } };
    }
  }
};

// Utility function to check if a collection exists
export const checkCollectionExists = async (collectionId: string) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking collection:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Unexpected error checking collection:', err);
    return false;
  }
};

// Convert from database schema to app schema
export const convertDbCollectionToApp = (dbCollection: any): Collection => {
  if (!dbCollection) return null as unknown as Collection;
  
  return {
    id: dbCollection.id,
    name: dbCollection.title,
    description: dbCollection.description || '',
    coverImageUrl: dbCollection.cover_image_url || '',
    userId: dbCollection.owner_id,
    teamId: dbCollection.team_id,
    visibility: dbCollection.visibility || 'public',
    allowComments: dbCollection.allow_comments,
    isPublic: dbCollection.visibility === 'public',
    designMetadata: dbCollection.design_metadata || {},
    cards: [],
    cardIds: [],
    createdAt: dbCollection.created_at,
    updatedAt: dbCollection.updated_at,
  };
};
