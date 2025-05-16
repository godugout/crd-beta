
import { Reaction, User } from '@/lib/types';
import { StorageService } from '@/lib/services/storageService';
import { UserRole } from '@/lib/enums/userRoles';

/**
 * Convert DB reaction to application Reaction format
 */
export function mapDbReactionToReaction(reaction: any): Reaction {
  return {
    id: reaction.id,
    userId: reaction.userId,
    targetType: reaction.targetType || 'card',
    targetId: reaction.targetId || reaction.cardId, // Fallback for legacy format
    type: reaction.type,
    createdAt: reaction.createdAt,
    updatedAt: reaction.updatedAt || reaction.createdAt, // Default to createdAt if not provided
    // Legacy support
    cardId: reaction.cardId,
    collectionId: reaction.collectionId,
    commentId: reaction.commentId,
    // Add user if available
    user: reaction.user ? {
      id: reaction.user.id,
      email: reaction.user.email,
      displayName: reaction.user.displayName,
      name: reaction.user.name,
      username: reaction.user.username,
      avatarUrl: reaction.user.avatarUrl,
      role: reaction.user.role || UserRole.USER,
      createdAt: reaction.user.createdAt || new Date().toISOString(),
      updatedAt: reaction.user.updatedAt || new Date().toISOString()
    } : undefined
  };
}

/**
 * Get all reactions for a card
 */
export async function getCardReactions(cardId: string): Promise<Reaction[]> {
  try {
    const storageService = new StorageService();
    const reactions = await storageService.getItem(`card_reactions_${cardId}`);
    
    if (!reactions) return [];
    
    return (reactions as any[]).map(reaction => {
      return mapDbReactionToReaction({
        id: reaction.id,
        userId: reaction.userId,
        cardId: reaction.cardId,
        type: reaction.type,
        createdAt: reaction.createdAt,
        updatedAt: reaction.createdAt, // Ensure updatedAt is set
        targetType: 'card',
        targetId: reaction.cardId,
        user: {
          id: reaction.userId,
          email: reaction.email,
          displayName: reaction.displayName,
          name: reaction.name,
          username: reaction.username,
          avatarUrl: reaction.avatarUrl,
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    });
  } catch (error) {
    console.error('Error getting card reactions:', error);
    return [];
  }
}
