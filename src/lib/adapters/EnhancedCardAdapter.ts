
import { Card } from '@/lib/types';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { toEditionNumber } from '@/lib/utils/CardRarityUtils';

/**
 * Adapts a standard Card to an EnhancedCard format
 * @param card Standard Card to convert
 * @returns An EnhancedCard with all necessary properties
 */
export const adaptToEnhancedCard = (card: Card): EnhancedCard => {
  // Convert edition from object to number format if needed
  const editionNumber = card.edition ? toEditionNumber(card.edition) : undefined;
  
  return {
    ...card,
    edition: editionNumber,
    views: 0,
    likes: 0,
    shares: 0
  };
};

/**
 * Converts a standard Card to an EnhancedCard
 * For compatibility with existing code that uses this function name
 */
export const cardToEnhancedCard = adaptToEnhancedCard;

/**
 * Type guard to check if an object is a valid EnhancedCard
 */
export const isEnhancedCard = (obj: any): obj is EnhancedCard => {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.id === 'string' && 
    typeof obj.title === 'string' && 
    Array.isArray(obj.effects);
};
