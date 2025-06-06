
import { Card as MainCard } from '@/lib/types/cardTypes';
import { Card as LegacyCard } from '@/types/card';

export function adaptToCard(cardData: Partial<MainCard>): MainCard {
  return {
    id: cardData.id || '',
    title: cardData.title || '',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    tags: cardData.tags || [],
    userId: cardData.userId || '',
    effects: cardData.effects || [],
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    designMetadata: cardData.designMetadata || {
      cardStyle: {
        template: 'standard',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameWidth: 2,
        frameColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.2)'
      },
      textStyle: {
        titleColor: '#000000',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'Standard',
        series: 'Base',
        cardType: 'Standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false
      }
    },
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
