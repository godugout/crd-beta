
import { Card } from '@/lib/types';

export const adaptToCard = (data: Partial<Card>): Card => {
  // Create a valid Card object from potentially incomplete data
  return {
    id: data.id || '',
    title: data.title || 'Untitled Card',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    userId: data.userId || 'anonymous',
    teamId: data.teamId || undefined,
    collectionId: data.collectionId || undefined,
    isPublic: data.isPublic !== undefined ? data.isPublic : true,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    effects: Array.isArray(data.effects) ? data.effects : [],
    designMetadata: data.designMetadata || {},
    rarity: data.rarity || 'common'
  };
};
