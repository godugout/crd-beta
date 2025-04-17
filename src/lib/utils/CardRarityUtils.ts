
import { CardRarity } from '@/lib/types/cardTypes';

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
};
