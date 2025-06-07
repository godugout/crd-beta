
/**
 * Legacy CardData interface for backward compatibility
 * This will be gradually migrated to use the main Card type
 */
export interface CardData {
  id: string;
  name: string;
  team: string;
  jersey: string;
  year: string;
  set: string;
  cardType: string;
  artist: string;
  backgroundColor: string;
  specialEffect: string;
  description: string;
  cardNumber: string;
  imageUrl?: string;
}
