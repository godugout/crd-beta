
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

// Add JsonObject type that was missing
export type JsonObject = { [key: string]: JsonValue };

// Add serializeMetadata utility function
export const serializeMetadata = (metadata: any): string => {
  return JSON.stringify(metadata || {});
};

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
  template: string; // Make this required
}

// Base entity interface that many types extend
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// Ensure that Card includes designMetadata in its type definition
export interface Card extends BaseEntity {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  userId: string;
  effects: string[];
  player?: string;
  team?: string;
  position?: string;
  year?: string;
  designMetadata: {
    cardStyle: {
      template: string;
      effect: string;
      borderRadius: string;
      borderColor: string;
      frameColor: string;
      frameWidth: number;
      shadowColor: string;
    };
    textStyle: {
      titleColor: string;
      titleAlignment: string;
      titleWeight: string;
      descriptionColor: string;
    };
    marketMetadata: {
      isPrintable: boolean;
      isForSale: boolean;
      includeInCatalog: boolean;
    };
    cardMetadata: {
      category: string;
      cardType: string;
      series: string;
    };
  };
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
