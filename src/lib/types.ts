
// Import types from schema but don't re-export them directly to avoid conflicts
import { 
  Card as SchemaCard, 
  OaklandMemoryData as SchemaOaklandMemoryData,
  Collection as SchemaCollection,
  User as SchemaUser,
  Team, 
  TeamMember, 
  Comment, 
  Reaction 
} from '@/lib/schema/types';

// Define our own types that extend or are compatible with schema types
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

// User interface that's compatible with schema User
export interface User extends SchemaUser {
  // Any additional fields needed
}

// Collection interface compatible with schema Collection
export interface Collection extends SchemaCollection {
  // Any additional fields needed
}

// Card interface that extends SchemaCard to ensure compatibility
export interface Card extends SchemaCard {
  // Any additional fields needed for compatibility
}

// OaklandMemoryData that ensures title and description are present
export interface OaklandMemoryData extends SchemaOaklandMemoryData {
  // Required fields already defined in schema
}

// Re-export the Team, TeamMember, Comment, and Reaction types directly
export { Team, TeamMember, Comment, Reaction };
