
import { createClient } from '@supabase/supabase-js';
import { Card, Collection, User } from './types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication helpers
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { data, error };
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  }
};

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

// Media/Storage operations
export const storageOperations = {
  uploadImage: async (file: File, path: string): Promise<{ data: { path: string; url: string } | null; error: any }> => {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(filePath, file);
      
    if (data) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(data.path);
        
      return { 
        data: { 
          path: data.path,
          url: publicUrl 
        }, 
        error 
      };
    }
    
    return { data: null, error };
  },
  
  deleteImage: async (path: string): Promise<{ error: any }> => {
    const { error } = await supabase.storage
      .from('card-images')
      .remove([path]);
      
    return { error };
  }
};
