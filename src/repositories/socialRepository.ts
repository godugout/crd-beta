
// repositories/socialRepository.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful' | 'baseball'

export interface Reaction {
  id: string
  userId: string
  type: ReactionType
  memoryId?: string
  collectionId?: string
  commentId?: string
  createdAt: string
}

export interface Comment {
  id: string
  userId: string
  content: string
  memoryId?: string
  collectionId?: string
  parentCommentId?: string
  createdAt: string
  updatedAt?: string
}

// Add reaction
export const addReaction = async (
  userId: string,
  type: ReactionType,
  { memoryId, collectionId, commentId }: { memoryId?: string; collectionId?: string; commentId?: string }
): Promise<Reaction> => {
  // Validate
  if ([memoryId, collectionId, commentId].filter(Boolean).length !== 1) {
    throw new Error('Reaction must be tied to exactly one resource')
  }
  // Check if exists
  let query = supabase.from('reactions').select('*').eq('userId', userId).eq('type', type)
  if (memoryId) query = query.eq('memoryId', memoryId)
  if (collectionId) query = query.eq('collectionId', collectionId)
  if (commentId) query = query.eq('commentId', commentId)
  const { data: existing } = await query
  if (existing && existing.length > 0) return existing[0]

  const { data, error } = await supabase
    .from('reactions')
    .insert({ userId, type, memoryId, collectionId, commentId })
    .select('*')
    .single()
  if (error) throw error
  return data
}

// Remove reaction
export const removeReaction = async (
  userId: string,
  type: ReactionType,
  { memoryId, collectionId, commentId }: { memoryId?: string; collectionId?: string; commentId?: string }
) => {
  let query = supabase.from('reactions').delete().eq('userId', userId).eq('type', type)
  if (memoryId) query = query.eq('memoryId', memoryId)
  if (collectionId) query = query.eq('collectionId', collectionId)
  if (commentId) query = query.eq('commentId', commentId)
  const { error } = await query
  if (error) throw error
}

// Get reactions for an item
export const getReactions = async (
  { memoryId, collectionId, commentId }: { memoryId?: string; collectionId?: string; commentId?: string }
) => {
  let query = supabase.from('reactions').select('*')
  if (memoryId) query = query.eq('memoryId', memoryId)
  if (collectionId) query = query.eq('collectionId', collectionId)
  if (commentId) query = query.eq('commentId', commentId)
  const { data, error } = await query
  if (error) throw error
  const reactionCounts: Record<ReactionType, number> = {
    like: 0, love: 0, celebrate: 0, insightful: 0, baseball: 0
  }
  
  (data||[]).forEach(r => {
    // Ensure r.type exists and is a valid key for reactionCounts
    if (r.type && typeof r.type === 'string') {
      // Use type assertion to tell TypeScript this is a valid ReactionType
      const reactionType = r.type as ReactionType;
      if (reactionType in reactionCounts) {
        reactionCounts[reactionType] += 1;
      }
    }
  })
  
  return { reactions: data||[], counts: reactionCounts }
}

// Comments
export const addComment = async (
  userId: string,
  content: string,
  { memoryId, collectionId, parentCommentId }: { memoryId?: string; collectionId?: string; parentCommentId?: string }
): Promise<Comment> => {
  if ([memoryId, collectionId, parentCommentId].filter(Boolean).length < 1) {
    throw new Error('Comment must belong to memory or collection or parent comment')
  }
  const { data, error } = await supabase
    .from('comments')
    .insert({ userId, content, memoryId, collectionId, parentCommentId })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export const updateComment = async (id: string, userId: string, content: string): Promise<Comment> => {
  // Validate ownership
  const { data: comment, error: fetchErr } = await supabase
    .from('comments')
    .select('*')
    .eq('id', id)
    .eq('userId', userId)
    .single()
  if (fetchErr) throw fetchErr
  if (!comment) throw new Error('Comment not found or not yours')

  const { data, error } = await supabase
    .from('comments')
    .update({ content, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteComment = async (id: string, userId: string) => {
  // Validate ownership
  const { data: comment, error: fetchErr } = await supabase
    .from('comments')
    .select('*')
    .eq('id', id)
    .eq('userId', userId)
    .single()
  if (fetchErr) throw fetchErr
  if (!comment) throw new Error('Comment not found or not yours')

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export const getComments = async (
  { memoryId, collectionId, parentCommentId, page=1, limit=10 }:
  { memoryId?: string; collectionId?: string; parentCommentId?: string; page?: number; limit?: number }
) => {
  const offset = (page-1)*limit
  let query = supabase
    .from('comments')
    .select('*', { count: 'exact' })
  if (memoryId) query = query.eq('memoryId', memoryId)
  if (collectionId) query = query.eq('collectionId', collectionId)
  if (parentCommentId) query = query.eq('parentCommentId', parentCommentId)
  else query = query.is('parentCommentId', null)

  query = query.order('createdAt', { ascending: false })
               .range(offset, offset+limit-1)
  const { data, error, count } = await query
  if (error) throw error
  return { comments: data||[], total: count||0 }
}

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
