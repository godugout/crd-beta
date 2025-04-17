
import { Card, CardRarity } from '@/lib/types';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { adaptToEnhancedCard } from '@/lib/adapters/EnhancedCardAdapter';

/**
 * Convert EnhancedCard to standard Card format
 * Handles the edition property conversion
 */
export const enhancedCardToCard = (enhancedCard: EnhancedCard): Card => {
  // Convert edition from number to {number, total} object
  const edition = typeof enhancedCard.edition === 'number' 
    ? { number: enhancedCard.edition, total: 1 } 
    : undefined;
  
  // Use the standard adapter but override the edition format
  return adaptToCard({
    ...enhancedCard,
    edition
  });
};

/**
 * Convert Card to EnhancedCard format
 * For backwards compatibility with existing code
 */
export const cardToEnhancedCard = (card: Card): EnhancedCard => {
  return adaptToEnhancedCard(card);
};

/**
 * Safely convert any card-like object to standard Card format
 * Ensures all required properties are present with correct types
 */
export const toStandardCard = (cardData: any): Card => {
  // Ensure rarity is the correct enum type
  let rarity = cardData.rarity || CardRarity.COMMON;
  if (typeof rarity === 'string') {
    switch (rarity.toLowerCase()) {
      case 'common': rarity = CardRarity.COMMON; break;
      case 'uncommon': rarity = CardRarity.UNCOMMON; break;
      case 'rare': rarity = CardRarity.RARE; break;
      case 'ultra-rare': 
      case 'ultra_rare': rarity = CardRarity.ULTRA_RARE; break;
      case 'legendary': rarity = CardRarity.LEGENDARY; break;
      case 'mythic': rarity = CardRarity.MYTHIC; break;
      case 'one-of-one':
      case 'one_of_one': rarity = CardRarity.ONE_OF_ONE; break;
      default: rarity = CardRarity.COMMON;
    }
  }
  
  return adaptToCard({
    ...cardData,
    rarity
  });
};

