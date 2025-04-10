
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
  
  // Initialize reaction counts with all possible reaction types
  const reactionCounts: Record<ReactionType, number> = {
    like: 0, 
    love: 0, 
    celebrate: 0, 
    insightful: 0, 
    baseball: 0
  }
  
  // Count reactions by type
  (data || []).forEach(r => {
    if (r.type && typeof r.type === 'string') {
      // Validate that the reaction type is one we recognize
      const reactionType = r.type as ReactionType;
      if (reactionType in reactionCounts) {
        reactionCounts[reactionType] += 1;
      }
    }
  })
  
  return { reactions: data || [], counts: reactionCounts }
}
