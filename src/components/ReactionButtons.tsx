
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/auth';
import { Reaction } from '@/lib/types';
import { reactionRepository } from '@/lib/data';
import { toast } from 'sonner';
import { Heart, ThumbsUp, MessageCircle, Star, Award, Share } from 'lucide-react';

interface ReactionButtonsProps {
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  initialReactions?: Reaction[];
  onShare?: () => void;
  showComments?: boolean;
  onShowComments?: () => void;
  commentsCount?: number;
}

type ReactionType = 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';

interface ReactionCount {
  type: ReactionType;
  count: number;
  userReacted: boolean;
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  cardId,
  collectionId,
  commentId,
  initialReactions = [],
  onShare,
  showComments,
  onShowComments,
  commentsCount = 0
}) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  useEffect(() => {
    if (cardId || collectionId || commentId) {
      fetchReactions();
    }
  }, [cardId, collectionId, commentId]);
  
  const fetchReactions = async () => {
    if (!cardId && !collectionId && !commentId) return;
    
    setIsLoading(true);
    try {
      let result;
      
      if (cardId) {
        // Use getReactions with cardId parameter instead of getReactionsByCardId
        result = await reactionRepository.getReactions({ 
          cardId, 
          collectionId: undefined, 
          commentId: undefined 
        });
      } else if (collectionId) {
        result = await reactionRepository.getReactions({ 
          cardId: undefined, 
          collectionId, 
          commentId: undefined 
        });
      } else if (commentId) {
        result = await reactionRepository.getReactions({ 
          cardId: undefined, 
          collectionId: undefined, 
          commentId 
        });
      }
      
      if (result && result.data) {
        setReactions(result.data);
      }
    } catch (err) {
      console.error('Unexpected error fetching reactions:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getReactionCounts = (): ReactionCount[] => {
    const counts: Record<ReactionType, { count: number; userReacted: boolean }> = {
      like: { count: 0, userReacted: false },
      love: { count: 0, userReacted: false },
      wow: { count: 0, userReacted: false },
      haha: { count: 0, userReacted: false },
      sad: { count: 0, userReacted: false },
      angry: { count: 0, userReacted: false }
    };
    
    reactions.forEach(reaction => {
      if (reaction.type in counts) {
        counts[reaction.type as ReactionType].count++;
        if (user?.id && reaction.userId === user.id) {
          counts[reaction.type as ReactionType].userReacted = true;
        }
      }
    });
    
    return Object.entries(counts)
      .map(([type, { count, userReacted }]) => ({ 
        type: type as ReactionType, 
        count, 
        userReacted 
      }))
      .filter(item => item.count > 0 || item.type === 'like' || item.type === 'love');
  };
  
  const handleReaction = async (type: ReactionType) => {
    if (!user?.id) {
      toast.error('You must be logged in to react');
      return;
    }
    
    try {
      const userReaction = reactions.find(r => r.userId === user.id);
      const isSameType = userReaction?.type === type;
      
      if (userReaction && isSameType) {
        const success = await reactionRepository.deleteReaction(userReaction.id);
        
        if (!success) {
          toast.error('Failed to update reaction');
          return;
        }
        
        setReactions(prev => prev.filter(r => r.userId !== user.id));
      } else {
        // Use createReaction instead of addReaction
        const reactionData = {
          userId: user.id,
          cardId,
          collectionId,
          commentId,
          type,
          targetType: cardId ? 'card' : collectionId ? 'collection' : 'comment',
          targetId: cardId || collectionId || commentId || '',
        };
        
        const data = await reactionRepository.createReaction(reactionData);
        
        if (!data) {
          toast.error('Failed to update reaction');
          return;
        }
        
        if (userReaction) {
          setReactions(prev => 
            prev.map(r => r.userId === user.id ? data : r)
          );
        } else {
          setReactions(prev => [...prev, data]);
        }
      }
    } catch (err) {
      console.error('Unexpected error handling reaction:', err);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      setIsSharing(true);
      
      if (navigator.share) {
        navigator.share({
          title: 'Check out this card',
          url: window.location.href,
        })
          .then(() => toast.success('Shared successfully'))
          .catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Error sharing:', error);
              toast.error('Failed to share');
            }
          })
          .finally(() => setIsSharing(false));
      } else {
        navigator.clipboard.writeText(window.location.href)
          .then(() => toast.success('Link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'))
          .finally(() => setIsSharing(false));
      }
    }
  };
  
  const reactionCounts = getReactionCounts();
  const totalReactions = reactions.length;
  const userReactionType = user?.id 
    ? reactions.find(r => r.userId === user.id)?.type 
    : undefined;
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={userReactionType === 'like' ? 'default' : 'outline'} 
              size="sm" 
              className="gap-1.5"
              onClick={() => handleReaction('like')}
            >
              <ThumbsUp className={`h-4 w-4 ${userReactionType === 'like' ? 'fill-current' : ''}`} />
              {reactionCounts.find(r => r.type === 'like')?.count || ''}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Like</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={userReactionType === 'love' ? 'default' : 'outline'} 
              size="sm" 
              className={`gap-1.5 ${userReactionType === 'love' ? 'bg-pink-500 hover:bg-pink-600 text-white' : ''}`}
              onClick={() => handleReaction('love')}
            >
              <Heart className={`h-4 w-4 ${userReactionType === 'love' ? 'fill-current' : ''}`} />
              {reactionCounts.find(r => r.type === 'love')?.count || ''}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Love</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={userReactionType === 'wow' ? 'default' : 'outline'} 
              size="sm" 
              className={`gap-1.5 ${userReactionType === 'wow' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
              onClick={() => handleReaction('wow')}
            >
              <Star className={`h-4 w-4 ${userReactionType === 'wow' ? 'fill-current' : ''}`} />
              {reactionCounts.find(r => r.type === 'wow')?.count || ''}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Wow</TooltipContent>
        </Tooltip>
        
        {showComments !== undefined && onShowComments && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showComments ? 'default' : 'outline'} 
                size="sm" 
                className="gap-1.5"
                onClick={onShowComments}
              >
                <MessageCircle className="h-4 w-4" />
                {commentsCount > 0 ? commentsCount : ''}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              disabled={isSharing}
              className="gap-1.5"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {totalReactions > 0 && (
        <div className="text-sm text-muted-foreground ml-1">
          {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ReactionButtons;
