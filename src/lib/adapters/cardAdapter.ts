
import { Card } from '../types/cardTypes';

/**
 * Adapt a card to legacy format if needed
 */
export function adaptToLegacyCard(card: any): Card {
  // Ensure the card has all required fields
  return {
    id: card.id,
    title: card.title || card.name || '',
    description: card.description || '',
    imageUrl: card.imageUrl || card.image || '',
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || '',
    tags: card.tags || [],
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    player: card.player || '',
    team: card.team || '',
    year: card.year || '',
    designMetadata: card.designMetadata || {},
    ownerId: card.ownerId || card.userId || '',
    collectionId: card.collectionId || ''
  };
}

/**
 * Convert legacy card data to new format
 */
export function adaptFromLegacyCard(legacyCard: any): Card {
  return {
    id: legacyCard.id,
    title: legacyCard.title || legacyCard.name || '',
    description: legacyCard.description || '',
    imageUrl: legacyCard.imageUrl || legacyCard.image || '',
    thumbnailUrl: legacyCard.thumbnailUrl || legacyCard.imageUrl || '',
    tags: legacyCard.tags || [],
    createdAt: legacyCard.createdAt || new Date().toISOString(),
    updatedAt: legacyCard.updatedAt || new Date().toISOString(),
    player: legacyCard.player || '',
    team: legacyCard.team || '',
    year: legacyCard.year || '',
    designMetadata: legacyCard.designMetadata || {},
    ownerId: legacyCard.ownerId || legacyCard.userId || '',
    collectionId: legacyCard.collectionId || ''
  };
}
