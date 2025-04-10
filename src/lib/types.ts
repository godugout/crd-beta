// Core models
export interface User {
  id: string;
  email: string;
  displayName?: string;  // Keep displayName for backward compatibility
  name?: string;         // Add name property
  username?: string;     // Add username property
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  role?: UserRole; // Add role property
  permissions?: UserPermission[]; // Add permissions array
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  collectionId?: string;
  createdAt: string;     // Make required to match schema
  updatedAt: string;     // Make required to match schema
  userId?: string;
  teamId?: string;
  isPublic?: boolean;
  designMetadata?: any;
  fabricSwatches?: FabricSwatch[];
  reactions?: Reaction[];
  comments?: Comment[];
}

export interface DbCard {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  thumbnail_url?: string | null;
  tags?: string[];
  collection_id?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  team_id?: string;      // Add team_id property
  is_public?: boolean;
  design_metadata?: any; // Add design_metadata property
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  visibility: 'public' | 'private' | 'unlisted' | 'team'; // Include 'team'
  allowComments: boolean;
  designMetadata?: any;
  cards?: Card[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  teamId?: string;       // Add teamId property
}

export interface DbCollection {
  id: string;
  title: string;
  description: string | null;
  cover_image_url?: string | null;
  visibility?: string;
  allow_comments?: boolean;
  design_metadata?: any;
  created_at: string;
  updated_at: string;
  owner_id: string;
  team_id?: string;      // Add team_id property
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;       // Add teamId property
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Reaction {
  id: string;
  type: string;
  userId: string;
  cardId?: string;
  commentId?: string;
  collectionId?: string;
  createdAt: string;
  user?: User;           // Add user property
}

export interface DbReaction {
  id: string;
  type: string;
  user_id: string;
  card_id?: string;
  comment_id?: string;
  collection_id?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  joinedAt: string;
  user?: User;
}

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

// Oakland Memory Data interface
export interface OaklandMemoryData {
  id?: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  opponent?: string;
  score?: string;
  section?: string;
  imageUrl?: string;
  memoryType?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  attendees?: string[];              // Add missing properties
  historicalContext?: string;        // Add missing properties
  personalSignificance?: string;     // Add missing properties
}

// Add AssetUploadResult interface
export interface AssetUploadResult {
  id: string;
  url: string;  // Use url instead of publicUrl
  title?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
}

// Add any other types needed by the application

// Enhanced User type with roles
export interface User {
  id: string;
  email: string;
  displayName?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  role?: UserRole; // Add role property
  permissions?: UserPermission[]; // Add permissions array
}

// Define available user roles
export type UserRole = 'admin' | 'moderator' | 'user';

// Define available user permissions
export type UserPermission = 
  | 'create:memory'
  | 'edit:memory'
  | 'delete:memory'
  | 'view:memory'
  | 'create:comment'
  | 'edit:comment'
  | 'delete:comment'
  | 'moderate:content'
  | 'manage:users';

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  admin: [
    'create:memory',
    'edit:memory',
    'delete:memory',
    'view:memory',
    'create:comment',
    'edit:comment',
    'delete:comment',
    'moderate:content',
    'manage:users'
  ],
  moderator: [
    'create:memory',
    'edit:memory',
    'view:memory',
    'create:comment',
    'edit:comment',
    'moderate:content'
  ],
  user: [
    'create:memory',
    'edit:memory', 
    'view:memory',
    'create:comment',
    'edit:comment'
  ]
};
