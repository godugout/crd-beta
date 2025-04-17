
import { Card, CardRarity } from '@/lib/types';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';

/**
 * Adapter to convert any object to an EnhancedCard
 * 
 * @param data Source data to adapt
 * @returns EnhancedCard with all required properties
 */
export const adaptToEnhancedCard = (data: Partial<Card | EnhancedCard>): EnhancedCard => {
  // First ensure it has all the base Card properties
  const baseProps = {
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
    tags: data.tags || []
  };

  // Then add EnhancedCard-specific properties
  return {
    ...baseProps,
    views: (data as EnhancedCard).views || 0,
    likes: (data as EnhancedCard).likes || 0,
    shares: (data as EnhancedCard).shares || 0,
    // If data has edition as an object, convert to number
    edition: typeof data.edition === 'object' ? 
      data.edition?.number || 1 : 
      (data as EnhancedCard).edition || 1,
    tags: data.tags || [] // Ensure tags are included
  };
};

/**
 * Create a basic enhanced card with minimum required properties
 * 
 * @param id Card ID
 * @returns EnhancedCard with default values
 */
export const createBasicEnhancedCard = (id: string): EnhancedCard => {
  return {
    id,
    title: `Card ${id.slice(-4)}`,
    description: '', // Required property
    imageUrl: '',
    thumbnailUrl: '', // Required property
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'anonymous',
    effects: [],
    isFavorite: false,
    tags: [], // Added required tags property
    rarity: CardRarity.COMMON,
    views: 0,
    likes: 0,
    shares: 0
  };
};

/**
 * Convert a Card to an EnhancedCard
 * For backwards compatibility
 * 
 * @param card Card to convert
 * @returns Enhanced version of the card
 */
export const cardToEnhancedCard = (card: Card | Partial<Card>): EnhancedCard => {
  return adaptToEnhancedCard(card);
};
