
import { supabase } from '../client';
import { Collection } from '@/lib/types';
import { convertDbCollectionToApp } from '../utils/collection-converter';

export const modifyCollectionOperations = {
  async createCollection(collection: Partial<Collection>) {
    try {
      // Convert from app format to DB format
      const dbCollection = {
        title: collection.name,
        description: collection.description,
        cover_image_url: collection.coverImageUrl,
        owner_id: collection.userId,
        team_id: collection.teamId,
        visibility: collection.visibility || 'public',
        allow_comments: collection.allowComments !== false, // default to true if not specified
        design_metadata: collection.designMetadata || {}
      };
      
      const { data, error } = await supabase
        .from('collections')
        .insert(dbCollection)
        .select('*')
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { 
        data: convertDbCollectionToApp(data), 
        error: null 
      };
    } catch (err: any) {
      console.error('Error creating collection:', err);
      return { 
        data: null, 
        error: { message: 'Failed to create collection: ' + (err.message || 'Unknown error') } 
      };
    }
  },
  
  async updateCollection(id: string, updates: Partial<Collection>) {
    try {
      // Convert from app format to DB format
      const dbUpdates: Record<string, any> = {};
      
      if (updates.name !== undefined) dbUpdates.title = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.coverImageUrl !== undefined) dbUpdates.cover_image_url = updates.coverImageUrl;
      if (updates.teamId !== undefined) dbUpdates.team_id = updates.teamId;
      if (updates.visibility !== undefined) dbUpdates.visibility = updates.visibility;
      if (updates.allowComments !== undefined) dbUpdates.allow_comments = updates.allowComments;
      if (updates.designMetadata !== undefined) dbUpdates.design_metadata = updates.designMetadata;
      
      const { data, error } = await supabase
        .from('collections')
        .update(dbUpdates)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { 
        data: convertDbCollectionToApp(data), 
        error: null 
      };
    } catch (err: any) {
      console.error('Error updating collection:', err);
      return { 
        data: null, 
        error: { message: 'Failed to update collection: ' + (err.message || 'Unknown error') } 
      };
    }
  },
  
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
  }
};
