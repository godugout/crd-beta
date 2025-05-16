
import { createClient } from '@supabase/supabase-js'

// Create and export the supabase client so we don't need to duplicate this in every file
// In a real app, these values would come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
export const supabase = createClient(supabaseUrl, supabaseKey)

// Storage operations for handling images and files
export const storageOperations = {
  uploadImage: async (file: File, bucket: string): Promise<{data: any, error: any}> => {
    const filename = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`public/${filename}`, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      return { data: null, error };
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`public/${filename}`);
      
    return { data: { ...data, publicUrl: urlData.publicUrl }, error: null };
  },
  
  deleteImage: async (path: string, bucket: string): Promise<{data: any, error: any}> => {
    return await supabase.storage
      .from(bucket)
      .remove([path]);
  }
};

// Add mock operations - these would connect to real tables in a production app
export const cardOperations = {
  getCards: async () => ({ data: [], error: null }),
  getCardById: async (id: string) => ({ data: null, error: null }),
  createCard: async (card: any) => ({ data: { id: 'mock-id', ...card }, error: null }),
  updateCard: async (id: string, card: any) => ({ data: { id, ...card }, error: null }),
  deleteCard: async (id: string) => ({ data: { id }, error: null }),
};

export const collectionOperations = {
  getCollections: async () => ({ data: [], error: null }),
  getCollectionById: async (id: string) => ({ data: null, error: null }),
  createCollection: async (collection: any) => ({ data: { id: 'mock-id', ...collection }, error: null }),
  updateCollection: async (id: string, collection: any) => ({ data: { id, ...collection }, error: null }),
  deleteCollection: async (id: string) => ({ data: { id }, error: null }),
  addCardToCollection: async (collectionId: string, cardId: string) => ({ data: { id: 'mock-id', collectionId, cardId }, error: null }),
  removeCardFromCollection: async (collectionId: string, cardId: string) => ({ data: { success: true }, error: null }),
};
