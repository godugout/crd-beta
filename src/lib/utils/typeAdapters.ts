
import { Card, Collection, User, Comment, Reaction, Team, Deck } from '../types';

/**
 * Adapts legacy card data to the current Card interface
 */
export function adaptCard(card: any): Card {
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    imageUrl: card.image_url || card.imageUrl,
    thumbnailUrl: card.thumbnail_url || card.thumbnailUrl,
    createdAt: card.created_at || card.createdAt,
    updatedAt: card.updated_at || card.updatedAt,
    userId: card.user_id || card.userId,
    teamId: card.team_id || card.teamId,
    tags: card.tags || [],
    isPublic: card.is_public ?? card.isPublic ?? true,
    designMetadata: card.design_metadata || card.designMetadata,
    effects: card.effects || []
  };
}

/**
 * Adapts legacy collection data to the current Collection interface
 */
export function adaptCollection(collection: any): Collection {
  return {
    id: collection.id,
    title: collection.title || collection.name,
    name: collection.name || collection.title,
    description: collection.description,
    coverImageUrl: collection.cover_image_url || collection.coverImageUrl,
    ownerId: collection.owner_id || collection.ownerId,
    teamId: collection.team_id || collection.teamId,
    visibility: collection.visibility || 'public',
    allowComments: collection.allow_comments ?? collection.allowComments ?? true,
    createdAt: collection.created_at || collection.createdAt,
    updatedAt: collection.updated_at || collection.updatedAt,
    cards: Array.isArray(collection.cards) ? collection.cards.map(adaptCard) : undefined,
    featured: collection.featured
  };
}

/**
 * Adapts legacy user data to the current User interface
 */
export function adaptUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name || user.full_name || user.displayName,
    displayName: user.displayName || user.display_name || user.name,
    username: user.username || user.user_name,
    avatarUrl: user.avatarUrl || user.avatar_url,
    role: user.role,
    createdAt: user.created_at || user.createdAt || new Date().toISOString(),
    updatedAt: user.updated_at || user.updatedAt || new Date().toISOString(),
    profile: user.profile
  };
}

/**
 * Adapts legacy comment data to the current Comment interface
 */
export function adaptComment(comment: any): Comment {
  return {
    id: comment.id,
    content: comment.content,
    userId: comment.user_id || comment.userId || comment.authorId,
    authorId: comment.author_id || comment.authorId || comment.userId,
    cardId: comment.card_id || comment.cardId,
    collectionId: comment.collection_id || comment.collectionId,
    teamId: comment.team_id || comment.teamId,
    parentId: comment.parent_id || comment.parentId,
    createdAt: comment.created_at || comment.createdAt,
    updatedAt: comment.updated_at || comment.updatedAt,
    user: comment.user ? adaptUser(comment.user) : undefined,
    reactions: Array.isArray(comment.reactions) ? comment.reactions.map(adaptReaction) : []
  };
}

/**
 * Adapts legacy reaction data to the current Reaction interface
 */
export function adaptReaction(reaction: any): Reaction {
  return {
    id: reaction.id,
    userId: reaction.user_id || reaction.userId,
    cardId: reaction.card_id || reaction.cardId,
    commentId: reaction.comment_id || reaction.commentId,
    collectionId: reaction.collection_id || reaction.collectionId,
    type: reaction.type,
    targetType: reaction.target_type || reaction.targetType || 'card',
    targetId: reaction.target_id || reaction.targetId || reaction.cardId || reaction.commentId,
    createdAt: reaction.created_at || reaction.createdAt,
    updatedAt: reaction.updated_at || reaction.updatedAt,
    user: reaction.user ? adaptUser(reaction.user) : undefined,
    authorId: reaction.author_id || reaction.authorId || reaction.userId
  };
}

/**
 * Adapts legacy deck data to the current Deck interface
 */
export function adaptDeck(deck: any): Deck {
  return {
    id: deck.id,
    name: deck.name,
    description: deck.description,
    cards: Array.isArray(deck.cards) ? deck.cards.map(adaptCard) : [],
    cardIds: deck.cardIds || deck.card_ids || [],
    owner: deck.owner || deck.ownerId || '',
    ownerId: deck.ownerId || deck.owner_id,
    isPublic: deck.isPublic || deck.is_public || false,
    category: deck.category,
    coverImageUrl: deck.coverImageUrl || deck.cover_image_url,
    createdAt: deck.created_at || deck.createdAt,
    updatedAt: deck.updated_at || deck.updatedAt
  };
}

/**
 * Adapts any type to another type by mapping properties with the same names
 */
export function adaptObject<T>(source: any, targetType: new () => T): Partial<T> {
  if (!source) return {};
  
  const target = new targetType();
  const keys = Object.keys(target);
  
  for (const key of keys) {
    if (source[key] !== undefined) {
      (target as any)[key] = source[key];
    }
    
    // Check for snake_case version of the key
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    if (key !== snakeKey && source[snakeKey] !== undefined) {
      (target as any)[key] = source[snakeKey];
    }
  }
  
  return target;
}
