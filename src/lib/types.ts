
export interface Card {
  id: string;
  name: string; // Legacy field
  description: string;
  image: string; // Legacy field
  creatorId: string; // Legacy field
  createdAt: string;
  updatedAt: string;

  // New fields that are used throughout the app but weren't in the original type
  title?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  userId?: string;
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
  name: string; // Legacy field
  description: string;
  image: string; // Legacy field 
  createdAt: string;
  updatedAt: string;
  creatorId: string; // Legacy field

  // New fields that are used throughout the app
  title?: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team';
  allowComments?: boolean;
  designMetadata?: any;
  cards?: Card[];
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
