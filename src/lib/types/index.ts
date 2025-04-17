
/**
 * Central type exports for the CRD application
 * This file consolidates all type definitions and provides proper exports
 */

import { Card } from './card';
import { Comment, Reaction } from './interaction';
import { User, UserRole, UserPermission } from './user';
import { ROLE_PERMISSIONS } from './user';
import { CardRarity, DesignMetadata } from './cardTypes';
import { Collection } from './collection';

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JsonValue {
  [key: string]: string | number | boolean | null | JsonValue | JsonValue[];
}

// Re-export all types
export { ROLE_PERMISSIONS, UserRole, CardRarity };

// Re-export types with explicit type keyword for TypeScript modules
export type { Card, Comment, Reaction, User, UserPermission, DesignMetadata, Collection };

// Define OaklandMemoryData without conflicting with JsonValue
export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string;
  location?: string;
  tags?: string[];
  opponent?: string;
  score?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
  // Allow additional properties of string type
  [key: string]: string | string[] | undefined;
}
