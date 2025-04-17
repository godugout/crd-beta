
import { Card } from './card';
import { Comment, Reaction } from './interaction';
import { User, UserRole, UserPermission } from './user';
import { ROLE_PERMISSIONS } from './user';
import { CardRarity, DesignMetadata } from './cardTypes';

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collection extends BaseEntity {
  title: string;
  name: string;
  description: string;
  coverImageUrl: string;
  userId: string;
  visibility: 'public' | 'private' | 'team';
  allowComments: boolean;
  createdAt: string;
  updatedAt: string;
  cardIds?: string[];
  tags?: string[];
}

export interface JsonValue {
  [key: string]: string | number | boolean | null | JsonValue | JsonValue[];
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
}

// Export all types
export { Card, Comment, Reaction, User, UserRole, UserPermission, ROLE_PERMISSIONS, CardRarity, DesignMetadata };

// Re-export types properly for TypeScript
export type { Collection };
