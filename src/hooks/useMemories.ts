
// hooks/useMemories.ts
import { useState, useEffect } from 'react'
import { getMemoriesByUserId, getPublicMemories, Memory } from '@/repositories/memoryRepository'

interface UseMemoriesOptions {
  userId?: string
  teamId?: string
  tags?: string[]
  searchTerm?: string
  visibility?: 'public' | 'private' | 'shared' | 'all'
  limit?: number
}

export const useMemories = (opts: UseMemoriesOptions={}) => {
  const { userId, teamId, tags, searchTerm, visibility='all', limit=20 } = opts

  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error|null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchData = async (pageNumber = 1) => {
    setLoading(true)
    try {
      let result
      if (userId) {
        result = await getMemoriesByUserId(userId, {
          page: pageNumber,
          limit,
          visibility,
          teamId
        })
      } else {
        result = await getPublicMemories({
          page: pageNumber,
          limit,
          teamId,
          tags,
          searchTerm
        })
      }
      if (pageNumber === 1) {
        setMemories(result.data)
      } else {
        setMemories(prev => [...prev, ...result.data])
      }
      setTotal(result.total)
      setHasMore(result.data.length === limit && (pageNumber*limit < result.total))
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // reset
    setPage(1)
    setMemories([])
    setHasMore(true)
    fetchData(1)
  }, [userId, teamId, tags?.join(','), searchTerm, visibility, limit])

  const loadMore = () => {
    if (!loading && hasMore) {
      const next = page+1
      setPage(next)
      fetchData(next)
    }
  }

  return { 
    memories, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    total 
  }
}
