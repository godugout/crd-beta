
import { Card, CardRarity } from '@/lib/types';

/**
 * Safely adapts any card-like object to a valid Card type
 * Ensures all required properties are present
 */
export const adaptToCard = (cardData: Partial<Card>): Card => {
  // Ensure the rarity is a valid CardRarity enum value
  let rarity = cardData.rarity || CardRarity.COMMON;
  
  // If rarity is a string, convert it to the enum
  if (typeof rarity === 'string') {
    switch (rarity.toLowerCase()) {
      case 'common':
        rarity = CardRarity.COMMON;
        break;
      case 'uncommon':
        rarity = CardRarity.UNCOMMON;
        break;
      case 'rare':
        rarity = CardRarity.RARE;
        break;
      case 'ultra-rare':
        rarity = CardRarity.ULTRA_RARE;
        break;
      case 'legendary':
        rarity = CardRarity.LEGENDARY;
        break;
      case 'mythic':
        rarity = CardRarity.MYTHIC;
        break;
      case 'one-of-one':
        rarity = CardRarity.ONE_OF_ONE;
        break;
      default:
        rarity = CardRarity.COMMON;
    }
  }
  
  // Create a card with all required properties
  const card: Card = {
    id: cardData.id || `card-${Date.now()}`,
    title: cardData.title || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    userId: cardData.userId || 'anonymous',
    effects: cardData.effects || [],
    isFavorite: cardData.isFavorite !== undefined ? cardData.isFavorite : false,
    tags: cardData.tags || [],
    rarity: rarity,
    designMetadata: cardData.designMetadata || {}
  };
  
  return card;
};

/**
 * Function to ensure a CardRarity enum is used rather than a string
 */
export const ensureCardRarity = (rarity: string | CardRarity | undefined): CardRarity => {
  if (rarity === undefined) return CardRarity.COMMON;
  
  if (typeof rarity === 'string') {
    switch (rarity.toLowerCase()) {
      case 'common':
        return CardRarity.COMMON;
      case 'uncommon':
        return CardRarity.UNCOMMON;
      case 'rare':
        return CardRarity.RARE;
      case 'ultra-rare':
        return CardRarity.ULTRA_RARE;
      case 'legendary':
        return CardRarity.LEGENDARY;
      case 'mythic':
        return CardRarity.MYTHIC;
      case 'one-of-one':
        return CardRarity.ONE_OF_ONE;
      default:
        return CardRarity.COMMON;
    }
  }
  
  return rarity;
};
