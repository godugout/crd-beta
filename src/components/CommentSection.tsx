
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Comment, User } from '@/lib/types';
import { commentRepository } from '@/lib/data';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, SendHorizontal, Reply, Trash, Edit } from 'lucide-react';

interface CommentSectionProps {
  cardId?: string;
  collectionId?: string;
  teamId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ cardId, collectionId, teamId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [repliesByParentId, setRepliesByParentId] = useState<Record<string, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  useEffect(() => {
    fetchTopLevelComments();
  }, [cardId, collectionId, teamId]);
  
  const fetchTopLevelComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await commentRepository.getComments({
        cardId,
        collectionId,
        teamId,
        parentId: null // Only fetch top-level comments
      });
      
      if (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
        return;
      }
      
      if (data) {
        // Ensure we're using a consistent type
        const typedComments = data as Comment[];
        setComments(typedComments);
        typedComments.forEach(comment => {
          if (comment.id) {
            fetchReplies(comment.id);
          }
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchReplies = async (parentId: string) => {
    try {
      const { data, error } = await commentRepository.getComments({
        parentId
      });
      
      if (error) {
        console.error('Error fetching replies:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Handle type consistency
        const typedReplies = data as Comment[];
        setRepliesByParentId(prev => ({
          ...prev,
          [parentId]: typedReplies
        }));
      }
    } catch (err) {
      console.error('Unexpected error fetching replies:', err);
    }
  };
  
  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;
    
    try {
      const commentData: Partial<Comment> = {
        content: newComment.trim(),
        userId: user.id,
        cardId,
        collectionId,
        teamId,
        parentId: replyTo
      };
      
      const { data, error } = await commentRepository.createComment(commentData);
      
      if (error) {
        console.error('Error creating comment:', error);
        toast.error('Failed to post comment');
        return;
      }
      
      if (data) {
        toast.success('Comment posted successfully');
        setNewComment('');
        
        // Ensure type consistency by casting
        const typedComment = data as Comment;
        
        if (replyTo) {
          setRepliesByParentId(prev => ({
            ...prev,
            [replyTo]: [...(prev[replyTo] || []), typedComment]
          }));
          setReplyTo(null);
        } else {
          setComments(prev => [...prev, typedComment]);
        }
      }
    } catch (err) {
      console.error('Unexpected error creating comment:', err);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleEditComment = async (id: string) => {
    if (!editText.trim()) return;
    
    try {
      const { data, error } = await commentRepository.updateComment(id, editText);
      
      if (error) {
        console.error('Error updating comment:', error);
        toast.error('Failed to update comment');
        return;
      }
      
      if (data) {
        toast.success('Comment updated successfully');
        
        // Ensure type consistency by casting
        const typedComment = data as Comment;
        
        if (typedComment.parentId) {
          setRepliesByParentId(prev => ({
            ...prev,
            [typedComment.parentId!]: prev[typedComment.parentId!].map(c => 
              c.id === id ? typedComment : c
            )
          }));
        } else {
          setComments(prev => prev.map(c => 
            c.id === id ? typedComment : c
          ));
        }
        
        setEditingId(null);
        setEditText('');
      }
    } catch (err) {
      console.error('Unexpected error updating comment:', err);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleDeleteComment = async (id: string, parentId?: string) => {
    try {
      const { success, error } = await commentRepository.deleteComment(id);
      
      if (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
        return;
      }
      
      if (success) {
        toast.success('Comment deleted successfully');
        
        if (parentId) {
          setRepliesByParentId(prev => ({
            ...prev,
            [parentId]: prev[parentId].filter(c => c.id !== id)
          }));
        } else {
          setComments(prev => prev.filter(c => c.id !== id));
          setRepliesByParentId(prev => {
            const newReplies = { ...prev };
            delete newReplies[id];
            return newReplies;
          });
        }
      }
    } catch (err) {
      console.error('Unexpected error deleting comment:', err);
      toast.error('An unexpected error occurred');
    }
  };
  
  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };
  
  const renderCommentItem = (comment: Comment, isReply = false) => {
    const isEditing = editingId === comment.id;
    const isOwnComment = user && comment.userId === user.id;
    const replies = repliesByParentId[comment.id] || [];
    
    // Helper function to get display name
    const getDisplayName = (user?: User) => {
      if (!user) return 'Anonymous';
      return user.displayName || user.name || user.username || 'Anonymous';
    };
    
    // Helper function to get avatar initial
    const getAvatarInitial = (user?: User) => {
      if (!user) return '?';
      if (user.displayName) return user.displayName.charAt(0);
      if (user.name) return user.name.charAt(0);
      return user.email?.charAt(0) || '?';
    };
    
    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-2' : 'mt-4'}`}>
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.user?.avatarUrl} alt={getDisplayName(comment.user)} />
            <AvatarFallback>
              {getAvatarInitial(comment.user)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">
                  {getDisplayName(comment.user)}
                </span>
                <span className="text-muted-foreground text-xs ml-2">
                  {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              {isOwnComment && !isEditing && (
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => startEditing(comment)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive" 
                    onClick={() => handleDeleteComment(comment.id, comment.parentId)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="mt-1">
                <Textarea 
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit your comment..."
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm mt-1">{comment.content}</p>
                
                <div className="mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs" 
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  >
                    <Reply className="h-3.5 w-3.5 mr-1" />
                    Reply
                  </Button>
                </div>
                
                {replyTo === comment.id && (
                  <div className="mt-2 flex gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a reply..."
                      className="min-h-[80px] text-sm"
                    />
                    <Button size="icon" onClick={handleSubmitComment} className="self-end">
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {replies.length > 0 && (
          <div className="replies mt-2">
            {replies.map(reply => renderCommentItem(reply, true))}
          </div>
        )}
        
        {!isReply && <Separator className="my-4" />}
      </div>
    );
  };
  
  return (
    <div className="bg-background p-4 rounded-lg border">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-lg font-medium">Comments</h2>
      </div>
      
      {user ? (
        <div className="flex gap-3 items-start">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.displayName || user.name} />
            <AvatarFallback>
              {user.displayName?.charAt(0) || user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[80px]"
            />
            <Button 
              size="icon" 
              onClick={handleSubmitComment} 
              disabled={!newComment.trim()}
              className="self-end"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-muted rounded-md">
          <p>Please sign in to leave a comment</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="mt-6">
          {comments.map(comment => renderCommentItem(comment))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
