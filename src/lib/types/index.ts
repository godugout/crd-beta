
export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  teamId?: string;
  collectionId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  effects: any[];
  designMetadata: Record<string, any>;
  rarity: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  userId: string;
  teamId?: string;
  cards: Card[];
  cardIds: string[];
  visibility: 'public' | 'private' | 'unlisted';
  allowComments: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata: Record<string, any>;
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date: string;
  memoryType?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
}
