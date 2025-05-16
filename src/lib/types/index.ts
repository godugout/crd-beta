
/**
 * Core types used throughout the application
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue; }
export type JsonArray = Array<JsonValue>;

export interface Reaction {
  id: string;
  targetType: string;
  targetId: string;
  userId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  authorId?: string; // Added for backward compatibility
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;   // Added for backward compatibility
  reactions?: Reaction[];
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  updatedAt?: string;
}

export interface CreationHistoryItem {
  id: string;
  createdAt: string;
  cardId: string;
  effectsUsed: string[];
  elementsUsed: string[];
  timeSpent: number;
}

export interface UserStyleProfile {
  favoriteColors: string[];
  preferredEffects: string[];
  favoriteTemplates: string[];
  lastUsedElements: string[];
}

// Additional types to resolve errors
export type BackgroundColor = string;

// Instagram-related types
export interface InstagramPost {
  id: string;
  postId?: string;
  username: string;
  caption?: string;
  imageUrl?: string;
  permalink?: string;
  timestamp: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
}

// User type definition to support user property in Comment
export interface User {
  id: string;
  email?: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}
