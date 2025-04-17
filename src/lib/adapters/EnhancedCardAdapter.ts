
import { Card } from '@/lib/types/card';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { adaptToCard } from './typeAdapters';

/**
 * Convert a Card to an EnhancedCard
 * This adapter ensures all required fields are properly mapped
 */
export function cardToEnhancedCard(card: Card): EnhancedCard {
  // First ensure we have a valid card
  const validCard = adaptToCard(card);
  
  // Handle the edition format difference
  let editionNumber: number;
  if (typeof validCard.edition === 'object' && validCard.edition !== null) {
    editionNumber = validCard.edition.number;
  } else {
    editionNumber = 1;
  }
  
  return {
    ...validCard,
    edition: editionNumber,
    // Add any additional required EnhancedCard properties here
    likes: 0,
    shares: 0,
    views: 0,
    cardNumber: validCard.cardNumber || `#${validCard.id.slice(-4)}`,
    seriesId: validCard.collectionId || undefined,
    // Make sure all required EnhancedCard fields are included
    artistId: validCard.artistId || '',
    artistName: validCard.creatorName || '',
    editionSize: validCard.editionSize || 1
  } as EnhancedCard;
}

/**
 * Convert an array of Cards to EnhancedCards
 */
export function cardsToEnhancedCards(cards: Card[]): EnhancedCard[] {
  return cards.map(cardToEnhancedCard);
}

/**
 * Ensure a value is an EnhancedCard
 * If it's already an EnhancedCard, it will be returned as is
 * If it's a Card, it will be converted to an EnhancedCard
 */
export function ensureEnhancedCard(cardOrEnhancedCard: Card | EnhancedCard): EnhancedCard {
  // Check if it already has EnhancedCard specific properties
  if ('views' in cardOrEnhancedCard && 'likes' in cardOrEnhancedCard && 'shares' in cardOrEnhancedCard) {
    return cardOrEnhancedCard as EnhancedCard;
  }
  return cardToEnhancedCard(cardOrEnhancedCard);
}

/**
 * Utility function to convert a card ID to a Card object
 * Used when API endpoints provide just card IDs that need to be converted to full objects
 */
export function cardIdToCard(cardId: string): Card {
  return {
    id: cardId,
    title: 'Card ' + cardId.slice(-4),
    imageUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: []
  };
}
