
import { supabase } from '@/integrations/supabase/client';

export async function getFirstUserID(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }

    return data && data.length > 0 ? data[0].id : null;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}
