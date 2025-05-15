
import { Card as CardType } from '@/lib/types/cardTypes';
import { CardData } from '@/types/card';

/**
 * Adapts a Card from the internal type to the schema expected by components
 */
export const adaptCardToSchema = (card: CardType): CardData => {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',  // Ensure description is not undefined
    imageUrl: card.imageUrl || card.image || '', // Handle both imageUrl and legacy image property
    thumbnailUrl: card.thumbnailUrl,
    tags: card.tags || [],
    player: card.player,
    team: card.team,
    year: card.year,
    effects: card.effects || [],
    designMetadata: card.designMetadata || {
      cardStyle: {},
      textStyle: {},
      cardMetadata: {},
      marketMetadata: {}
    },
    userId: card.userId || '',
    createdAt: card.createdAt,
    updatedAt: card.updatedAt
  };
};

/**
 * Adapts multiple cards from internal types to the schema expected by components
 */
export const adaptCardsToSchema = (cards: CardType[]): CardData[] => {
  return cards.map(adaptCardToSchema);
};

export default {
  adaptCardToSchema,
  adaptCardsToSchema
};
