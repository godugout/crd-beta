
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

// Update OaklandMemoryData type if it's defined here
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
  template?: string; // Add the missing template property
}
