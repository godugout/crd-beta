import { Comment, User, UserRole } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export interface CommentInput {
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
}

export interface DbComment {
  id: string;
  content: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  team_id?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  user?: DbUser;
}

export interface DbUser {
  id: string;
  email: string;
  display_name?: string;
  name?: string;
  username?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

// Convert DB user to app user format
export const dbUserToUser = (dbUser: DbUser): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name || dbUser.display_name || dbUser.email.split('@')[0],
    displayName: dbUser.display_name,
    username: dbUser.username,
    avatarUrl: dbUser.avatar_url,
    role: dbUser.role as UserRole || UserRole.USER,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
    isVerified: true,
    isActive: true,
    permissions: ['read:own', 'write:own', 'delete:own'],
    bio: ''
  };
};

// Add the missing adapter functions
export const adaptSchemaCommentToInteractionComment = (schemaComment: DbComment): Comment => {
  return {
    id: schemaComment.id,
    content: schemaComment.content,
    userId: schemaComment.user_id,
    cardId: schemaComment.card_id,
    collectionId: schemaComment.collection_id,
    teamId: schemaComment.team_id,
    parentId: schemaComment.parent_id,
    createdAt: schemaComment.created_at,
    updatedAt: schemaComment.updated_at,
    user: schemaComment.user ? dbUserToUser(schemaComment.user) : undefined
  };
};

export const adaptInteractionCommentToSchemaComment = (comment: CommentInput): DbComment => {
  const timestamp = new Date().toISOString();
  
  return {
    id: uuidv4(),
    content: comment.content,
    user_id: comment.userId,
    card_id: comment.cardId,
    collection_id: comment.collectionId,
    team_id: comment.teamId,
    parent_id: comment.parentId,
    created_at: timestamp,
    updated_at: timestamp
  };
};

// Keep original functions for backwards compatibility
export const dbCommentToComment = adaptSchemaCommentToInteractionComment;
export const commentToDbComment = adaptInteractionCommentToSchemaComment;
