
// Define base types used throughout the application

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  collectionId?: string;
  userId?: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  tags?: string[];
  designMetadata?: any;
  reactions?: Reaction[];
  fabricSwatches?: FabricSwatch[];
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

export interface Collection {
  id: string;
  name: string;
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
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  username?: string;
}

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Update the TeamMember interface to include user property
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
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
