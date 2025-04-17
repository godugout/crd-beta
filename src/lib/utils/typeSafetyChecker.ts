
/**
 * Utility functions for type safety and validation
 * This centralizes type checking and validation throughout the app
 */

import { Card, CardRarity } from '@/lib/types';
import { isCard, isCollection, isUser, isOaklandMemoryData } from './typeGuards';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

/**
 * Safely validates and transforms a card object
 * Useful when receiving cards from APIs or user input
 * 
 * @param possibleCard Object that might be a valid card
 * @returns A validated Card object or null if invalid
 */
export const validateCard = (possibleCard: unknown): Card | null => {
  if (!possibleCard || typeof possibleCard !== 'object') {
    return null;
  }
  
  try {
    // Try to adapt the object to a proper Card
    const card = adaptToCard(possibleCard as Partial<Card>);
    
    // Perform additional validation beyond type checking
    if (!card.id || !card.title) {
      return null;
    }
    
    return card;
  } catch (error) {
    console.error('Failed to validate card:', error);
    return null;
  }
};

/**
 * Checks if a value is a valid CardRarity enum value
 * 
 * @param value Value to check
 * @returns Boolean indicating if the value is a valid CardRarity
 */
export const isValidCardRarity = (value: unknown): value is CardRarity => {
  if (typeof value !== 'string') return false;
  
  return Object.values(CardRarity).includes(value as CardRarity);
};

/**
 * Safely gets card rarity or returns a default
 * 
 * @param rarity Possible rarity value
 * @param defaultRarity Default rarity to use if invalid
 * @returns Valid CardRarity value
 */
export const getCardRarity = (
  rarity: unknown, 
  defaultRarity: CardRarity = CardRarity.COMMON
): CardRarity => {
  if (isValidCardRarity(rarity)) return rarity;
  
  if (typeof rarity === 'string') {
    const normalized = rarity.toLowerCase();
    
    switch (normalized) {
      case 'common': return CardRarity.COMMON;
      case 'uncommon': return CardRarity.UNCOMMON;
      case 'rare': return CardRarity.RARE;
      case 'ultra-rare': 
      case 'ultra_rare': return CardRarity.ULTRA_RARE;
      case 'legendary': return CardRarity.LEGENDARY;
      case 'mythic': return CardRarity.MYTHIC;
      case 'one-of-one': 
      case 'one_of_one': return CardRarity.ONE_OF_ONE;
      default: return defaultRarity;
    }
  }
  
  return defaultRarity;
};
