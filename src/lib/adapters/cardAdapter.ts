
import { Card as MainCard } from '@/lib/types/cardTypes';
import { Card as LegacyCard } from '@/types/card';
import { DEFAULT_DESIGN_METADATA, FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';

export function adaptToCard(cardData: Partial<MainCard>): MainCard {
  return {
    id: cardData.id || '',
    title: cardData.title || '',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    tags: cardData.tags || [],
    userId: cardData.userId || '',
    effects: cardData.effects || [], // Ensure effects is always an array
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    designMetadata: cardData.designMetadata || DEFAULT_DESIGN_METADATA,
    ...cardData
  };
}

export function adaptToLegacyCard(cardData: MainCard): LegacyCard {
  return {
    id: cardData.id,
    title: cardData.title,
    description: cardData.description,
    imageUrl: cardData.imageUrl,
    thumbnailUrl: cardData.thumbnailUrl,
    tags: cardData.tags,
    userId: cardData.userId,
    effects: cardData.effects || [],
    createdAt: cardData.createdAt,
    updatedAt: cardData.updatedAt,
    collectionId: cardData.collectionId,
    designMetadata: cardData.designMetadata,
    metadata: cardData.metadata,
    reactions: cardData.reactions,
    comments: cardData.comments,
    viewCount: cardData.viewCount,
    isPublic: cardData.isPublic,
    player: cardData.player,
    team: cardData.team,
    year: cardData.year,
    jersey: cardData.jersey,
    set: cardData.set,
    cardNumber: cardData.cardNumber,
    cardType: cardData.cardType,
    artist: cardData.artist,
    backgroundColor: cardData.backgroundColor,
    textColor: cardData.textColor,
    specialEffect: cardData.specialEffect,
    fabricSwatches: cardData.fabricSwatches,
    name: cardData.name,
    cardStyle: cardData.cardStyle,
    backTemplate: cardData.backTemplate,
    rarity: cardData.rarity,
    teamId: cardData.teamId,
    creatorId: cardData.creatorId,
    stats: cardData.stats,
    layers: cardData.layers
  };
}

// Helper function to ensure a card has all required properties
export function ensureCardHasRequiredProps(card: Partial<MainCard>): MainCard {
  return adaptToCard({
    ...card,
    effects: card.effects || [],
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    designMetadata: {
      ...DEFAULT_DESIGN_METADATA,
      ...card.designMetadata
    }
  });
}
