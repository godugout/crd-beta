
import { Card as IndexCard } from '@/lib/types';
import { Card as CardTypesCard, DesignMetadata } from '@/lib/types/cardTypes';

const DEFAULT_DESIGN_METADATA: DesignMetadata = {
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

/**
 * Convert a Card from index.ts to a Card from cardTypes.ts
 */
export function convertIndexCardToCardTypesCard(indexCard: IndexCard): CardTypesCard {
  // Extract existing metadata or use defaults
  const metadata = indexCard.designMetadata || {};
  
  // Create a properly structured designMetadata object
  const designMetadata: DesignMetadata = {
    cardStyle: metadata.cardStyle || DEFAULT_DESIGN_METADATA.cardStyle,
    textStyle: metadata.textStyle || DEFAULT_DESIGN_METADATA.textStyle,
    cardMetadata: metadata.cardMetadata || DEFAULT_DESIGN_METADATA.cardMetadata,
    marketMetadata: metadata.marketMetadata || DEFAULT_DESIGN_METADATA.marketMetadata,
    // Copy any additional fields
    ...metadata
  };

  // Create the converted card
  return {
    id: indexCard.id,
    title: indexCard.title,
    description: indexCard.description,
    imageUrl: indexCard.imageUrl,
    thumbnailUrl: indexCard.thumbnailUrl,
    tags: indexCard.tags || [],
    userId: indexCard.userId,
    teamId: indexCard.teamId,
    collectionId: indexCard.collectionId,
    isPublic: indexCard.isPublic,
    createdAt: indexCard.createdAt,
    updatedAt: indexCard.updatedAt,
    effects: indexCard.effects || [],
    designMetadata: designMetadata,
    // Include other fields
    player: indexCard.player,
    team: indexCard.team,
    year: indexCard.year,
    artist: indexCard.artist,
    set: indexCard.set,
    stats: indexCard.stats,
    fabricSwatches: indexCard.fabricSwatches,
    rarity: indexCard.rarity || 'common'
  };
}

/**
 * Convert a Card from cardTypes.ts to a Card from index.ts
 */
export function convertCardTypesCardToIndexCard(cardTypesCard: CardTypesCard): IndexCard {
  return {
    id: cardTypesCard.id,
    title: cardTypesCard.title,
    description: cardTypesCard.description,
    imageUrl: cardTypesCard.imageUrl,
    thumbnailUrl: cardTypesCard.thumbnailUrl,
    tags: cardTypesCard.tags || [],
    userId: cardTypesCard.userId,
    teamId: cardTypesCard.teamId,
    collectionId: cardTypesCard.collectionId,
    isPublic: cardTypesCard.isPublic === false ? false : true, // Default to true if undefined
    createdAt: cardTypesCard.createdAt,
    updatedAt: cardTypesCard.updatedAt,
    effects: cardTypesCard.effects || [],
    designMetadata: cardTypesCard.designMetadata,
    // Include additional fields
    player: cardTypesCard.player,
    team: cardTypesCard.team,
    year: cardTypesCard.year,
    artist: cardTypesCard.artist,
    set: cardTypesCard.set,
    stats: cardTypesCard.stats,
    fabricSwatches: cardTypesCard.fabricSwatches,
    viewCount: cardTypesCard.viewCount,
    name: cardTypesCard.name || cardTypesCard.title,
    rarity: cardTypesCard.rarity || 'common'
  };
}
