
import { Card, CardRarity } from '@/lib/types';

/**
 * Adapter function to ensure an object conforms to the Card interface
 * Supplies default values for required properties if they don't exist
 */
export function adaptToCard(data: any): Card {
  // Ensure we have an object to work with
  const cardData = data || {};
  
  // Start with required properties that must be present
  const card: Card = {
    id: cardData.id || `generated-${Date.now()}`,
    title: cardData.title || cardData.name || 'Untitled Card',
    imageUrl: cardData.imageUrl || cardData.image_url || '',
    createdAt: cardData.createdAt || cardData.created_at || new Date().toISOString(),
    updatedAt: cardData.updatedAt || cardData.updated_at || new Date().toISOString(),
    effects: cardData.effects || []
  };
  
  // Add optional properties if they exist
  if (cardData.description !== undefined) card.description = cardData.description;
  if (cardData.thumbnailUrl !== undefined) card.thumbnailUrl = cardData.thumbnailUrl;
  if (cardData.collectionId !== undefined) card.collectionId = cardData.collectionId;
  if (cardData.userId !== undefined) card.userId = cardData.userId;
  if (cardData.teamId !== undefined) card.teamId = cardData.teamId;
  if (cardData.isPublic !== undefined) card.isPublic = cardData.isPublic;
  if (cardData.tags !== undefined) card.tags = cardData.tags;
  if (cardData.designMetadata !== undefined) card.designMetadata = cardData.designMetadata;
  if (cardData.reactions !== undefined) card.reactions = cardData.reactions;
  if (cardData.rarity !== undefined) card.rarity = cardData.rarity;
  
  // Player info
  if (cardData.player !== undefined) card.player = cardData.player;
  if (cardData.team !== undefined) card.team = cardData.team;
  if (cardData.year !== undefined) card.year = cardData.year;
  if (cardData.name !== undefined) card.name = cardData.name;
  
  // Favorites
  if (cardData.isFavorite !== undefined) card.isFavorite = cardData.isFavorite;
  if (cardData.stats !== undefined) card.stats = cardData.stats;
  
  // Artist and market data
  if (cardData.artistId !== undefined) card.artistId = cardData.artistId;
  if (cardData.marketData !== undefined) card.marketData = cardData.marketData;
  if (cardData.editionSize !== undefined) card.editionSize = cardData.editionSize;
  if (cardData.cardNumber !== undefined) card.cardNumber = cardData.cardNumber;
  if (cardData.price !== undefined) card.price = cardData.price;
  if (cardData.edition !== undefined) card.edition = cardData.edition;
  
  // Creator info
  if (cardData.creatorName !== undefined) card.creatorName = cardData.creatorName;
  if (cardData.creatorAvatar !== undefined) card.creatorAvatar = cardData.creatorAvatar;
  
  // Release information
  if (cardData.releaseDate !== undefined) card.releaseDate = cardData.releaseDate;
  
  // Display properties
  if (cardData.fabricSwatches !== undefined) card.fabricSwatches = cardData.fabricSwatches;
  if (cardData.isAnimated !== undefined) card.isAnimated = cardData.isAnimated;
  if (cardData.hasAudio !== undefined) card.hasAudio = cardData.hasAudio;
  if (cardData.hasInteractiveElements !== undefined) card.hasInteractiveElements = cardData.hasInteractiveElements;
  if (cardData.isInUserCollection !== undefined) card.isInUserCollection = cardData.isInUserCollection;
  
  return card;
}

/**
 * Provide an alias to adaptToCard for backward compatibility 
 */
export const adaptCard = adaptToCard;
