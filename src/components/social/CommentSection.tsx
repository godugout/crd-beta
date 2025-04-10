
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/useUser'
import { formatDistanceToNow } from 'date-fns'

// Comment type definition
interface Comment {
  id: string
  text: string
  userId: string
  username: string
  userAvatar?: string
  createdAt: string
  parentId?: string
}

interface CommentSectionProps {
  itemId: string
  comments: Comment[]
  onAddComment: (itemId: string, text: string, parentId?: string) => Promise<void>
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  itemId,
  comments,
  onAddComment
}) => {
  const { user } = useUser()
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    
    setIsSubmitting(true)
    try {
      await onAddComment(itemId, commentText, replyTo || undefined)
      setCommentText('')
      setReplyTo(null)
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Organize comments into threads
  const rootComments = comments.filter(c => !c.parentId)
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId)
  
  return (
    <div className="space-y-4">
      {/* Comment form */}
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Avatar>
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-between items-center">
              {replyTo && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setReplyTo(null)}
                >
                  Cancel Reply
                </Button>
              )}
              <Button type="submit" disabled={!commentText.trim() || isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </form>
      )}
      
      {/* Comments list */}
      <div className="space-y-4">
        {rootComments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
        ) : (
          rootComments.map(comment => (
            <CommentThread 
              key={comment.id} 
              comment={comment}
              replies={getReplies(comment.id)}
              onReply={(commentId) => setReplyTo(commentId)}
            />
          ))
        )}
      </div>
    </div>
  )
}

interface CommentThreadProps {
  comment: Comment
  replies: Comment[]
  onReply: (commentId: string) => void
}

const CommentThread: React.FC<CommentThreadProps> = ({ comment, replies, onReply }) => {
  return (
    <div className="space-y-3">
      {/* Parent comment */}
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={comment.userAvatar} />
          <AvatarFallback>{comment.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="font-medium">{comment.username}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="mt-1">{comment.text}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-1 text-xs" 
            onClick={() => onReply(comment.id)}
          >
            Reply
          </Button>
        </div>
      </div>
      
      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-12 space-y-3">
          {replies.map(reply => (
            <div key={reply.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.userAvatar} />
                <AvatarFallback>{reply.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{reply.username}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{reply.text}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1 text-xs" 
                  onClick={() => onReply(comment.id)}
                >
                  Reply
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
