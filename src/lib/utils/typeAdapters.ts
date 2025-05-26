
import { Card, Collection, Comment, Reaction, Team, TeamMember, User } from '@/lib/types';
import { CardElement, ElementUploadMetadata, ElementCategory, ElementType } from '@/lib/types/cardElements';

/**
 * Adapts comment data between different API formats
 */
export function adaptComment(comment: any): Comment {
  return {
    id: comment.id,
    text: comment.text || comment.content,
    content: comment.content || comment.text,
    userId: comment.userId || comment.user_id || comment.authorId,
    authorId: comment.authorId || comment.userId || comment.user_id,
    cardId: comment.cardId || comment.card_id,
    collectionId: comment.collectionId || comment.collection_id,
    teamId: comment.teamId || comment.team_id,
    parentId: comment.parentId || comment.parent_id,
    createdAt: comment.createdAt || comment.created_at || new Date().toISOString(),
    updatedAt: comment.updatedAt || comment.updated_at || new Date().toISOString(),
    user: comment.user ? adaptUser(comment.user) : undefined
  };
}

/**
 * Adapts user data between different API formats
 */
export function adaptUser(user: any): User {
  if (!user) return {} as User;
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.name || user.full_name || user.displayName,
    displayName: user.displayName || user.name || user.full_name,
    avatarUrl: user.avatarUrl || user.avatar_url,
    createdAt: user.createdAt || user.created_at,
    updatedAt: user.updatedAt || user.updated_at,
    username: user.username,
    role: user.role,
  };
}

/**
 * Adapts collection data between different API formats
 */
export function adaptCollection(collection: any): Collection {
  return {
    id: collection.id,
    name: collection.name || collection.title,
    description: collection.description,
    coverImageUrl: collection.coverImageUrl || collection.cover_image_url,
    userId: collection.userId || collection.user_id,
    ownerId: collection.ownerId || collection.owner_id,
    teamId: collection.teamId || collection.team_id,
    visibility: collection.visibility,
    allowComments: collection.allowComments || collection.allow_comments,
    createdAt: collection.createdAt || collection.created_at || new Date().toISOString(),
    updatedAt: collection.updatedAt || collection.updated_at || new Date().toISOString(),
    designMetadata: collection.designMetadata || collection.design_metadata,
    cards: collection.cards || [],
    cardIds: collection.cardIds || (collection.cards?.map(card => card.id) || []),
    isPublic: collection.isPublic || collection.visibility === 'public',
    instagramSource: typeof collection.instagramSource === 'string' 
      ? { username: collection.instagramSource, lastFetched: '', autoUpdate: false }
      : collection.instagramSource
  };
}

/**
 * Adapts team data between different API formats
 */
export function adaptTeam(team: any): Team {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    logoUrl: team.logoUrl || team.logo_url,
    ownerId: team.ownerId || team.owner_id,
    createdAt: team.createdAt || team.created_at || new Date().toISOString(),
    updatedAt: team.updatedAt || team.updated_at || new Date().toISOString(),
    primaryColor: team.primaryColor || team.primary_color,
    secondaryColor: team.secondaryColor || team.secondary_color,
    tags: team.tags || [],
    members: team.members,
    website: team.website,
    email: team.email,
    status: team.status,
    visibility: team.visibility,
    bannerUrl: team.bannerUrl || team.banner_url,
    specialties: team.specialties,
    settings: team.settings
  };
}

// Element system adapters
export const mapToElementCategory = (category: string): ElementCategory => {
  return category as ElementCategory;
};

export const mapToElementType = (type: string): ElementType => {
  return type as ElementType;
};

export function elementUploadToCardElement(upload: ElementUploadMetadata): CardElement {
  return {
    id: `element-${Date.now()}`,
    type: upload.type as ElementType,
    name: upload.name,
    url: upload.imageUrl,
    assetUrl: upload.imageUrl,
    thumbnailUrl: upload.imageUrl,
    description: upload.description || '',
    tags: upload.tags || [],
    category: upload.category as string,
    isOfficial: false,
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorId: 'anonymous'
  };
}
