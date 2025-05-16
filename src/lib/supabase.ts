
import { createClient } from '@supabase/supabase-js'

// Create and export the supabase client so we don't need to duplicate this in every file
// In a real app, these values would come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
export const supabase = createClient(supabaseUrl, supabaseKey)
