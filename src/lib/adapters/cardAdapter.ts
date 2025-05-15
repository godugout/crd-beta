
import { Card as CardType } from '@/lib/types/cardTypes';
import { Card as SchemaCard } from '@/lib/schema/types';

export function adaptCardToSchema(card: CardType): SchemaCard {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    imageUrl: card.imageUrl,
    thumbnailUrl: card.thumbnailUrl || card.imageUrl,
    tags: card.tags || [],
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    userId: card.userId || '',
    effects: card.effects || [],
    designMetadata: card.designMetadata || {},
  };
}

export function adaptSchemaToCard(schemaCard: SchemaCard): CardType {
  return {
    id: schemaCard.id,
    title: schemaCard.title,
    description: schemaCard.description || '',
    imageUrl: schemaCard.imageUrl,
    thumbnailUrl: schemaCard.thumbnailUrl || schemaCard.imageUrl,
    tags: schemaCard.tags || [],
    createdAt: schemaCard.createdAt,
    updatedAt: schemaCard.updatedAt,
    userId: schemaCard.userId || '',
    effects: schemaCard.effects || [],
    designMetadata: schemaCard.designMetadata || {},
    player: '',
    team: '',
    year: '',
  };
}
