export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CardType = 'character' | 'item' | 'event';
export type UserPermission = 'create_card' | 'edit_card' | 'delete_card' | 'view_admin_dashboard';

export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: CardRarity;
  type: CardType;
  attack?: number;
  defense?: number;
  manaCost: number;
  seriesId: string;
  artistId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  id: string;
  name: string;
  description: string;
  releaseDate: string;
  cardIds: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  cardIds: string[];
  imageUrl: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Update UserRole to match the one in UserTypes.ts
export type UserRole = 'artist' | 'fan' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: UserRole;
  bio?: string;
  permissions?: string[];
  signature?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ROLE_PERMISSIONS: { [key in UserRole]: UserPermission[] } = {
  'admin': ['create_card', 'edit_card', 'delete_card', 'view_admin_dashboard'],
  'moderator': ['edit_card'],
  'artist': ['create_card'],
  'fan': [],
};
