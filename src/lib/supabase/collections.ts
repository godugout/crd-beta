import { Card, Collection } from '../types';
import { supabase } from './client';

// Collection operations
export const collectionOperations = {
  getCollections: async (): Promise<{ data: Collection[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('collections')
      .select('*, cards(*)')
      .order('created_at', { ascending: false });
      
    if (data) {
      // Convert dates from strings to Date objects
      const processedCollections = data.map(collection => ({
        ...collection,
        createdAt: new Date(collection.created_at),
        updatedAt: new Date(collection.updated_at),
        name: collection.title, // Add name property based on title for compatibility
        cards: (collection.cards || []).map((card: any) => ({
          ...card,
          createdAt: new Date(card.created_at),
          updatedAt: new Date(card.updated_at),
          tags: card.tags || []
        }))
      })) as unknown as Collection[];
      
      return { data: processedCollections, error };
    }
    
    return { data: null, error };
  },
  
  getCollectionById: async (id: string): Promise<{ data: Collection | null; error: any }> => {
    const { data, error } = await supabase
      .from('collections')
      .select('*, cards(*)')
      .eq('id', id)
      .single();
      
    if (data) {
      const processedCollection = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        name: data.title, // Add name property based on title for compatibility
        cards: (data.cards || []).map((card: any) => ({
          ...card,
          createdAt: new Date(card.created_at),
          updatedAt: new Date(card.updated_at),
          tags: card.tags || []
        }))
      } as unknown as Collection;
      
      return { data: processedCollection, error };
    }
    
    return { data: null, error };
  },
  
  createCollection: async (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>): Promise<{ data: Collection | null; error: any }> => {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        name: collection.name,
        description: collection.description
      })
      .select()
      .single();
      
    if (data) {
      const processedCollection = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        cards: []
      } as unknown as Collection;
      
      return { data: processedCollection, error };
    }
    
    return { data: null, error };
  },
  
  updateCollection: async (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>): Promise<{ data: Collection | null; error: any }> => {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    
    const { data, error } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (data) {
      const processedCollection = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        cards: []
      } as unknown as Collection;
      
      return { data: processedCollection, error };
    }
    
    return { data: null, error };
  },
  
  deleteCollection: async (id: string): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);
      
    return { error };
  },
  
  addCardToCollection: async (cardId: string, collectionId: string): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('cards')
      .update({ collection_id: collectionId })
      .eq('id', cardId);
      
    return { error };
  },
  
  removeCardFromCollection: async (cardId: string): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('cards')
      .update({ collection_id: null })
      .eq('id', cardId);
      
    return { error };
  }
};
