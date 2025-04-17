
import { Card } from '@/lib/types/card';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { adaptToCard } from './typeAdapters';

/**
 * Convert a Card to an EnhancedCard
 */
export function cardToEnhancedCard(card: Card): EnhancedCard {
  // First ensure we have a valid card
  const validCard = adaptToCard(card);
  
  // Handle the edition format difference
  let edition;
  if (typeof validCard.edition === 'object' && validCard.edition !== null) {
    edition = validCard.edition.number;
  } else {
    edition = 1;
  }
  
  return {
    ...validCard,
    edition,
    views: 0,
    likes: 0,
    shares: 0
  };
}

/**
 * Convert an array of Cards to EnhancedCards
 */
export function cardsToEnhancedCards(cards: Card[]): EnhancedCard[] {
  return cards.map(cardToEnhancedCard);
}

/**
 * Ensure a value is an EnhancedCard
 */
export function ensureEnhancedCard(cardOrEnhancedCard: Card | EnhancedCard): EnhancedCard {
  if ('views' in cardOrEnhancedCard && 'likes' in cardOrEnhancedCard && 'shares' in cardOrEnhancedCard) {
    return cardOrEnhancedCard as EnhancedCard;
  }
  return cardToEnhancedCard(cardOrEnhancedCard);
}
