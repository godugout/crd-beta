
// Base entity for database objects
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// JSON value type for database fields
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Export all other common types
export * from './cardTypes';
export * from './user';
export * from './instagram';
export * from './card';
export * from './collection';
export * from './interaction';
export * from './team';
export * from './oaklandMemory';
