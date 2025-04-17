
import { supabase } from './client';

// Utility function to check if a collection exists
export const checkCollectionExists = async (collectionId: string) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', collectionId)
      .single();
    
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
