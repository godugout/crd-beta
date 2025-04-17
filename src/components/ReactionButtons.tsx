
import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { Reaction } from '@/lib/types';
import { toast } from 'sonner';

interface ReactionButtonsProps {
  targetId: string;
  targetType: 'card' | 'comment' | 'collection';
  initialReactions?: Reaction[];
  onReactionChange?: (reactions: Reaction[]) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'expanded';
  // Legacy support for older components
  cardId?: string;
  showComments?: boolean;
  onShowComments?: () => void;
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  targetId,
  targetType,
  initialReactions = [],
  onReactionChange,
  size = 'md',
  variant = 'default',
  cardId, // For backward compatibility
  showComments,
  onShowComments
}) => {
  // Ensure we have a valid targetId (use cardId for backward compatibility)
  const effectiveTargetId = targetId || cardId || '';
  const effectiveTargetType = targetType || 'card';

  const { user, isAuthenticated } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state when initialReactions changes
  useEffect(() => {
    setReactions(initialReactions);
  }, [initialReactions]);
  
  // Get counts for each reaction type
  const getLikeCount = () => reactions.filter(r => r.type === 'like').length;
  const getLoveCount = () => reactions.filter(r => r.type === 'love').length;
  const getWowCount = () => reactions.filter(r => r.type === 'wow').length;
  
  // Check if current user has reacted
  const hasUserLiked = () => {
    if (!user) return false;
    return reactions.some(r => r.type === 'like' && r.userId === user.id);
  };
  
  const hasUserLoved = () => {
    if (!user) return false;
    return reactions.some(r => r.type === 'love' && r.userId === user.id);
  };
  
  const hasUserWowed = () => {
    if (!user) return false;
    return reactions.some(r => r.type === 'wow' && r.userId === user.id);
  };
  
  // Handle reaction clicks
  const handleReaction = async (type: 'like' | 'love' | 'wow') => {
    if (!isAuthenticated) {
      toast.error('Please sign in to react');
      return;
    }
    
    if (!user) {
      toast.error('User information not available');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userId = user.id;
      const existingReaction = reactions.find(
        r => r.userId === userId && r.type === type
      );
      
      if (existingReaction) {
        // Remove reaction
        const updatedReactions = reactions.filter(r => !(r.userId === userId && r.type === type));
        setReactions(updatedReactions);
        onReactionChange?.(updatedReactions);
        
        // In a real implementation, you'd call an API to delete the reaction
        // await deleteReaction(existingReaction.id);
        console.log('Reaction removed:', type);
      } else {
        // Add reaction
        const newReaction: Reaction = {
          id: `reaction-${Date.now()}`,
          userId,
          type,
          targetType: effectiveTargetType,
          targetId: effectiveTargetId,
          createdAt: new Date().toISOString()
        };
        
        // In a real implementation, you'd call an API to create the reaction
        // const response = await createReaction({ ...newReaction });
        console.log('Reaction added:', type);
        
        // Successfully created, update local state
        const newReactions = [...reactions, newReaction];
        setReactions(newReactions);
        onReactionChange?.(newReactions);
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Failed to update reaction');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Size classes
  const buttonSize = size === 'sm' ? 'h-8 px-2 text-xs' : 
                    size === 'lg' ? 'h-12 px-5 text-lg' : 
                    'h-10 px-3 text-sm';
  
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  // For backward compatibility with components that use showComments
  const renderCommentsButton = () => {
    if (showComments !== undefined && onShowComments) {
      return (
        <Button
          variant="ghost"
          className={buttonSize}
          onClick={onShowComments}
        >
          <MessageCircle size={iconSize} className="mr-1" />
          <span>Comments</span>
        </Button>
      );
    }
    return null;
  };
  
  if (variant === 'minimal') {
    return (
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          disabled={isSubmitting}
          onClick={() => handleReaction('like')}
        >
          <ThumbsUp 
            size={iconSize} 
            className={hasUserLiked() ? 'text-blue-500 fill-blue-500' : ''} 
          />
        </Button>
        <span className="text-sm text-gray-500">{getLikeCount()}</span>
        {renderCommentsButton()}
      </div>
    );
  }
  
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={hasUserLiked() ? "default" : "ghost"} 
              className={`${buttonSize} ${hasUserLiked() ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
              onClick={() => handleReaction('like')}
              disabled={isSubmitting}
            >
              <ThumbsUp size={iconSize} className="mr-1" />
              <span>{getLikeCount()}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasUserLiked() ? 'Unlike' : 'Like'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={hasUserLoved() ? "default" : "ghost"} 
              className={`${buttonSize} ${hasUserLoved() ? 'bg-red-500 hover:bg-red-600' : ''}`}
              onClick={() => handleReaction('love')}
              disabled={isSubmitting}
            >
              <Heart size={iconSize} className="mr-1" />
              <span>{getLoveCount()}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasUserLoved() ? 'Remove Love' : 'Love'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {variant === 'expanded' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={hasUserWowed() ? "default" : "ghost"} 
                className={`${buttonSize} ${hasUserWowed() ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                onClick={() => handleReaction('wow')}
                disabled={isSubmitting}
              >
                <Star size={iconSize} className="mr-1" />
                <span>{getWowCount()}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasUserWowed() ? 'Remove Wow' : 'Wow'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {renderCommentsButton()}
    </div>
  );
};

export default ReactionButtons;
