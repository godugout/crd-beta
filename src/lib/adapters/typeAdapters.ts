
import { Card as IndexCard } from '@/lib/types/index';
import { Card as CardTypesCard } from '@/lib/types/cardTypes';
import { DesignMetadata, CardStyle, TextStyle, CardMetadata, MarketMetadata } from '@/lib/types/cardTypes';

// Default values for design metadata
const DEFAULT_CARD_STYLE: CardStyle = {
  template: 'classic',
  effect: 'classic',
  borderRadius: '8px',
  borderColor: '#000000',
  shadowColor: '#000000',
  frameWidth: 5,
  frameColor: '#000000',
};

const DEFAULT_TEXT_STYLE: TextStyle = {
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333',
};

const DEFAULT_CARD_METADATA: CardMetadata = {
  category: 'default',
  series: 'default',
  cardType: 'standard',
};

const DEFAULT_MARKET_METADATA: MarketMetadata = {
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false,
};

// Convert from index.Card to cardTypes.Card
export function convertIndexCardToCardTypesCard(indexCard: IndexCard): CardTypesCard {
  const designMetadata: DesignMetadata = {
    cardStyle: DEFAULT_CARD_STYLE,
    textStyle: DEFAULT_TEXT_STYLE,
    cardMetadata: DEFAULT_CARD_METADATA,
    marketMetadata: DEFAULT_MARKET_METADATA,
    ...indexCard.designMetadata,
  };
  
  // Ensure required properties are present
  if (!designMetadata.cardStyle) designMetadata.cardStyle = DEFAULT_CARD_STYLE;
  if (!designMetadata.textStyle) designMetadata.textStyle = DEFAULT_TEXT_STYLE;
  if (!designMetadata.cardMetadata) designMetadata.cardMetadata = DEFAULT_CARD_METADATA;
  if (!designMetadata.marketMetadata) designMetadata.marketMetadata = DEFAULT_MARKET_METADATA;
  
  return {
    id: indexCard.id,
    title: indexCard.title,
    description: indexCard.description,
    imageUrl: indexCard.imageUrl,
    thumbnailUrl: indexCard.thumbnailUrl,
    tags: indexCard.tags,
    userId: indexCard.userId,
    teamId: indexCard.teamId,
    collectionId: indexCard.collectionId,
    isPublic: indexCard.isPublic,
    createdAt: indexCard.createdAt,
    updatedAt: indexCard.updatedAt,
    effects: indexCard.effects,
    designMetadata,
    rarity: indexCard.rarity,
    reactions: indexCard.reactions,
    player: indexCard.player,
    team: indexCard.team,
    year: indexCard.year,
    artist: indexCard.artist,
    set: indexCard.set,
    stats: indexCard.stats,
  };
}

// Convert from cardTypes.Card to index.Card
export function convertCardTypesCardToIndexCard(cardTypesCard: CardTypesCard): IndexCard {
  return {
    id: cardTypesCard.id,
    title: cardTypesCard.title,
    description: cardTypesCard.description,
    imageUrl: cardTypesCard.imageUrl,
    thumbnailUrl: cardTypesCard.thumbnailUrl,
    tags: cardTypesCard.tags,
    userId: cardTypesCard.userId,
    teamId: cardTypesCard.teamId,
    collectionId: cardTypesCard.collectionId,
    isPublic: cardTypesCard.isPublic !== undefined ? cardTypesCard.isPublic : true,
    createdAt: cardTypesCard.createdAt,
    updatedAt: cardTypesCard.updatedAt,
    effects: cardTypesCard.effects,
    designMetadata: cardTypesCard.designMetadata,
    rarity: cardTypesCard.rarity,
    reactions: cardTypesCard.reactions,
    player: cardTypesCard.player,
    team: cardTypesCard.team,
    year: cardTypesCard.year,
    artist: cardTypesCard.artist,
    set: cardTypesCard.set,
    stats: cardTypesCard.stats,
  };
}
