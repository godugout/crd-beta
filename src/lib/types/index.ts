
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
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
}

export {
  Card,
  Comment,
  Reaction,
  User,
  UserRole,
  UserPermission,
  ROLE_PERMISSIONS,
  CardRarity,
  DesignMetadata
};

// Re-export types properly for TypeScript
export type { Collection };
