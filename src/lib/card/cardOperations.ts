import { v4 as uuidv4 } from 'uuid';
import { Card, CardRarity } from '@/lib/types';
import { DesignMetadata } from '@/lib/types/cardTypes';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

export const createNewCard = (title: string, imageUrl: string): Card => {
  return adaptToCard({
    id: `card-${Date.now()}`,
    title,
    description: '',
    imageUrl,
    thumbnailUrl: imageUrl,
    tags: [],
    userId: 'user1',
    team: 'team1',
    isPublic: true,
    effects: [],
    rarity: CardRarity.COMMON,
    designMetadata: {} as DesignMetadata
  });
};

export const createCard = (cardData: Partial<Card>): Card => {
  return adaptToCard({
    id: cardData.id || uuidv4(),
    title: cardData.title || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    tags: cardData.tags || [],
    userId: cardData.userId || 'anonymous',
    team: cardData.team || '',
    isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    rarity: cardData.rarity || CardRarity.COMMON,
    effects: cardData.effects || [],
    designMetadata: cardData.designMetadata || {},
    isFavorite: cardData.isFavorite !== undefined ? cardData.isFavorite : false
  });
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
