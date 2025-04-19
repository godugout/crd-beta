
// Add this export to your types/index.ts file
export type GroupUploadType = 'group' | 'individual' | 'batch';

// Add the missing JsonValue type
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Update OaklandMemoryData type to include template property
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
  template?: string; // Add the template property
}

// Base entity interface that many types extend
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// Team interface
export interface Team extends BaseEntity {
  id: string; // Explicitly include id
  name: string;
  primary_color: string; // Add required properties
  description?: string;
  logoUrl?: string;
  members?: string[];
}
