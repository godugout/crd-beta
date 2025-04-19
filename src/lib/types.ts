
// Base types that might be used across modules
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Card Interface
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  backImageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  designMetadata?: any;
  effects?: string[];
  isPublic?: boolean;
  player?: string;
  team?: string;
  year?: string;
  sport?: string;
  cardType?: string;
  set?: string;
  condition?: string;
  manufacturer?: string;
  cardNumber?: string;
  grade?: string;
  gradingCompany?: string;
  height?: number;
  width?: number;
  artist?: string;
  rarity?: string;
  reactions?: any[];
  fabricSwatches?: any[];
  viewCount?: number;
  name?: string;
  collectionId?: string;
}

// User Interface
export interface User {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  displayName?: string;
  username?: string;
  role?: UserRole;
}

// Collection Interface
export interface Collection {
  id: string;
  title: string;
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  cardCount?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic?: boolean;
  coverImageUrl?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  featured?: boolean;
  cards?: Card[];
  allowComments?: boolean;
  designMetadata?: any;
}

export interface GroupMeta {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic?: boolean;
}

export enum GroupUploadType {
  PHOTOS = 'photos',
  CARDS = 'cards',
  MIXED = 'mixed'
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

// User Role, Permission and Mapping
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium',
  CREATOR = 'creator',
  MODERATOR = 'moderator'
}

export type UserPermission = 
  | 'read:own' 
  | 'write:own' 
  | 'delete:own' 
  | 'read:all' 
  | 'write:all' 
  | 'delete:all' 
  | 'premium:features'
  | 'create:premium'
  | 'moderate:content'
  | 'all';

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.USER]: ['read:own', 'write:own', 'delete:own'],
  [UserRole.PREMIUM]: ['read:own', 'write:own', 'delete:own', 'premium:features'],
  [UserRole.CREATOR]: ['read:own', 'write:own', 'delete:own', 'create:premium'],
  [UserRole.MODERATOR]: ['read:own', 'write:own', 'delete:own', 'moderate:content']
};

// Comment Interface
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

// Reaction Interface
export interface Reaction {
  id: string;
  userId: string;
  targetType: 'card' | 'collection' | 'comment' | string;
  targetId: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  user?: User;
}

// OaklandMemoryData Interface
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

// Instagram Post Interface
export interface InstagramPost {
  id: string;
  caption: string;
  imageUrl: string;
  postUrl: string;
  timestamp: string;
  likes: number;
  comments: number;
}

// Design Metadata Interface
export interface DesignMetadata {
  cardStyle: {
    template: string;
    effect: string;
    borderRadius: string;
    borderColor: string;
    frameColor: string;
    frameWidth: number;
    shadowColor: string;
  };
  textStyle: {
    titleColor: string;
    titleAlignment: string;
    titleWeight: string;
    descriptionColor: string;
  };
  marketMetadata: {
    isPrintable: boolean;
    isForSale: boolean;
    includeInCatalog: boolean;
  };
  cardMetadata: {
    category: string;
    cardType: string;
    series: string;
  };
}

// Default design metadata
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameColor: '#000000',
    frameWidth: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333',
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false,
  },
  cardMetadata: {
    category: 'general',
    cardType: 'standard',
    series: 'base',
  },
};

// Fallback image URLs
export const FALLBACK_FRONT_IMAGE_URL = '/images/card-placeholder.png';
export const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';
