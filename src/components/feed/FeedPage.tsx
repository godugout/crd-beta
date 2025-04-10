
import React, { useState } from 'react'
import { useMemories } from '@/hooks/useMemories'
import { MediaGallery } from '@/components/media/MediaGallery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, Filter, Share2 } from 'lucide-react'
import { ReactionBar } from '@/components/social/ReactionBar'

interface FeedPageProps {
  userId?: string
  teamId?: string
  onCreateMemory?: () => void
}

export const FeedPage: React.FC<FeedPageProps> = ({ 
  userId,
  teamId,
  onCreateMemory
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'teams'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<string>('recent')

  // Get the visibility based on active tab
  const getVisibility = () => {
    switch (activeTab) {
      case 'friends':
        return 'shared'
      case 'teams':
        return teamId ? 'all' : 'public'
      default:
        return 'public'
    }
  }

  const {
    memories,
    loading,
    error,
    hasMore,
    loadMore
  } = useMemories({
    userId,
    teamId: activeTab === 'teams' ? teamId : undefined,
    searchTerm: searchTerm || undefined,
    visibility: getVisibility()
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The useMemories hook will refetch when searchTerm changes
  }

  const handleShare = (memoryId: string) => {
    // Implement sharing functionality
    console.log('Share memory:', memoryId)
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Memory Feed</h1>
        {onCreateMemory && (
          <Button onClick={onCreateMemory}>Create Memory</Button>
        )}
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400"/>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Memories</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {loading && <p className="text-center py-10">Loading memories...</p>}
          {error && <p className="text-center py-10 text-red-500">Error loading memories</p>}
          {!loading && memories.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No memories found</p>
              {onCreateMemory && (
                <Button onClick={onCreateMemory}>Create Your First Memory</Button>
              )}
            </div>
          )}
          <div className="space-y-6">
            {memories.map(memory => (
              <div key={memory.id} className="border rounded-lg overflow-hidden bg-white">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{memory.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(memory.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleShare(memory.id)}>
                      <Share2 size={18}/>
                    </Button>
                  </div>
                  {memory.description && (
                    <p className="mt-2">{memory.description}</p>
                  )}
                  {memory.tags && memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {memory.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {memory.media && memory.media.length > 0 && (
                  <MediaGallery media={memory.media} onShare={() => handleShare(memory.id)} />
                )}
                <div className="p-4 border-t">
                  <ReactionBar 
                    itemId={memory.id} 
                    initialReactions={memory.reactions || {}}
                    onReactionChange={() => {}} 
                  />
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={loadMore}>Load More</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="friends" className="space-y-6">
          {/* Content similar to "all" tab but filtered for friends */}
          {!loading && memories.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No memories from friends</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="teams" className="space-y-6">
          {/* Content similar to "all" tab but filtered for teams */}
          {!loading && memories.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No team memories found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FeedPage
