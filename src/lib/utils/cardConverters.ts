
import { Card, CardRarity } from '@/lib/types';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { adaptToEnhancedCard } from '@/lib/adapters/EnhancedCardAdapter';
import { toCardEdition, toEditionNumber, ensureCardRarity } from '@/lib/utils/CardRarityUtils';

/**
 * Convert EnhancedCard to standard Card format
 * Handles the edition property conversion
 */
export const enhancedCardToCard = (enhancedCard: EnhancedCard): Card => {
  // Convert edition from number to {number, total} object
  const edition = typeof enhancedCard.edition === 'number' 
    ? { number: enhancedCard.edition, total: enhancedCard.editionSize || 1 } 
    : enhancedCard.edition;
  
  // Ensure rarity is proper enum value
  const rarity = ensureCardRarity(enhancedCard.rarity);
  
  // Use the standard adapter but override the edition format
  return adaptToCard({
    ...enhancedCard,
    edition,
    rarity
  });
};

/**
 * Convert Card to EnhancedCard format
 * For backwards compatibility with existing code
 */
export const cardToEnhancedCard = (card: Card): EnhancedCard => {
  // Convert edition from {number, total} object to number
  const editionNumber = toEditionNumber(card.edition);
  
  // Ensure rarity is proper enum value
  const rarity = ensureCardRarity(card.rarity);
  
  return {
    ...adaptToEnhancedCard(card),
    edition: editionNumber,
    rarity
  };
};

/**
 * Safely convert any card-like object to standard Card format
 * Ensures all required properties are present with correct types
 */
export const toStandardCard = (cardData: any): Card => {
  // Ensure rarity is the correct enum type
  const rarity = ensureCardRarity(cardData.rarity);
  
  // Ensure edition is in correct format
  const edition = cardData.edition ? toCardEdition(cardData.edition) : undefined;

  // Ensure required fields are present with proper default values
  return adaptToCard({
    ...cardData,
    id: cardData.id || `card-${Date.now()}`,
    title: cardData.title || 'Untitled Card',
    rarity,
    edition,
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    description: cardData.description || '',
    effects: cardData.effects || [],
    tags: cardData.tags || [],
    isFavorite: cardData.isFavorite ?? false,
    userId: cardData.userId || 'anonymous',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || ''
  });
};
