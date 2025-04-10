
import { createClient } from '@supabase/supabase-js'

// Create and export the supabase client so we don't need to duplicate this in every file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)
