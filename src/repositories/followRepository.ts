
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Following
export const followUser = async (followerId: string, followedId: string) => {
  const { data: existing } = await supabase
    .from('follows')
    .select('*')
    .eq('followerId', followerId)
    .eq('followedId', followedId)
    .single()
  if (existing) return // already following
  const { error } = await supabase
    .from('follows')
    .insert({ followerId, followedId })
  if (error) throw error
}

export const unfollowUser = async (followerId: string, followedId: string) => {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('followerId', followerId)
    .eq('followedId', followedId)
  if (error) throw error
}

export const isFollowingUser = async (followerId: string, followedId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('followerId', followerId)
    .eq('followedId', followedId)
  if (error) throw error
  return data && data.length > 0
}
