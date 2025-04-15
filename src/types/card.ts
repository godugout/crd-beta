
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'ultra-rare' | 'one-of-one';
export type CardType = 'character' | 'item' | 'event';

export interface Card {
  id: string;
  name?: string;
  title?: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  rarity?: CardRarity;
  type?: CardType;
  attack?: number;
  defense?: number;
  manaCost?: number;
  seriesId?: string;
  artistId?: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  team?: string;
  jersey?: string;
  year?: string;
  cardNumber?: string;
  set?: string;
  artist?: string;
  specialEffect?: string;
  userId?: string;
  creatorId?: string;
  teamId?: string;
  collectionId?: string;
  isPublic?: boolean;
  designMetadata?: any;
  reactions?: Reaction[];
  fabricSwatches?: FabricSwatch[];
  image?: string;
}

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}
