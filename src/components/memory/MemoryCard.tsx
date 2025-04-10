
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ReactionBar } from '@/components/social/ReactionBar'
import { formatDistanceToNow } from 'date-fns'
import { MediaGallery } from '@/components/media/MediaGallery'

interface MemoryCardProps {
  memory: {
    id: string
    title: string
    description?: string
    createdAt: string
    userId: string
    user?: {
      username: string
      profileImage?: string
    }
    media?: Array<{
      id: string
      type: 'image' | 'video' | 'audio'
      url: string
      thumbnailUrl: string
      originalFilename: string
    }>
    reactions?: Record<string, any>
  }
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => {
  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={memory.user?.profileImage} />
            <AvatarFallback>
              {memory.user?.username ? memory.user.username.substring(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{memory.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {memory.user?.username} • {formatDate(memory.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {memory.description && <p className="mb-4">{memory.description}</p>}
        
        {memory.media && memory.media.length > 0 && (
          <MediaGallery media={memory.media} />
        )}
      </CardContent>
      
      <CardFooter>
        <ReactionBar 
          memoryId={memory.id}
          initialReactions={memory.reactions}
        />
      </CardFooter>
    </Card>
  )
}
