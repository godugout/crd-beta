
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
  authorId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
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
