
import { Card, CardRarity } from './cardTypes';

export interface EnhancedCard extends Card {
  artist?: string;
  artistId?: string; // Add artistId property
  editionSize?: number; // Add editionSize property
  cardNumber?: string; // Add cardNumber property
  marketData?: any; // Add marketData property
}

export interface Series {
  id: string;
  title: string; // Add title property
  description: string;
  coverImageUrl: string;
  artistId: string; // Add artistId property
  createdAt: string;
  updatedAt: string;
  releaseDate: string;
  totalCards: number;
  isPublished: boolean; // Add isPublished property
  cardIds: string[]; // Add cardIds property
  cards: Card[];
  releaseType: string;
  publisher?: string;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}
