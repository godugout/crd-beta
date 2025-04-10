
import React, { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@supabase/supabase-js'
import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MemoryCard } from '@/components/memory/MemoryCard'

// Using import.meta.env for Vite projects instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const FeedPage: React.FC = () => {
  const { user } = useUser()
  const [feedType, setFeedType] = useState<'forYou'|'following'|'trending'>('forYou')
  const [memories, setMemories] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadFeed = async (reset=false) => {
    if (!user) return
    if (reset) { setMemories([]); setPage(1); setHasMore(true) }
    setLoading(true)
    try {
      const limit = 10
      const offset = (reset ? 0 : (page-1)*limit)
      let query = supabase
        .from('memories')
        .select(`
          *,
          user:users!memories_userId_fkey(*),
          media:media(*),
          reactions:reactions(*)
        `, { count: 'exact' })
        .eq('visibility','public')
        .range(offset, offset+limit-1)
        .order('createdAt', { ascending: false })

      if (feedType==='following') {
        const { data: following } = await supabase
          .from('follows')
          .select('followedId')
          .eq('followerId', user.id)
        const ids = following?.map(f=>f.followedId) || []
        if (ids.length>0) {
          query = query.in('userId', ids)
        } else {
          setMemories([])
          setHasMore(false)
          setLoading(false)
          return
        }
      }
      const { data, count } = await query
      if (reset) {
        setMemories(data||[])
        setPage(1)
      } else {
        setMemories(prev=>[...prev, ...(data||[])])
      }
      if (data && data.length<limit) setHasMore(false)
      if (count && (page*limit >= count)) setHasMore(false)
    } catch (err) {
      console.error('Error loading feed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    if (!user) return
    loadFeed(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, feedType])

  const handleLoadMore = async () => {
    if (loading || !hasMore) return
    setPage(prev=>prev+1)
    loadFeed(false)
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>You need to sign in to see the feed.</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex gap-2 mb-4">
        <Button variant={feedType==='forYou'?'default':'outline'} onClick={()=>setFeedType('forYou')}>For You</Button>
        <Button variant={feedType==='following'?'default':'outline'} onClick={()=>setFeedType('following')}>Following</Button>
        <Button variant={feedType==='trending'?'default':'outline'} onClick={()=>setFeedType('trending')}>Trending</Button>
      </div>
      <div className="space-y-4">
        {memories.map(mem => (
          <MemoryCard key={mem.id} memory={mem} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
            {loading ? <Loader className="animate-spin"/> : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
