
// Core models
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  collectionId?: string;
  createdAt?: string;
  updatedAt?: string;
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
  is_public?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  visibility: 'public' | 'private' | 'unlisted';
  allowComments: boolean;
  designMetadata?: any;
  cards?: Card[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
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
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  reactions?: Reaction[];
}

export interface Reaction {
  id: string;
  type: string;
  userId: string;
  cardId?: string;
  commentId?: string;
  collectionId?: string;
  createdAt: string;
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
  // Adding the missing properties that were causing errors
  attendees?: string[];
  historicalContext?: string;
  personalSignificance?: string;
}

// Add any other types needed by the application
