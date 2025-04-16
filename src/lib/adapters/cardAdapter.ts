
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
    // Ensure designMetadata is always present with complete structure
    designMetadata: data.designMetadata ? {
      cardStyle: {
        template: data.designMetadata.cardStyle?.template || DEFAULT_DESIGN_METADATA.cardStyle.template,
        effect: data.designMetadata.cardStyle?.effect || DEFAULT_DESIGN_METADATA.cardStyle.effect,
        borderRadius: data.designMetadata.cardStyle?.borderRadius || DEFAULT_DESIGN_METADATA.cardStyle.borderRadius,
        borderColor: data.designMetadata.cardStyle?.borderColor || DEFAULT_DESIGN_METADATA.cardStyle.borderColor,
        frameColor: data.designMetadata.cardStyle?.frameColor || DEFAULT_DESIGN_METADATA.cardStyle.frameColor,
        frameWidth: data.designMetadata.cardStyle?.frameWidth || DEFAULT_DESIGN_METADATA.cardStyle.frameWidth,
        shadowColor: data.designMetadata.cardStyle?.shadowColor || DEFAULT_DESIGN_METADATA.cardStyle.shadowColor,
        ...data.designMetadata.cardStyle
      },
      textStyle: {
        titleColor: data.designMetadata.textStyle?.titleColor || DEFAULT_DESIGN_METADATA.textStyle.titleColor,
        titleAlignment: data.designMetadata.textStyle?.titleAlignment || DEFAULT_DESIGN_METADATA.textStyle.titleAlignment,
        titleWeight: data.designMetadata.textStyle?.titleWeight || DEFAULT_DESIGN_METADATA.textStyle.titleWeight,
        descriptionColor: data.designMetadata.textStyle?.descriptionColor || DEFAULT_DESIGN_METADATA.textStyle.descriptionColor,
        ...data.designMetadata.textStyle
      },
      cardMetadata: {
        category: data.designMetadata.cardMetadata?.category || DEFAULT_DESIGN_METADATA.cardMetadata.category,
        cardType: data.designMetadata.cardMetadata?.cardType || DEFAULT_DESIGN_METADATA.cardMetadata.cardType,
        series: data.designMetadata.cardMetadata?.series || DEFAULT_DESIGN_METADATA.cardMetadata.series,
        ...data.designMetadata.cardMetadata
      },
      marketMetadata: {
        isPrintable: data.designMetadata.marketMetadata?.isPrintable ?? DEFAULT_DESIGN_METADATA.marketMetadata.isPrintable,
        isForSale: data.designMetadata.marketMetadata?.isForSale ?? DEFAULT_DESIGN_METADATA.marketMetadata.isForSale,
        includeInCatalog: data.designMetadata.marketMetadata?.includeInCatalog ?? DEFAULT_DESIGN_METADATA.marketMetadata.includeInCatalog,
        ...data.designMetadata.marketMetadata
      },
      // Preserve any other properties from the original designMetadata
      ...data.designMetadata
    } : DEFAULT_DESIGN_METADATA
  };
}

/**
 * Adapter function to convert an array of partial Card objects to complete Card objects
 */
export function adaptArrayToCards(dataArray: Array<Partial<Card>>): Card[] {
  return dataArray.map(adaptToCard);
}
