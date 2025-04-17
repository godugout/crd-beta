
import { CardRarity } from '@/lib/types';

/**
 * Utility function to check if a card rarity matches a string value
 * Handles the comparison safely for enum values
 */
export const isRarity = (rarity: CardRarity | string | undefined, compareRarity: string): boolean => {
  if (!rarity) return false;
  return rarity.toString() === compareRarity;
};

/**
 * Utility function to convert a string rarity to CardRarity enum value
 */
export const stringToCardRarity = (rarity: string): CardRarity => {
  switch (rarity.toLowerCase()) {
    case 'common':
      return CardRarity.COMMON;
    case 'uncommon':
      return CardRarity.UNCOMMON;
    case 'rare':
      return CardRarity.RARE;
    case 'ultra-rare':
    case 'ultra_rare':
      return CardRarity.ULTRA_RARE;
    case 'legendary':
      return CardRarity.LEGENDARY;
    case 'mythic':
      return CardRarity.MYTHIC;
    case 'one-of-one':
    case 'one_of_one':
      return CardRarity.ONE_OF_ONE;
    default:
      return CardRarity.COMMON;
  }
};

/**
 * Safely get a CardRarity enum value from various input types
 */
export const ensureCardRarity = (value: unknown): CardRarity => {
  if (typeof value === 'string') {
    return stringToCardRarity(value);
  }
  
  if (value && Object.values(CardRarity).includes(value as CardRarity)) {
    return value as CardRarity;
  }
  
  return CardRarity.COMMON;
};

/**
 * Interface for card edition information with type discriminator
 */
export interface CardEdition {
  number: number;
  total: number;
}

/**
 * Type guard to check if an object is a CardEdition
 */
export const isCardEdition = (edition: any): edition is CardEdition => {
  return edition && 
    typeof edition === 'object' && 
    typeof edition.number === 'number' && 
    typeof edition.total === 'number';
};

/**
 * Convert any edition format to the CardEdition object format
 */
export const toCardEdition = (edition: number | CardEdition | undefined): CardEdition => {
  if (!edition) {
    return { number: 1, total: 1 };
  }
  
  if (typeof edition === 'number') {
    return { number: edition, total: 1 };
  }
  
  return edition;
};

/**
 * Convert CardEdition object to a simple number (for EnhancedCard)
 */
export const toEditionNumber = (edition: CardEdition | number | undefined): number => {
  if (!edition) {
    return 1;
  }
  
  if (typeof edition === 'number') {
    return edition;
  }
  
  return edition.number;
};
