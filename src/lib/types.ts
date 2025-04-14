export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'ultra-rare' | 'one-of-one';
export type CardType = 'character' | 'item' | 'event';
export type UserPermission = 'create_card' | 'edit_card' | 'delete_card' | 'view_admin_dashboard';

export interface Card {
  id: string;
  // Original properties
  name?: string;
  description: string;
  imageUrl: string;
  rarity?: CardRarity;
  type?: CardType;
  attack?: number;
  defense?: number;
  manaCost?: number;
  seriesId?: string;
  artistId?: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties used throughout the app
  title?: string;
  thumbnailUrl?: string;
  tags?: string[];
  userId?: string;
  creatorId?: string;
  teamId?: string;
  collectionId?: string;
  isPublic?: boolean;
  designMetadata?: any;
  reactions?: Reaction[];
  fabricSwatches?: FabricSwatch[];
  image?: string; // Some components use image instead of imageUrl
  
  // Adding the missing properties that are being used in components
  player?: string;
  team?: string;
  year?: string;
}

export interface Series {
  id: string;
  name: string;
  description: string;
  releaseDate: string;
  cardIds: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  cardIds: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties used throughout the app
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allowComments?: boolean;
  designMetadata?: any;
  isPublic?: boolean;
  cards?: Card[]; // Referenced in some collection operations
}

// Update UserRole to match the one in UserTypes.ts
export type UserRole = 'artist' | 'fan' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: UserRole;
  bio?: string;
  permissions?: string[];
  signature?: string;
  username?: string; // Added this property that was mentioned in errors
  createdAt?: string;
  updatedAt?: string;
}

export const ROLE_PERMISSIONS: { [key in UserRole]: UserPermission[] } = {
  'admin': ['create_card', 'edit_card', 'delete_card', 'view_admin_dashboard'],
  'moderator': ['edit_card'],
  'artist': ['create_card'],
  'fan': [],
};

// Add the missing Comment interface
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

// Add the missing Reaction interface
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

// Add the missing OaklandMemoryData interface
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

// Add FabricSwatch interface
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

// Add missing DbCard and DbCollection interfaces for Supabase
export interface DbCard {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  collection_id?: string;
  user_id?: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
  is_public?: boolean;
  tags?: string[];
  design_metadata?: any;
  creator_id: string;
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
  visibility?: 'public' | 'private' | 'team';
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

// Add missing TeamMember interface
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}
