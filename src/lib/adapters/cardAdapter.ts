import { Card as CardTypeCard } from '@/lib/types/cardTypes';
import { Card as CardCard } from '@/lib/types/card';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

/**
 * Adapts a card from one format to another
 */
export const adaptToCard = (sourceCard: Partial<CardTypeCard>): CardCard => {
  return {
    id: sourceCard.id || crypto.randomUUID(),
    title: sourceCard.title || '',
    description: sourceCard.description || '',
    imageUrl: sourceCard.imageUrl || '',
    thumbnailUrl: sourceCard.thumbnailUrl || '',
    tags: sourceCard.tags || [],
    createdAt: sourceCard.createdAt || new Date().toISOString(),
    updatedAt: sourceCard.updatedAt || new Date().toISOString(),
    userId: sourceCard.userId || '',
    effects: sourceCard.effects || [],
    designMetadata: sourceCard.designMetadata || DEFAULT_DESIGN_METADATA,
    // Include other properties as needed
  };
};

/**
 * Adapts a card to legacy format
 */
export const adaptToLegacyCard = (card: Partial<CardCard>): CardTypeCard => {
  return {
    id: card.id || crypto.randomUUID(),
    title: card.title || '',
    description: card.description || '',
    imageUrl: card.imageUrl || '',
    thumbnailUrl: card.thumbnailUrl || '',
    tags: card.tags || [],
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    userId: card.userId || '',
    effects: card.effects || [],
    designMetadata: card.designMetadata || DEFAULT_DESIGN_METADATA,
  };
};
