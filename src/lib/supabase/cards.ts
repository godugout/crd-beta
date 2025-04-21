
import { Card } from '../types';
import { supabase } from './client';

// Card operations
export const cardOperations = {
  getCards: async (): Promise<{ data: Card[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      // Convert dates from strings to Date objects
      const processedCards = data.map(card => ({
        ...card,
        createdAt: new Date(card.created_at),
        updatedAt: new Date(card.updated_at),
        tags: card.tags || []
      })) as unknown as Card[];
      
      return { data: processedCards, error };
    }
    
    return { data: null, error };
  },
  
  getCard: async (id: string): Promise<{ data: Card | null; error: any }> => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();
      
    if (data) {
      const processedCard = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        tags: data.tags || []
      } as unknown as Card;
      
      return { data: processedCard, error };
    }
    
    return { data: null, error };
  },
  
  createCard: async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Card | null; error: any }> => {
    const { data, error } = await supabase
      .from('cards')
      .insert({
        title: card.title,
        description: card.description,
        image_url: card.imageUrl,
        thumbnail_url: card.thumbnailUrl,
        collection_id: card.collectionId,
        tags: card.tags
      })
      .select()
      .single();
      
    if (data) {
      const processedCard = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        tags: data.tags || []
      } as unknown as Card;
      
      return { data: processedCard, error };
    }
    
    return { data: null, error };
  },
  
  updateCard: async (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ data: Card | null; error: any }> => {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.thumbnailUrl !== undefined) updateData.thumbnail_url = updates.thumbnailUrl;
    if (updates.collectionId !== undefined) updateData.collection_id = updates.collectionId;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    
    const { data, error } = await supabase
      .from('cards')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (data) {
      const processedCard = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        tags: data.tags || []
      } as unknown as Card;
      
      return { data: processedCard, error };
    }
    
    return { data: null, error };
  },
  
  deleteCard: async (id: string): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);
      
    return { error };
  }
};
