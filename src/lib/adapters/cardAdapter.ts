
import { Card } from '@/lib/types/cardTypes';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

/**
 * Card adapter function to ensure all Card objects have the required properties
 * This is useful when converting from DB records or other data sources to the Card type
 */
export function adaptToCard(data: Partial<Card>): Card {
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || '',
    tags: data.tags || [],
    userId: data.userId || '',
    collectionId: data.collectionId,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    effects: data.effects || [], // Ensure effects is always present
    reactions: data.reactions || [],
    comments: data.comments || [],
    viewCount: data.viewCount || 0,
    isPublic: data.isPublic,
    player: data.player,
    team: data.team,
    year: data.year,
    jersey: data.jersey,
    set: data.set,
    cardNumber: data.cardNumber,
    cardType: data.cardType,
    artist: data.artist, // Use artist property directly
    backgroundColor: data.backgroundColor,
    textColor: data.textColor,
    specialEffect: data.specialEffect,
    fabricSwatches: data.fabricSwatches,
    name: data.name,
    cardStyle: data.cardStyle,
    backTemplate: data.backTemplate,
    // Add creatorId from data or undefined, since it's optional in BaseCard
    creatorId: data.creatorId,
    // Ensure designMetadata is always present with default structure if not provided
    designMetadata: data.designMetadata || DEFAULT_DESIGN_METADATA
  };
}

/**
 * Adapter function to convert an array of partial Card objects to complete Card objects
 */
export function adaptArrayToCards(dataArray: Array<Partial<Card>>): Card[] {
  return dataArray.map(adaptToCard);
}
