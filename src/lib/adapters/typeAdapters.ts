
import { Card, CardRarity, Collection, DesignMetadata } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Utility function to map string rarities to enum values
export function mapRarityToEnum(rarity: string): CardRarity {
  switch (rarity.toLowerCase()) {
    case 'common':
      return CardRarity.COMMON;
    case 'uncommon':
      return CardRarity.UNCOMMON;
    case 'rare':
      return CardRarity.RARE;
    case 'ultra-rare':
      return CardRarity.ULTRA_RARE;
    case 'legendary':
      return CardRarity.LEGENDARY;
    default:
      return CardRarity.COMMON;
  }
}

// Default design metadata as a fallback
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'standard',
    effect: 'standard',
    borderRadius: '8px',
    borderColor: '#000000',
    shadowColor: '#000000',
    frameWidth: 5,
    frameColor: '#000000'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333'
  },
  cardMetadata: {
    category: 'standard',
    series: 'default',
    cardType: 'standard'
  },
  marketMetadata: {
    isPrintable: true,
    isForSale: false,
    includeInCatalog: false
  }
};

// Transform any card-like object to conform to our Card type
export function adaptCard(input: any): Card {
  const now = new Date().toISOString();
  
  let designMetadata: DesignMetadata = DEFAULT_DESIGN_METADATA;
  
  if (input.designMetadata) {
    // Ensure design metadata has all required properties
    designMetadata = {
      cardStyle: { 
        ...(DEFAULT_DESIGN_METADATA.cardStyle),
        ...(input.designMetadata.cardStyle || {}) 
      },
      textStyle: { 
        ...(DEFAULT_DESIGN_METADATA.textStyle),
        ...(input.designMetadata.textStyle || {}) 
      },
      cardMetadata: { 
        ...(DEFAULT_DESIGN_METADATA.cardMetadata),
        ...(input.designMetadata.cardMetadata || {}) 
      },
      marketMetadata: { 
        ...(DEFAULT_DESIGN_METADATA.marketMetadata),
        ...(input.designMetadata.marketMetadata || {}) 
      }
    };
    
    // Copy over any additional properties
    if (input.designMetadata.player) designMetadata.player = input.designMetadata.player;
    if (input.designMetadata.team) designMetadata.team = input.designMetadata.team;
    if (input.designMetadata.year) designMetadata.year = input.designMetadata.year;
    if (input.designMetadata.oaklandMemory) designMetadata.oaklandMemory = input.designMetadata.oaklandMemory;
    if (input.designMetadata.layers) designMetadata.layers = input.designMetadata.layers;
  }
  
  return {
    id: input.id || uuidv4(),
    title: input.title || input.name || 'Untitled Card',
    description: input.description || '',
    imageUrl: input.imageUrl || '',
    thumbnailUrl: input.thumbnailUrl || input.imageUrl || '',
    tags: input.tags || [],
    userId: input.userId || 'anonymous',
    isPublic: input.isPublic ?? true,
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
    effects: input.effects || [],
    rarity: typeof input.rarity === 'string' ? mapRarityToEnum(input.rarity) : (input.rarity || CardRarity.COMMON),
    designMetadata: designMetadata,
    teamId: input.teamId,
    collectionId: input.collectionId
  };
}

// Transform any collection-like object to conform to our Collection type
export function adaptCollection(input: any): Collection {
  const now = new Date().toISOString();
  
  return {
    id: input.id || uuidv4(),
    name: input.name || input.title || 'Untitled Collection',
    title: input.title || input.name,
    description: input.description || '',
    coverImageUrl: input.coverImageUrl || input.imageUrl || '',
    cards: input.cards ? input.cards.map(adaptCard) : [],
    cardIds: input.cardIds || [],
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
    userId: input.userId || input.ownerId || 'anonymous',
    ownerId: input.ownerId || input.userId || 'anonymous',
    visibility: input.visibility || 'private',
    allowComments: input.allowComments ?? true,
    designMetadata: input.designMetadata || {},
    tags: input.tags || []
  };
}

// Ensure a card has all necessary fields for display
export function ensureValidCard(card: any): Card {
  if (!card) {
    return createDefaultCard();
  }
  
  return adaptCard(card);
}

// Create a default card when none is provided
export function createDefaultCard(): Card {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    title: 'Sample Card',
    description: 'This is a placeholder card',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
    tags: ['sample', 'placeholder'],
    userId: 'anonymous',
    isPublic: true,
    createdAt: now,
    updatedAt: now,
    effects: [],
    rarity: CardRarity.COMMON,
    designMetadata: DEFAULT_DESIGN_METADATA
  };
}
