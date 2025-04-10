
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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
