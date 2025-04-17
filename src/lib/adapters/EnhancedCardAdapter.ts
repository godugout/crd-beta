
import { Card } from '@/lib/types';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';

/**
 * Adapts a standard Card to an EnhancedCard format
 * @param card Standard Card to convert
 * @returns An EnhancedCard with all necessary properties
 */
export const adaptToEnhancedCard = (card: Card): EnhancedCard => {
  return {
    ...card,
    views: 0,
    likes: 0,
    shares: 0
  };
};

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
