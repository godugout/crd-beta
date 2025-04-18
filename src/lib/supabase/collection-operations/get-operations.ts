import { supabase } from '../client';
import { convertDbCollectionToApp } from '../utils/collection-converter';

export const getCollectionOperations = {
  async getCollectionById(id: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { 
        data: convertDbCollectionToApp(data), 
        error: null 
      };
    } catch (err: any) {
      console.error('Error fetching collection:', err);
      return { 
        data: null, 
        error: { message: 'Failed to fetch collection: ' + (err.message || 'Unknown error') } 
      };
    }
  },
  
  async getUserCollections(userId: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('owner_id', userId);
      
      if (error) {
        return { data: [], error };
      }
      
      return { 
        data: data.map(col => convertDbCollectionToApp(col)).filter(Boolean),
        error: null 
      };
    } catch (err: any) {
      console.error('Error fetching user collections:', err);
      return { 
        data: [], 
        error: { message: 'Failed to fetch collections: ' + (err.message || 'Unknown error') } 
      };
    }
  },
  
  async getPublicCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('visibility', 'public');
      
      if (error) {
        return { data: [], error };
      }
      
      return { 
        data: data.map(col => convertDbCollectionToApp(col)).filter(Boolean),
        error: null 
      };
    } catch (err: any) {
      console.error('Error fetching public collections:', err);
      return { 
        data: [], 
        error: { message: 'Failed to fetch public collections: ' + (err.message || 'Unknown error') } 
      };
    }
  },
  
  async getCollection(id: string) {
    return this.getCollectionById(id);
  },
  
  async getCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*');
      
      if (error) {
        return { data: [], error };
      }
      
      return { 
        data: data.map(col => convertDbCollectionToApp(col)).filter(Boolean),
        error: null 
      };
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      return { 
        data: [], 
        error: { message: 'Failed to fetch collections: ' + (err.message || 'Unknown error') } 
      };
    }
  },
  
  async getCollectionWithCards(collectionId: string) {
    try {
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single();
      
      if (collectionError) {
        return { 
          data: null, 
          error: collectionError 
        };
      }
      
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('collection_id', collectionId);
        
      if (cardsError) {
        console.error('Error fetching cards for collection:', cardsError);
      }
      
      return { 
        data: { 
          collection, 
          cards: cards || [] 
        }, 
        error: null 
      };
    } catch (err: any) {
      console.error('Error fetching collection with cards:', err);
      return { 
        data: null, 
        error: { message: 'Failed to fetch collection with cards: ' + (err.message || 'Unknown error') } 
      };
    }
  }
};
