
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
    rarity: data.rarity || 'common',
    
    // Add new properties needed by components
    reactions: data.reactions || [],
    player: data.player || data.designMetadata?.player || undefined,
    team: data.team || data.designMetadata?.team || undefined,
    year: data.year || data.designMetadata?.year || undefined,
    artist: data.artist || data.designMetadata?.artist || undefined,
    stats: data.stats || undefined
  };
};

// Add helper functions for handling specific card properties
export const getCardPlayer = (card: Card): string | undefined => {
  return card.player || 
    card.designMetadata?.player || 
    card.designMetadata?.cardMetadata?.player;
};

export const getCardTeam = (card: Card): string | undefined => {
  return card.team || 
    card.designMetadata?.team || 
    card.designMetadata?.cardMetadata?.team;
};

export const getCardYear = (card: Card): string | undefined => {
  return card.year || 
    card.designMetadata?.year || 
    card.designMetadata?.cardMetadata?.year;
};
