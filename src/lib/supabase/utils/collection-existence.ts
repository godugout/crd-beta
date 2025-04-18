
import { supabase } from '../client';

/**
 * Simple utility to check if a collection exists by ID
 * Uses a simpler query to minimize the chance of errors
 */
export const checkCollectionExists = async (id: string): Promise<boolean> => {
  if (!id) return false;
  
  try {
    // Use a count query which is more efficient than fetching the whole record
    const { count, error } = await supabase
      .from('collections')
      .select('id', { count: 'exact', head: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error in checkCollectionExists:', error);
      return false;
    }
    
    return count ? count > 0 : false;
  } catch (err) {
    console.error('Unexpected error in checkCollectionExists:', err);
    return false;
  }
};
