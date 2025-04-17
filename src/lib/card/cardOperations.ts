import { v4 as uuidv4 } from 'uuid';
import { Card, CardRarity } from '@/lib/types';
import { DesignMetadata } from '@/lib/types/cardTypes';

export const createNewCard = (title: string, imageUrl: string): Card => {
  return {
    id: `card-${Date.now()}`,
    title,
    description: '',  // Add description
    imageUrl,
    thumbnailUrl: imageUrl,
    tags: [],
    userId: 'user1',
    team: 'team1',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rarity: CardRarity.COMMON,
    effects: [],
    isFavorite: false,  // Add isFavorite
    designMetadata: {} as DesignMetadata
  };
};

export const createCard = (cardData: Partial<Card>): Card => {
  const timestamp = new Date().toISOString();
  
  // Generate default values if not provided
  const newCard: Card = {
    id: cardData.id || uuidv4(),
    title: cardData.title || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    tags: cardData.tags || [],
    userId: cardData.userId || 'anonymous',
    team: cardData.team || '',
    isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
    createdAt: timestamp,
    updatedAt: timestamp,
    rarity: cardData.rarity || CardRarity.COMMON,
    effects: cardData.effects || [],
    designMetadata: cardData.designMetadata || {},
    isFavorite: false
  };
  
  return newCard;
};

/**
 * Update an existing card
 * @param id Card ID
 * @param updates Card updates
 * @param cards Current cards array
 */
export const updateCard = (id: string, updates: Partial<Card>, cards: Card[]): Card | null => {
  const cardIndex = cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return null;
  }
  
  // Create a new card with updated properties
  const updatedCard: Card = {
    ...cards[cardIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return updatedCard;
};

/**
 * Delete a card
 * @param id Card ID
 * @param cards Current cards array
 */
export const deleteCard = (id: string, cards: Card[]): boolean => {
  const cardIndex = cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return false;
  }
  
  return true;
};
