
// Import from local file paths that actually exist
import { Card, FabricSwatch, CardData, DesignMetadata as CardDesignMetadata } from '../types/card';
import { CardRarity, DesignMetadata as CardTypesDesignMetadata } from '../types/cardTypes';

// Define base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// Re-export the Card interface for use throughout the application
export type { Card };

// Export JsonValue type
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// Add JsonObject type
export type JsonObject = { [key: string]: JsonValue };

// Add serializeMetadata utility function
export const serializeMetadata = (metadata: any): string => {
  return JSON.stringify(metadata || {});
};

// Add the CardRarity type that was missing
export type { CardRarity };

// Re-export design metadata types
export interface Collection {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: string;
  allowComments?: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata?: any;
  cards?: Card[];
  cardIds?: string[];
  tags?: string[];
  isPublic?: boolean;
  featured?: boolean;
}

// Re-export DesignMetadata, using the definition from cardTypes
export interface DesignMetadata {
  cardStyle: {
    template: string;
    effect: string;
    borderRadius: string;
    borderColor: string;
    frameColor: string;
    frameWidth: number;
    shadowColor: string;
    teamSpecific?: boolean;
    [key: string]: any;
  };
  textStyle: {
    titleColor: string;
    titleAlignment: string;
    titleWeight: string;
    descriptionColor: string;
    [key: string]: any;
  };
  marketMetadata: {
    isPrintable: boolean;
    isForSale: boolean;
    includeInCatalog: boolean;
    [key: string]: any;
  };
  cardMetadata: {
    category: string;
    cardType: string;
    series: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Types for AuthUser
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  displayName?: string;
  username?: string;
  role?: string;
  bio?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
}

// DbCollection type
export interface DbCollection {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  user_id?: string;
  team_id?: string;
  visibility?: string;
  allow_comments?: boolean;
  design_metadata?: any;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  card_ids?: string[];
  tags?: string[];
  featured?: boolean;
}

// Re-export types
export type { FabricSwatch, CardData };

// Define minimal User and UserRole types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  createdAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CREATOR = 'CREATOR',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum UserPermission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  ACCESS_API = 'ACCESS_API',
  MODERATE_COMMENTS = 'MODERATE_COMMENTS',
  CREATE_CONTENT = 'CREATE_CONTENT',
  EDIT_OWN_CONTENT = 'EDIT_OWN_CONTENT',
  DELETE_OWN_CONTENT = 'DELETE_OWN_CONTENT',
  CREATE_COLLECTIONS = 'CREATE_COLLECTIONS',
  EDIT_OWN_COLLECTIONS = 'EDIT_OWN_COLLECTIONS',
  VIEW_CONTENT = 'VIEW_CONTENT'
}

// Add Role Permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: [
    UserPermission.MANAGE_USERS,
    UserPermission.MANAGE_CONTENT,
    UserPermission.VIEW_ANALYTICS,
    UserPermission.MANAGE_SYSTEM,
    UserPermission.ACCESS_API,
    UserPermission.MODERATE_COMMENTS,
  ],
  [UserRole.MODERATOR]: [
    UserPermission.MANAGE_CONTENT,
    UserPermission.MODERATE_COMMENTS,
    UserPermission.VIEW_ANALYTICS,
    UserPermission.ACCESS_API
  ],
  [UserRole.CREATOR]: [
    UserPermission.CREATE_CONTENT,
    UserPermission.EDIT_OWN_CONTENT,
    UserPermission.DELETE_OWN_CONTENT,
    UserPermission.ACCESS_API
  ],
  [UserRole.USER]: [
    UserPermission.CREATE_COLLECTIONS,
    UserPermission.EDIT_OWN_COLLECTIONS,
    UserPermission.VIEW_CONTENT
  ],
  [UserRole.GUEST]: [
    UserPermission.VIEW_CONTENT
  ]
};

// Define minimal versions of the missing types
export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface Reaction {
  id: string;
  userId: string;
  type: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  template: string;
}

export interface GroupUploadType {
  id: string;
  name: string;
}

export interface InstagramPost {
  id: string;
  caption?: string;
  imageUrl?: string;
}
