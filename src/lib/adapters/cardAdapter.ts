
import { Card } from '../types/cardTypes';
import { Card as LegacyCard } from '../types/card';

/**
 * Adapts a card from the legacy format to the new format
 * @param legacyCard The legacy format card
 * @returns A card in the new format
 */
export function adaptToCard(legacyCard: LegacyCard): Card {
  return {
    id: legacyCard.id,
    title: legacyCard.title,
    description: legacyCard.description || '',
    imageUrl: legacyCard.imageUrl,
    thumbnailUrl: legacyCard.thumbnailUrl,
    tags: legacyCard.tags || [],
    createdAt: legacyCard.createdAt,
    updatedAt: legacyCard.updatedAt,
    userId: legacyCard.userId || legacyCard.creatorId,
    player: legacyCard.player,
    team: legacyCard.team,
    year: legacyCard.year,
    isPublic: legacyCard.isPublic,
    designMetadata: legacyCard.designMetadata,
    effects: legacyCard.effects || [],
    rarity: legacyCard.rarity
  };
}

/**
 * Adapts a card from the new format to the legacy format
 * @param card The new format card
 * @returns A card in the legacy format
 */
export function adaptFromCard(card: Card): LegacyCard {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    imageUrl: card.imageUrl,
    thumbnailUrl: card.thumbnailUrl || card.imageUrl,
    tags: card.tags || [],
    userId: card.userId || '',
    effects: card.effects || [],
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    player: card.player,
    team: card.team,
    year: card.year,
    cardNumber: card.cardNumber,
    set: card.set,
    cardType: card.cardType,
    artist: card.artist,
    designMetadata: card.designMetadata || {
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
        editionNumber: 0,
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false
      }
    }
  };
}
