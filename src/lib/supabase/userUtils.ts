
import { supabase } from '@/integrations/supabase/client';

export async function getFirstUserID(): Promise<string | null> {
  try {
    // Instead of querying auth.users directly (which isn't accessible via from()),
    // we'll use the auth.getUser() API to get current user or profiles table for a stored user
    
    // First try to get the current authenticated user
    const { data: authData } = await supabase.auth.getSession();
    if (authData.session?.user?.id) {
      return authData.session.user.id;
    }
    
    // If no authenticated user, try getting the first user from the profiles table
    // (which is a public table that mirrors auth.users)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error fetching user ID from profiles:', error);
      return null;
    }

    return data && data.length > 0 ? data[0].id : null;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}
