
import { supabase } from '../client';

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
