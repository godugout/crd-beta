
import { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';
import { commentRepository } from '@/lib/data';
import { toast } from 'sonner';
import { adaptComment } from '@/lib/utils/typeAdapters';
import { useAuth } from '@/context/auth';

interface UseCommentsProps {
  cardId?: string;
  collectionId?: string;
  teamId?: string;
}

export function useComments({ cardId, collectionId, teamId }: UseCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [repliesByParentId, setRepliesByParentId] = useState<Record<string, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchComments = async (parentId: string | null = null) => {
    setIsLoading(true);
    try {
      const { data, error } = await commentRepository.getComments({
        cardId,
        collectionId,
        teamId,
        parentId
      });
      
      if (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
        return [];
      }
      
      if (data) {
        const typedComments: Comment[] = data.map(c => adaptComment(c));
        
        if (parentId === null) {
          setComments(typedComments);
          
          // Fetch replies for each top-level comment
          typedComments.forEach(comment => {
            if (comment.id) {
              fetchReplies(comment.id);
            }
          });
        }
        
        return typedComments;
      }
      
      return [];
    } catch (err) {
      console.error('Unexpected error fetching comments:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchReplies = async (parentId: string) => {
    try {
      const replies = await fetchComments(parentId);
      
      if (replies.length > 0) {
        setRepliesByParentId(prev => ({
          ...prev,
          [parentId]: replies
        }));
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
    }
  };
  
  const addComment = async (content: string, parentId?: string) => {
    if (!user || !content.trim()) {
      toast.error('You must be logged in and provide comment content');
      return null;
    }
    
    try {
      const commentData = {
        content: content.trim(),
        userId: user.id,
        authorId: user.id, // Using both for compatibility
        cardId,
        collectionId,
        teamId,
        parentId
      };
      
      const { data, error } = await commentRepository.createComment(commentData);
      
      if (error) {
        console.error('Error creating comment:', error);
        toast.error('Failed to post comment');
        return null;
      }
      
      if (data) {
        toast.success('Comment posted successfully');
        
        const typedComment = adaptComment({
          ...data,
          user: user
        });
        
        if (parentId) {
          setRepliesByParentId(prev => ({
            ...prev,
            [parentId]: [...(prev[parentId] || []), typedComment]
          }));
        } else {
          setComments(prev => [...prev, typedComment]);
        }
        
        return typedComment;
      }
      
      return null;
    } catch (err) {
      console.error('Unexpected error creating comment:', err);
      toast.error('An unexpected error occurred');
      return null;
    }
  };
  
  const updateComment = async (id: string, content: string) => {
    if (!content.trim()) return false;
    
    try {
      const { data, error } = await commentRepository.updateComment(id, content);
      
      if (error) {
        console.error('Error updating comment:', error);
        toast.error('Failed to update comment');
        return false;
      }
      
      if (data) {
        toast.success('Comment updated successfully');
        
        const typedComment = adaptComment(data);
        
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
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Unexpected error updating comment:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };
  
  const deleteComment = async (id: string, parentId?: string) => {
    try {
      const { success, error } = await commentRepository.deleteComment(id);
      
      if (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
        return false;
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
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Unexpected error deleting comment:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };
  
  // Initial fetch of comments
  useEffect(() => {
    fetchComments();
  }, [cardId, collectionId, teamId]);
  
  return {
    comments,
    repliesByParentId,
    isLoading,
    addComment,
    updateComment,
    deleteComment,
    refreshComments: () => fetchComments()
  };
}

export default useComments;
