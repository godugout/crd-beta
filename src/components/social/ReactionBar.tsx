
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ThumbsUp, Heart, Laugh, Angry, Frown, Plus, MessageCircle } from 'lucide-react'
import { useUser } from '@/hooks/useUser'

// Define reaction types
const REACTIONS = {
  like: { icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
  love: { icon: Heart, label: 'Love', color: 'text-red-500' },
  laugh: { icon: Laugh, label: 'Laugh', color: 'text-yellow-500' },
  angry: { icon: Angry, label: 'Angry', color: 'text-orange-500' },
  sad: { icon: Frown, label: 'Sad', color: 'text-purple-500' }
}

type ReactionType = keyof typeof REACTIONS
type ReactionsData = Record<ReactionType, string[]> // userId[]

interface ReactionBarProps {
  memoryId: string
  initialReactions?: Partial<Record<string, any>>
  onReactionChange?: (memoryId: string, reaction: ReactionType | null) => void
  onComment?: () => void
  commentCount?: number
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
  memoryId,
  initialReactions = {},
  onReactionChange,
  onComment,
  commentCount = 0
}) => {
  const { user } = useUser()
  const [reactions, setReactions] = useState<Partial<ReactionsData>>(initialReactions as any || {})
  
  // Find if the current user has reacted
  const getUserReaction = (): ReactionType | null => {
    if (!user?.id) return null
    
    for (const [type, userIds] of Object.entries(reactions)) {
      if (userIds?.includes(user.id)) {
        return type as ReactionType
      }
    }
    return null
  }
  
  const userReaction = getUserReaction()
  
  const handleReaction = (reaction: ReactionType) => {
    if (!user?.id) return
    
    // If already reacted with the same reaction, remove it
    if (userReaction === reaction) {
      const newReactions = { ...reactions }
      newReactions[reaction] = newReactions[reaction]?.filter(id => id !== user.id) || []
      setReactions(newReactions)
      if (onReactionChange) onReactionChange(memoryId, null)
      return
    }
    
    // If reacted with a different reaction, remove previous and add new
    const newReactions = { ...reactions }
    
    // Remove previous reaction if any
    if (userReaction) {
      newReactions[userReaction] = newReactions[userReaction]?.filter(id => id !== user.id) || []
    }
    
    // Add new reaction
    newReactions[reaction] = [...(newReactions[reaction] || []), user.id]
    setReactions(newReactions)
    if (onReactionChange) onReactionChange(memoryId, reaction)
  }
  
  // Get total reaction count
  const getTotalReactions = () => {
    return Object.values(reactions).reduce((sum, users) => sum + (users?.length || 0), 0)
  }
  
  // Primary reaction to show (most common one)
  const getPrimaryReaction = (): ReactionType | null => {
    let max = 0
    let primary: ReactionType | null = null
    
    for (const [type, userIds] of Object.entries(reactions)) {
      if (userIds && userIds.length > max) {
        max = userIds.length
        primary = type as ReactionType
      }
    }
    
    return primary
  }
  
  const primaryReaction = getPrimaryReaction()
  const totalReactions = getTotalReactions()
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
              {userReaction ? (
                <>
                  {React.createElement(REACTIONS[userReaction].icon, { 
                    size: 16,
                    className: REACTIONS[userReaction].color
                  })}
                  <span>{REACTIONS[userReaction].label}</span>
                </>
              ) : (
                <>
                  {primaryReaction ? (
                    React.createElement(REACTIONS[primaryReaction].icon, { 
                      size: 16,
                      className: REACTIONS[primaryReaction].color
                    })
                  ) : (
                    <ThumbsUp size={16} />
                  )}
                  <span>React</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex p-2 w-auto">
            {Object.entries(REACTIONS).map(([key, { icon, color }]) => (
              <Button 
                key={key}
                variant="ghost"
                size="icon"
                onClick={() => handleReaction(key as ReactionType)}
                className={`hover:${color}`}
              >
                {React.createElement(icon, { 
                  size: 20,
                  className: userReaction === key ? color : ''
                })}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
        
        {onComment && (
          <Button variant="ghost" size="sm" onClick={onComment} className="flex items-center gap-1.5">
            <MessageCircle size={16} />
            <span>Comment</span>
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {totalReactions > 0 && (
          <div className="flex items-center gap-1">
            {primaryReaction && (
              React.createElement(REACTIONS[primaryReaction].icon, { 
                size: 14,
                className: REACTIONS[primaryReaction].color
              })
            )}
            <span>{totalReactions}</span>
          </div>
        )}
        
        {commentCount > 0 && (
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{commentCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}
