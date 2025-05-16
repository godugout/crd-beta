
import { Card } from '../types/cardTypes';

/**
 * A type that extends Card with optional legacy properties
 */
export interface CardWithLegacyProps extends Card {
  artist?: string;
  set?: string;
  rarity?: string;
  cardNumber?: string;
  condition?: string;
  estimatedValue?: string;
  [key: string]: any;
}

/**
 * Adapts a card to include legacy properties that might be needed by older components
 * @param card The card to adapt
 * @returns A card with legacy properties
 */
export function adaptCardForDetailPanel(card: Card): CardWithLegacyProps {
  // Start with the original card
  const adaptedCard: CardWithLegacyProps = { ...card };
  
  // Add artist if not present
  if (!adaptedCard.artist) {
    adaptedCard.artist = card.designMetadata?.cardMetadata?.artist || '';
  }
  
  // Add set if not present
  if (!adaptedCard.set) {
    adaptedCard.set = card.designMetadata?.cardMetadata?.series || 
                      card.designMetadata?.cardMetadata?.set || '';
  }
  
  // Add rarity if not present
  if (!adaptedCard.rarity) {
    adaptedCard.rarity = card.designMetadata?.cardMetadata?.rarity || 'common';
  }
  
  return adaptedCard;
}

/**
 * Gets the appropriate property value from a card, checking multiple possible locations
 * @param card The card to check
 * @param propertyName The name of the property to retrieve
 * @param defaultValue Optional default value if property doesn't exist
 * @returns The property value or the default value
 */
export function getCardProperty(
  card: Card, 
  propertyName: string, 
  defaultValue: any = ''
): any {
  // Check direct properties first
  if (card[propertyName as keyof Card] !== undefined) {
    return card[propertyName as keyof Card];
  }
  
  // Check nested properties in designMetadata.cardMetadata
  if (card.designMetadata?.cardMetadata?.[propertyName] !== undefined) {
    return card.designMetadata.cardMetadata[propertyName];
  }
  
  // Check other common locations
  if (card.designMetadata?.[propertyName as keyof typeof card.designMetadata] !== undefined) {
    return card.designMetadata[propertyName as keyof typeof card.designMetadata];
  }
  
  // Return the default value if not found
  return defaultValue;
}
