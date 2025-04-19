
// Import and re-export all types from the type modules
import { Card, FabricSwatch, CardData } from './types/card';
import { User, UserRole as UserRoleEnum, UserPermission as UserPermissionEnum } from './types/user';
import { Collection } from './types/collection';
import { Comment, Reaction, Team, TeamMember } from './schema/types';
import { OaklandMemoryData } from './schema/types';
import { GroupUploadType } from './types/uploadTypes';
import { InstagramPost } from './types/socialTypes';

// Core data types
export type {
  Card,
  CardData,
  FabricSwatch,
  User,
  Collection,
  Comment,
  Reaction,
  Team,
  TeamMember,
  OaklandMemoryData,
  GroupUploadType,
  InstagramPost
};

// Enum exports
export { UserRoleEnum as UserRole, UserPermissionEnum as UserPermission };

// Base entity interface
export interface BaseEntity {
  id: string;
  [key: string]: any;
}

// Export JsonValue type
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// Add JsonObject type
export type JsonObject = { [key: string]: JsonValue };

// Add serializeMetadata utility function
export const serializeMetadata = (metadata: any): string => {
  return JSON.stringify(metadata || {});
};

// Add the CardRarity type that was missing
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | 'exclusive' | 'one-of-one';

// Add Role Permissions mapping
export const ROLE_PERMISSIONS: Record<UserRoleEnum, UserPermissionEnum[]> = {
  [UserRoleEnum.ADMIN]: [
    UserPermissionEnum.MANAGE_USERS,
    UserPermissionEnum.MANAGE_CONTENT,
    UserPermissionEnum.VIEW_ANALYTICS,
    UserPermissionEnum.MANAGE_SYSTEM,
    UserPermissionEnum.ACCESS_API,
    UserPermissionEnum.MODERATE_COMMENTS,
  ],
  [UserRoleEnum.MODERATOR]: [
    UserPermissionEnum.MANAGE_CONTENT,
    UserPermissionEnum.MODERATE_COMMENTS,
    UserPermissionEnum.VIEW_ANALYTICS,
    UserPermissionEnum.ACCESS_API
  ],
  [UserRoleEnum.CREATOR]: [
    UserPermissionEnum.CREATE_CONTENT,
    UserPermissionEnum.EDIT_OWN_CONTENT,
    UserPermissionEnum.DELETE_OWN_CONTENT,
    UserPermissionEnum.ACCESS_API
  ],
  [UserRoleEnum.USER]: [
    UserPermissionEnum.CREATE_COLLECTIONS,
    UserPermissionEnum.EDIT_OWN_COLLECTIONS,
    UserPermissionEnum.VIEW_CONTENT
  ],
  [UserRoleEnum.GUEST]: [
    UserPermissionEnum.VIEW_CONTENT
  ]
};

// Re-export design metadata types
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
  role?: UserRoleEnum;
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
