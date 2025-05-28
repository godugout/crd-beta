
import { supabase } from '@/integrations/supabase/client';

// Development test user credentials
const DEV_USER = {
  email: 'test@cardshow.dev',
  password: 'testpass123',
  userData: {
    full_name: 'Test User',
    display_name: 'Test User'
  }
};

export const ensureDevUserLoggedIn = async () => {
  try {
    // Check if already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      console.log('Already logged in as:', session.user.email);
      return session.user;
    }

    // Try to sign in with test user
    console.log('Attempting to log in test user...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEV_USER.email,
      password: DEV_USER.password,
    });

    if (signInData?.user) {
      console.log('Logged in successfully as:', signInData.user.email);
      return signInData.user;
    }

    // If sign in failed, try to create the user
    if (signInError) {
      console.log('Sign in failed, attempting to create test user...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: DEV_USER.email,
        password: DEV_USER.password,
        options: {
          data: DEV_USER.userData
        }
      });

      if (signUpData?.user) {
        console.log('Test user created and logged in:', signUpData.user.email);
        return signUpData.user;
      }

      if (signUpError) {
        console.error('Failed to create test user:', signUpError);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};
