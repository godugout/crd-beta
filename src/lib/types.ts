export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  cards?: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  createdAt?: string; // Changed from Date to string to match usage
  userId?: string;
  collectionId?: string;
  designMetadata?: {
    cardStyle: any;
    textStyle: any;
    oaklandMemory?: {
      date?: string;
      opponent?: string;
      score?: string;
      location?: string;
      section?: string;
      memoryType?: string;
      attendees?: string[];
      template?: string;
      teamId?: string;
      imageUrl?: string;
    };
  };
  tags?: string[];
  fabricSwatches?: FabricSwatch[];
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string; // Changed from Date to string to match usage
  memoryType?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  attendees: string[];
  tags: string[];
  imageUrl?: string;
  template?: string;
}
