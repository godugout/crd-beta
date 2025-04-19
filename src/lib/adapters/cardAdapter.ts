
import { Card } from '@/lib/types/cardTypes';
import { Card as SchemaCard } from '@/lib/schema/types';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

/**
 * Adapts different card types to ensure compatibility
 */
export function adaptToCard(partialCard: Partial<Card>): Card {
  // Ensure all required fields have default values
  return {
    id: partialCard.id || '',
    title: partialCard.title || '',
    description: partialCard.description || '',
    imageUrl: partialCard.imageUrl || '',
    thumbnailUrl: partialCard.thumbnailUrl || '',
    tags: partialCard.tags || [],
    userId: partialCard.userId || '',
    effects: partialCard.effects || [],
    createdAt: partialCard.createdAt || new Date().toISOString(),
    updatedAt: partialCard.updatedAt || new Date().toISOString(),
    designMetadata: partialCard.designMetadata || DEFAULT_DESIGN_METADATA,
    // Include other properties if present
    ...partialCard
  };
}

/**
 * Convert EnhancedCard to Card
 */
export function enhancedCardToBaseCard(enhancedCard: EnhancedCard): Card {
  return {
    id: enhancedCard.id,
    title: enhancedCard.title,
    description: enhancedCard.description,
    imageUrl: enhancedCard.imageUrl,
    thumbnailUrl: enhancedCard.thumbnailUrl || enhancedCard.imageUrl,
    tags: enhancedCard.tags || [],
    userId: enhancedCard.userId,
    effects: enhancedCard.effects,
    createdAt: enhancedCard.createdAt,
    updatedAt: enhancedCard.updatedAt,
    teamId: enhancedCard.teamId,
    designMetadata: enhancedCard.designMetadata,
    // Add other fields that BaseCard might need
    artist: enhancedCard.artist,
    rarity: enhancedCard.rarity,
    cardNumber: enhancedCard.cardNumber,
    backImageUrl: undefined,
    isPublic: true,
  };
}

/**
 * Convert schema card to base card
 */
export function schemaCardToBaseCard(schemaCard: SchemaCard): Card {
  return {
    id: schemaCard.id,
    title: schemaCard.title,
    description: schemaCard.description || '',
    imageUrl: schemaCard.imageUrl,
    thumbnailUrl: schemaCard.thumbnailUrl || schemaCard.imageUrl,
    tags: schemaCard.tags || [],
    userId: schemaCard.userId || '',
    effects: schemaCard.effects || [],
    createdAt: schemaCard.createdAt,
    updatedAt: schemaCard.updatedAt,
    isPublic: schemaCard.isPublic || false,
    designMetadata: schemaCard.designMetadata || DEFAULT_DESIGN_METADATA,
    reactions: schemaCard.reactions || []
  };
}
