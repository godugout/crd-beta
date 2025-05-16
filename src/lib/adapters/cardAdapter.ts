
import { Card } from '@/lib/types/cardTypes';
import { Card as SchemaCard } from '@/lib/schema/types';

// Create default values for required properties that might be missing
const DEFAULT_DESIGN_METADATA = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameColor: '#000000',
    frameWidth: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333',
  },
  cardMetadata: {
    category: 'general',
    series: 'base',
    cardType: 'standard',
  },
  marketMetadata: {
    price: 0,
    currency: 'USD',
    availableForSale: false,
    editionSize: 0,
    editionNumber: 0
  }
};

// Adapter function to convert between card types
export const adaptCardToSchema = (card: Partial<Card>): SchemaCard => {
  return {
    id: card.id || '',
    title: card.title || 'Untitled Card',
    description: card.description || '',
    imageUrl: card.imageUrl || '',
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || '',
    tags: card.tags || [],
    userId: card.userId || '',
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    effects: card.effects || [],
    designMetadata: card.designMetadata || DEFAULT_DESIGN_METADATA
  };
};

export const adaptToCard = (schema: Partial<SchemaCard>): Card => {
  return {
    id: schema.id || '',
    title: schema.title || 'Untitled Card',
    description: schema.description || '',
    imageUrl: schema.imageUrl || '',
    thumbnailUrl: schema.thumbnailUrl || schema.imageUrl || '',
    tags: schema.tags || [],
    userId: schema.userId || '',
    createdAt: schema.createdAt || new Date().toISOString(),
    updatedAt: schema.updatedAt || new Date().toISOString(),
    effects: schema.effects || [],
    designMetadata: schema.designMetadata || DEFAULT_DESIGN_METADATA
  } as Card;
};
