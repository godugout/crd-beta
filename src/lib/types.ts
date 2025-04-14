// Card interface - extend with baseball stats
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  collectionId?: string;
  player?: string;
  team?: string;
  year?: string;
  position?: string;
  rarity?: string;
  
  // Baseball card stats
  battingAverage?: string;
  homeRuns?: string;
  rbis?: string;
  era?: string;
  wins?: string;
  strikeouts?: string;
  careerYears?: string;
  ranking?: string;
  estimatedValue?: string;
  condition?: string;
  
  // Design metadata
  designMetadata?: {
    cardStyle?: {
      borderRadius?: string;
      borderWidth?: number;
      borderColor?: string;
      backgroundColor?: string;
      effect?: string;
      shadowColor?: string;
      frameWidth?: number;
      frameColor?: string;
    },
    textStyle?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      titleColor?: string;
      titleAlignment?: string;
      titleWeight?: string;
      descriptionColor?: string;
    },
    cardMetadata?: {
      edition?: string;
      serialNumber?: string;
      certification?: string;
      gradeScore?: string;
      category?: string;
      series?: string;
      cardType?: string;
    },
    marketMetadata?: {
      lastSoldPrice?: number;
      currentAskingPrice?: number;
      estimatedMarketValue?: number;
      isPrintable?: boolean;
      isForSale?: boolean;
      includeInCatalog?: boolean;
    },
    oaklandMemory?: OaklandMemoryData
  },
  
  // Additional properties for component compatibility
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  creatorId?: string;
  teamId?: string;
  isPublic?: boolean;
  reactions?: Reaction[];
  fabricSwatches?: FabricSwatch[];
  oaklandMemory?: OaklandMemoryData;
  image?: string; // Backward compatibility for some components
  name?: string; // Backward compatibility for some components
  
  // Instagram card specific fields
  instagramUsername?: string;
  instagramPostId?: string;
  instagramPost?: InstagramPost;
}

export interface Collection {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team';
  allowComments?: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata?: any;
  cards?: Card[];
  cardIds?: string[]; // Added for backward compatibility
  instagramSource?: {
    username: string;
    lastFetched?: string;
    autoUpdate?: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: UserRole;
  permissions?: UserPermission[];
  preferences?: Record<string, any>;
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

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
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
  template?: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium',
  CREATOR = 'creator',
  MODERATOR = 'moderator'
}

export const ROLE_PERMISSIONS: Record<UserRole | string, string[]> = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.USER]: ['read:own', 'write:own', 'delete:own'],
  [UserRole.PREMIUM]: ['read:own', 'write:own', 'delete:own', 'premium:features'],
  [UserRole.CREATOR]: ['read:own', 'write:own', 'delete:own', 'create:premium'],
  [UserRole.MODERATOR]: ['read:own', 'write:own', 'delete:own', 'moderate:content']
};

// Instagram CRD specific interfaces
export interface InstagramPost {
  id: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

// Database representation types
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
