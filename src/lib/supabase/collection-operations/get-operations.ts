
import { supabase } from '../client';
import { Collection } from '@/lib/types';
import { convertDbCollectionToApp } from '../utils/collection-converter';

export const getCollectionOperations = {
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

  async getCollectionWithCards(id: string) {
    try {
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
  }
};
