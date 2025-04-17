
import { Card } from '@/lib/types';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { cardToEnhancedCard } from '@/lib/adapters/EnhancedCardAdapter';

/**
 * Convert a string card id to a minimal Card object
 * Useful for cases where a function expects a Card but only an ID is available
 */
export function cardIdToCard(cardId: string): Card {
  return adaptToCard({
    id: cardId,
    title: 'Card',
    imageUrl: '',
    effects: []
  });
}

/**
 * Convert a string card id to a minimal EnhancedCard object
 * Useful for cases where a function expects an EnhancedCard but only an ID is available
 */
export function cardIdToEnhancedCard(cardId: string): EnhancedCard {
  const baseCard = cardIdToCard(cardId);
  return cardToEnhancedCard(baseCard);
}

/**
 * Ensures that a value is a Card object
 * If it's a string (card ID), converts it to a minimal Card object
 */
export function ensureCard(cardOrId: Card | string): Card {
  if (typeof cardOrId === 'string') {
    return cardIdToCard(cardOrId);
  }
  return cardOrId;
}

/**
 * Ensures that a value is an EnhancedCard object
 * If it's a string (card ID), converts it to a minimal EnhancedCard object
 */
export function ensureEnhancedCard(cardOrIdOrEnhanced: EnhancedCard | Card | string): EnhancedCard {
  if (typeof cardOrIdOrEnhanced === 'string') {
    return cardIdToEnhancedCard(cardOrIdOrEnhanced);
  }
  
  if ('views' in cardOrIdOrEnhanced && 'likes' in cardOrIdOrEnhanced) {
    return cardOrIdOrEnhanced as EnhancedCard;
  }
  
  return cardToEnhancedCard(cardOrIdOrEnhanced);
}

/**
 * Safely get card property value, handling undefined and null values
 */
export function getCardProperty<T>(card: Card | undefined | null, property: keyof Card, defaultValue: T): T {
  if (!card) return defaultValue;
  
  const value = card[property];
  return (value === undefined || value === null) ? defaultValue : (value as unknown as T);
}
