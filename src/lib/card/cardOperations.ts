
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

/**
 * Create a new card with default properties
 * @param cardData Partial card data
 * @returns The newly created card
 */
export const createCard = (cardData: Partial<Card>): Card => {
  const timestamp = new Date().toISOString();
  
  const newCard: Card = {
    id: cardData.id || uuidv4(),
    title: cardData.title || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    tags: cardData.tags || [],
    userId: cardData.userId || 'anonymous',
    teamId: cardData.teamId,
    collectionId: cardData.collectionId,
    isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
    createdAt: timestamp,
    updatedAt: timestamp,
    effects: cardData.effects || [],
    designMetadata: cardData.designMetadata || {},
    rarity: cardData.rarity || 'common',
  };
  
  return newCard;
};

/**
 * Update an existing card
 * @param id Card ID
 * @param updates Card updates
 * @param cards Current cards array
 * @returns Updated cards array
 */
export const updateCard = (id: string, updates: Partial<Card>, cards: Card[]): Card[] => {
  const cardIndex = cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    throw new Error(`Card with ID ${id} not found`);
  }
  
  // Create a new card with updated properties
  const updatedCard: Card = {
    ...cards[cardIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Create a new array with the updated card
  return [
    ...cards.slice(0, cardIndex),
    updatedCard,
    ...cards.slice(cardIndex + 1)
  ];
};

/**
 * Delete a card
 * @param id Card ID
 * @param cards Current cards array
 * @returns Updated cards array without the deleted card
 */
export const deleteCard = (id: string, cards: Card[]): Card[] => {
  const cardIndex = cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    throw new Error(`Card with ID ${id} not found`);
  }
  
  return cards.filter(card => card.id !== id);
};

/**
 * Add a card to a collection
 * @param cardId Card ID
 * @param collectionId Collection ID
 * @param cards Current cards array
 * @param collections Current collections array
 * @returns Object with updated cards and collections
 */
export const addCardToCollection = (
  cardId: string,
  collectionId: string,
  cards: Card[],
  collections: any[]
) => {
  const cardIndex = cards.findIndex(card => card.id === cardId);
  const collectionIndex = collections.findIndex(collection => collection.id === collectionId);
  
  if (cardIndex === -1) {
    throw new Error(`Card with ID ${cardId} not found`);
  }
  
  if (collectionIndex === -1) {
    throw new Error(`Collection with ID ${collectionId} not found`);
  }
  
  // Update the card with the collection ID
  const updatedCards = updateCard(cardId, { collectionId }, cards);
  
  // Update the collection's cardIds array
  const updatedCollections = [...collections];
  if (!updatedCollections[collectionIndex].cardIds) {
    updatedCollections[collectionIndex].cardIds = [];
  }
  
  if (!updatedCollections[collectionIndex].cardIds.includes(cardId)) {
    updatedCollections[collectionIndex].cardIds = [
      ...updatedCollections[collectionIndex].cardIds,
      cardId
    ];
  }
  
  return { updatedCards, updatedCollections };
};

/**
 * Remove a card from a collection
 * @param cardId Card ID
 * @param collectionId Collection ID
 * @param cards Current cards array
 * @param collections Current collections array
 * @returns Object with updated cards and collections
 */
export const removeCardFromCollection = (
  cardId: string,
  collectionId: string,
  cards: Card[],
  collections: any[]
) => {
  const cardIndex = cards.findIndex(card => card.id === cardId);
  const collectionIndex = collections.findIndex(collection => collection.id === collectionId);
  
  if (cardIndex === -1) {
    throw new Error(`Card with ID ${cardId} not found`);
  }
  
  if (collectionIndex === -1) {
    throw new Error(`Collection with ID ${collectionId} not found`);
  }
  
  // Update the card to remove the collection ID
  const updatedCards = updateCard(cardId, { collectionId: undefined }, cards);
  
  // Update the collection's cardIds array
  const updatedCollections = [...collections];
  if (updatedCollections[collectionIndex].cardIds) {
    updatedCollections[collectionIndex].cardIds = updatedCollections[collectionIndex].cardIds.filter(
      id => id !== cardId
    );
  }
  
  return { updatedCards, updatedCollections };
};
