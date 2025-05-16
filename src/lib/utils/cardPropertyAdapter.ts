
import { CardStyle, TextStyle, CardDesignMetadata } from '../types/cardTypes';

/**
 * Normalizes card style properties to ensure compatibility between different naming conventions
 * @param style The card style to normalize
 * @returns A normalized card style with both property naming conventions
 */
export function normalizeCardStyle(style?: CardStyle): CardStyle {
  if (!style) return {};
  
  return {
    ...style,
    // Ensure both borderRadius and cornerRadius are set
    borderRadius: style.borderRadius || style.cornerRadius,
    cornerRadius: style.cornerRadius || style.borderRadius,
  };
}

/**
 * Normalizes text style properties to ensure compatibility between different naming conventions
 * @param style The text style to normalize
 * @returns A normalized text style with both property naming conventions
 */
export function normalizeTextStyle(style?: TextStyle): TextStyle {
  if (!style) return {};
  
  return {
    ...style,
    // Map properties that may have multiple names
    titleColor: style.titleColor || style.color,
    color: style.color || style.titleColor,
  };
}

/**
 * Normalizes card design metadata to ensure compatibility between different structures
 * @param metadata The design metadata to normalize
 * @returns Normalized design metadata with consistent structure
 */
export function normalizeDesignMetadata(metadata?: CardDesignMetadata): CardDesignMetadata {
  if (!metadata) {
    return {
      cardStyle: {},
      textStyle: {},
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard',
      },
      marketMetadata: {}
    };
  }
  
  return {
    ...metadata,
    cardStyle: normalizeCardStyle(metadata.cardStyle),
    textStyle: normalizeTextStyle(metadata.textStyle),
    cardMetadata: metadata.cardMetadata || {
      category: 'general',
      series: 'base',
      cardType: 'standard',
    },
    marketMetadata: metadata.marketMetadata || {}
  };
}

/**
 * Gets effects from a card, handling different storage locations
 * @param card The card to extract effects from
 * @returns Array of effect names
 */
export function getCardEffects(card: any): string[] {
  if (!card) return [];
  
  // Check all possible locations for effects
  if (Array.isArray(card.effects)) {
    return card.effects;
  }
  
  if (card.designMetadata?.effects && Array.isArray(card.designMetadata.effects)) {
    return card.designMetadata.effects;
  }
  
  if (card.designMetadata?.cardMetadata?.effects && 
      Array.isArray(card.designMetadata.cardMetadata.effects)) {
    return card.designMetadata.cardMetadata.effects;
  }
  
  return [];
}
