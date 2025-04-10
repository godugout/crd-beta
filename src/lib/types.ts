
export interface Card {
  id: string;
  name?: string; // Made optional for backward compatibility
  title?: string; // Modern field
  description: string;
  image?: string; // Made optional for backward compatibility
  imageUrl?: string; // Modern field
  thumbnailUrl?: string;
  creatorId?: string; // Made optional for backward compatibility
  userId?: string; // Modern field
  createdAt: string;
  updatedAt: string;
  
  // Additional fields that are used throughout the app
  teamId?: string;
  collectionId?: string;
  isPublic?: boolean;
  tags?: string[];
  designMetadata?: any;
  reactions?: Reaction[];
  fabricSwatches?: FabricSwatch[];
}

export interface Collection {
  id: string;
  name?: string; // Made optional for backward compatibility
  title?: string; // Modern field
  description: string;
  image?: string; // Made optional for backward compatibility
  coverImageUrl?: string; // Modern field
  createdAt: string;
  updatedAt: string;
  creatorId?: string; // Made optional for backward compatibility
  userId?: string; // Modern field
  
  // Additional fields
  teamId?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allowComments?: boolean;
  designMetadata?: any;
  cards?: Card[];
  cardIds?: string[];
}

export type UserRole = 'admin' | 'moderator' | 'user';

export type UserPermission = 
  | 'create:card'
  | 'edit:card'
  | 'delete:card'
  | 'create:collection'
  | 'edit:collection'
  | 'delete:collection'
  | 'manage:users'
  | 'manage:teams';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  role?: UserRole;
  permissions?: UserPermission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  admin: [
    'create:card',
    'edit:card',
    'delete:card',
    'create:collection',
    'edit:collection',
    'delete:collection',
    'manage:users',
    'manage:teams'
  ],
  moderator: [
    'create:card',
    'edit:card',
    'delete:card',
    'create:collection',
    'edit:collection',
    'delete:collection'
  ],
  user: [
    'create:card',
    'edit:card',
    'delete:card',
    'create:collection'
  ]
};

export interface Team {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
}

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
  user?: User;
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
}

// Database-specific types for mapping
export interface DbCard {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  collection_id?: string;
  user_id?: string;
  team_id?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  is_public?: boolean;
  tags?: string[];
  design_metadata?: any;
  price?: number;
  edition_size: number;
  rarity: string;
}

export interface DbCollection {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  team_id?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: any;
}

export interface DbReaction {
  id: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  comment_id?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  created_at: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}
