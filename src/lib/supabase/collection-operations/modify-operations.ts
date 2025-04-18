
import { supabase } from '../client';
import { Collection } from '@/lib/types';
import { convertDbCollectionToApp } from '../utils/collection-converter';

export const modifyCollectionOperations = {
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
