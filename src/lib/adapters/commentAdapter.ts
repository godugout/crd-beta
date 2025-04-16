
import { Comment as SchemaComment } from '@/lib/schema/types';
import { Comment as InteractionComment, User } from '@/lib/types';
import { UserRole } from '@/lib/types/user';

/**
 * Adapts a Comment from the schema type to the interaction type
 */
export function adaptSchemaCommentToInteractionComment(comment: SchemaComment): InteractionComment {
  return {
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    cardId: comment.cardId,
    collectionId: comment.collectionId,
    teamId: comment.teamId,
    parentId: comment.parentId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: comment.user ? adaptSchemaUserToInteractionUser(comment.user) : undefined,
    reactions: []
  };
}

/**
 * Adapts a Comment from the interaction type to the schema type
 */
export function adaptInteractionCommentToSchemaComment(comment: Partial<InteractionComment>): Partial<SchemaComment> {
  const { reactions, ...rest } = comment as any;
  return {
    ...rest,
    user: comment.user ? adaptInteractionUserToSchemaUser(comment.user) : undefined
  };
}

/**
 * Adapts a User from schema type to interaction type
 */
function adaptSchemaUserToInteractionUser(user: any): User {
  return {
    id: user.id,
    email: user.email || '',
    name: user.name || user.full_name,
    displayName: user.displayName || user.name || user.full_name,
    username: user.username,
    avatarUrl: user.avatarUrl || user.avatar_url,
    role: UserRole.USER, // Default role
    createdAt: user.createdAt || user.created_at || new Date().toISOString(),
    updatedAt: user.updatedAt || user.updated_at || new Date().toISOString()
  };
}

/**
 * Adapts a User from interaction type to schema type
 */
function adaptInteractionUserToSchemaUser(user: User): any {
  return {
    id: user.id,
    email: user.email,
    full_name: user.name,
    username: user.username,
    avatar_url: user.avatarUrl
  };
}
