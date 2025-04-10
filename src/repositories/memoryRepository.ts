
// repositories/memoryRepository.ts
import { createClient } from '@supabase/supabase-js'
import { memoryCache } from '@/lib/memoryCache'

// Replace process.env with import.meta.env for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Memory {
  id: string
  userId: string
  title: string
  description: string | null
  teamId: string | null
  gameId: string | null
  location: {
    lat?: number
    lng?: number
    name?: string
    stadiumSection?: string
  } | null
  visibility: 'public' | 'private' | 'shared'
  createdAt: string
  tags: string[]
  metadata: Record<string, any>
}

export interface CreateMemoryParams {
  userId: string
  title: string
  description?: string
  teamId?: string
  gameId?: string
  location?: {
    lat?: number
    lng?: number
    name?: string
    stadiumSection?: string
  }
  visibility?: 'public' | 'private' | 'shared'
  tags?: string[]
  metadata?: Record<string, any>
}

export interface UpdateMemoryParams {
  id: string
  title?: string
  description?: string
  teamId?: string
  gameId?: string
  location?: {
    lat?: number
    lng?: number
    name?: string
    stadiumSection?: string
  }
  visibility?: 'public' | 'private' | 'shared'
  tags?: string[]
  metadata?: Record<string, any>
}

// Create a new Memory
export const createMemory = async (params: CreateMemoryParams): Promise<Memory> => {
  const { data, error } = await supabase
    .from('memories')
    .insert({
      userId: params.userId,
      title: params.title,
      description: params.description || null,
      teamId: params.teamId || null,
      gameId: params.gameId || null,
      location: params.location || null,
      visibility: params.visibility || 'private',
      tags: params.tags || [],
      metadata: params.metadata || {}
    })
    .select()
    .single()
  if (error) throw error

  // Clear caches for user's memories / public
  memoryCache.delete(`memories:user:${params.userId}`)
  memoryCache.delete(`memories:public`)
  return data
}

// Fetch one Memory
export const getMemoryById = async (id: string): Promise<Memory | null> => {
  const cacheKey = `memory:${id}`
  return memoryCache.getOrFetch<Memory|null>(cacheKey, async () => {
    const { data, error } = await supabase
      .from('memories')
      .select(`*, media(*)`)
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }, 60)
}

// Update an existing Memory
export const updateMemory = async (params: UpdateMemoryParams): Promise<Memory> => {
  const updates: Partial<Memory> = {}
  if (params.title !== undefined) updates.title = params.title
  if (params.description !== undefined) updates.description = params.description
  if (params.teamId !== undefined) updates.teamId = params.teamId
  if (params.gameId !== undefined) updates.gameId = params.gameId
  if (params.location !== undefined) updates.location = params.location
  if (params.visibility !== undefined) updates.visibility = params.visibility
  if (params.tags !== undefined) updates.tags = params.tags
  if (params.metadata !== undefined) updates.metadata = params.metadata

  const { data, error } = await supabase
    .from('memories')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()
  if (error) throw error

  // Clear relevant caches
  memoryCache.delete(`memory:${params.id}`)
  const { data: mem } = await supabase
    .from('memories')
    .select('userId, visibility')
    .eq('id', params.id)
    .single()
  if (mem) {
    memoryCache.delete(`memories:user:${mem.userId}`)
    if (mem.visibility === 'public') {
      memoryCache.delete(`memories:public`)
    }
  }
  return data
}

// Delete a Memory
export const deleteMemory = async (id: string) => {
  const { data: mem } = await supabase
    .from('memories')
    .select('userId, visibility')
    .eq('id', id)
    .single()

  // Delete associated media
  const { data: mediaItems } = await supabase
    .from('media')
    .select('*')
    .eq('memoryId', id)

  if (mediaItems) {
    const filePaths: string[] = []
    for (const m of mediaItems) {
      const parts = m.url.split('/media/')
      if (parts.length > 1) filePaths.push(parts[1])
      if (m.thumbnailUrl && m.thumbnailUrl !== m.url) {
        const thumbParts = m.thumbnailUrl.split('/media/')
        if (thumbParts.length > 1) filePaths.push(thumbParts[1])
      }
    }
    if (filePaths.length > 0) {
      await supabase.storage.from('media').remove(filePaths)
    }
    await supabase.from('media').delete().eq('memoryId', id)
  }

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)
  if (error) throw error

  // Clear caches
  memoryCache.delete(`memory:${id}`)
  if (mem) {
    memoryCache.delete(`memories:user:${mem.userId}`)
    if (mem.visibility === 'public') {
      memoryCache.delete(`memories:public`)
    }
  }
}

// Paginated fetch: memories by user
export const getMemoriesByUserId = async (
  userId: string,
  { page = 1, limit = 20, visibility = 'all', teamId }: 
  { page?: number; limit?: number; visibility?: string; teamId?: string }
) => {
  const cacheKey = `memories:user:${userId}:page:${page}:limit:${limit}:visibility:${visibility}:team:${teamId||'all'}`
  return memoryCache.getOrFetch(cacheKey, async () => {
    const offset = (page - 1) * limit
    let query = supabase
      .from('memories')
      .select('*, media!media_memoryId_fkey(*)', { count: 'exact' })
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (visibility !== 'all') {
      query = query.eq('visibility', visibility)
    }
    if (teamId) {
      query = query.eq('teamId', teamId)
    }
    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0 }
  }, 120)
}

// Paginated fetch: all public
export const getPublicMemories = async (
  { page = 1, limit = 20, teamId, tags, searchTerm }:
  { page?: number; limit?: number; teamId?: string; tags?: string[]; searchTerm?: string }
) => {
  const cacheKey = `memories:public:page:${page}:limit:${limit}:team:${teamId||'all'}:tags:${tags?.join(',')||'none'}:search:${searchTerm||'none'}`
  return memoryCache.getOrFetch(cacheKey, async () => {
    const offset = (page - 1) * limit
    let query = supabase
      .from('memories')
      .select('*, users!memories_userId_fkey(*), media!media_memoryId_fkey(*)', { count: 'exact' })
      .eq('visibility', 'public')
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)
    if (teamId) {
      query = query.eq('teamId', teamId)
    }
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }
    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0 }
  }, 180)
}
