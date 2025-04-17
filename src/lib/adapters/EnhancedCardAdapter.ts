
import { Card, CardRarity } from '@/lib/types';

export const adaptToEnhancedCard = (data: any): any => {
  return {
    id: data.id || `enhanced-${Date.now()}`,
    title: data.title || 'Untitled Card',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || '',
    userId: data.userId || 'anonymous',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    effects: data.effects || [],
    isFavorite: data.isFavorite !== undefined ? data.isFavorite : false,
    rarity: data.rarity || CardRarity.COMMON,
    views: data.views || 0,
    likes: data.likes || 0,
    shares: data.shares || 0
  };
};

export const createBasicEnhancedCard = (id: string): Card => {
  return {
    id,
    title: `Card ${id.slice(-4)}`,
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'anonymous',
    effects: [],
    isFavorite: false,
    tags: [],
    rarity: CardRarity.COMMON
  };
};
