
import { Card } from '@/lib/types';

/**
 * Adapts a raw card object to the Card type
 * @param cardData Raw card data
 * @returns Properly typed Card object
 */
export const adaptToCard = (cardData: any): Card => {
  return {
    id: cardData.id || '',
    title: cardData.title || cardData.name || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    tags: Array.isArray(cardData.tags) ? cardData.tags : [],
    userId: cardData.userId || 'anonymous',
    teamId: cardData.teamId,
    collectionId: cardData.collectionId,
    isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    effects: Array.isArray(cardData.effects) ? cardData.effects : [],
    designMetadata: cardData.designMetadata || {},
    rarity: cardData.rarity || 'common',
    
    // Optional properties
    player: cardData.player,
    team: cardData.team,
    year: cardData.year,
    artist: cardData.artist,
    set: cardData.set,
    stats: cardData.stats,
    fabricSwatches: cardData.fabricSwatches,
    viewCount: cardData.viewCount,
    name: cardData.name,
    reactions: cardData.reactions,
  };
};
