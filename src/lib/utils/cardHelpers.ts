
import { Card } from '@/lib/types';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

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
 * Safely get card property value, handling undefined and null values
 */
export function getCardProperty<T>(card: Card | undefined | null, property: keyof Card, defaultValue: T): T {
  if (!card) return defaultValue;
  
  const value = card[property];
  return (value === undefined || value === null) ? defaultValue : (value as unknown as T);
}
