
import { Card } from '@/lib/types/cardTypes';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';

/**
 * Adapts an EnhancedCard to a Card, ensuring all required fields are present
 */
export const adaptEnhancedCardToCard = (enhancedCard: EnhancedCard): Card => {
  return {
    id: enhancedCard.id,
    title: enhancedCard.title,
    description: enhancedCard.description,
    imageUrl: enhancedCard.imageUrl,
    thumbnailUrl: enhancedCard.thumbnailUrl,
    tags: enhancedCard.tags, // tags is now required in EnhancedCard
    userId: enhancedCard.userId,
    effects: enhancedCard.effects,
    createdAt: enhancedCard.createdAt,
    updatedAt: enhancedCard.updatedAt,
    designMetadata: enhancedCard.designMetadata,
    // Optional fields
    artist: enhancedCard.artist,
    cardNumber: enhancedCard.cardNumber,
    rarity: enhancedCard.rarity,
    // Add any other fields from the EnhancedCard that exist in Card
  };
};

/**
 * Adapts a Card to an EnhancedCard, ensuring all required fields are present
 */
export const adaptCardToEnhancedCard = (card: Card): EnhancedCard => {
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    imageUrl: card.imageUrl,
    thumbnailUrl: card.thumbnailUrl,
    tags: card.tags,
    userId: card.userId,
    effects: card.effects,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    // EnhancedCard specific required fields
    rarity: card.rarity as any || 'common',
    designMetadata: card.designMetadata,
    // Optional fields
    artist: card.artist,
    cardNumber: card.cardNumber,
    series: card.set,
    // Add any other fields from the Card that exist in EnhancedCard
  };
};

/**
 * Adapts an array of EnhancedCards to an array of Cards
 */
export const adaptEnhancedCardsToCards = (enhancedCards: EnhancedCard[]): Card[] => {
  return enhancedCards.map(adaptEnhancedCardToCard);
};

/**
 * Adapts an array of Cards to an array of EnhancedCards
 */
export const adaptCardsToEnhancedCards = (cards: Card[]): EnhancedCard[] => {
  return cards.map(adaptCardToEnhancedCard);
};
