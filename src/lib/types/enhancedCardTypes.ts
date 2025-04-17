
import { CardRarity } from "@/lib/types";

export { CardRarity };

export type EnhancedCard = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  userId?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  rarity?: CardRarity;
  cardNumber?: string;
  seriesId?: string;
  artistId?: string;
  artistName?: string;
  edition?: number;
  editionSize?: number;
  releaseDate?: string;
  qrCodeData?: string;
  effects?: string[];
  designMetadata?: any;
  marketData?: any;
};

export type Series = {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  artistId?: string;
  createdAt: string;
  updatedAt: string;
  releaseDate?: string;
  totalCards: number;
  isPublished: boolean;
  cardIds: string[];
  releaseType?: 'standard' | 'limited' | 'promotional';
};

export type Deck = {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  cardIds: string[];
  isPublic: boolean;
};
