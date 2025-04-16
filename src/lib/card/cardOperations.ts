
import { Card, Collection } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

/**
 * Creates a new card
 */
export const createCard = (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const newCard: Card = adaptToCard({
      ...card,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // In a real application, this would make an API call to create the card in the database
    return newCard;
  } catch (err: any) {
    console.error('Error creating card:', err);
    toast.error('Failed to create card: ' + err.message);
    throw err;
  }
};

/**
 * Updates an existing card
 */
export const updateCard = (id: string, updates: Partial<Card>, cards: Card[]) => {
  try {
    // Find and update the card in the local array
    const updatedCards = cards.map(card => 
      card.id === id
        ? adaptToCard({ ...card, ...updates, updatedAt: new Date().toISOString() })
        : card
    );
    
    return updatedCards;
  } catch (err: any) {
    console.error('Update card error:', err);
    toast.error('Failed to update card: ' + err.message);
    throw err;
  }
};

/**
 * Deletes a card
 */
export const deleteCard = (id: string, cards: Card[]) => {
  try {
    // Filter out the card with the given id
    const filteredCards = cards.filter(card => card.id !== id);
    
    return filteredCards;
  } catch (err: any) {
    console.error('Delete card error:', err);
    toast.error('Failed to delete card: ' + err.message);
    throw err;
  }
};

/**
 * Adds a card to a collection
 */
export const addCardToCollection = (
  cardId: string, 
  collectionId: string,
  cards: Card[],
  collections: Collection[]
) => {
  try {
    // Update card's collectionId
    const updatedCards = cards.map(card => 
      card.id === cardId 
        ? { ...card, collectionId }
        : card
    );
    
    // Find the card to add to the collection
    const cardToAdd = collections
      .flatMap(c => c.cards)
      .find(c => c.id === cardId);
    
    // If not found in collections, look in the cards array
    const cardFromState = cardToAdd || cards.find(c => c.id === cardId);
    
    // Add card to collection if found
    let updatedCollections = collections;
    if (cardFromState) {
      updatedCollections = collections.map(collection => 
        collection.id === collectionId 
          ? { 
              ...collection, 
              cards: [...collection.cards.filter(c => c.id !== cardId), {...cardFromState, collectionId}]
            } 
          : collection
      );
    }
    
    return { updatedCards, updatedCollections };
  } catch (err: any) {
    console.error('Add card to collection error:', err);
    toast.error('Failed to add card to collection: ' + err.message);
    throw err;
  }
};

/**
 * Removes a card from a collection
 */
export const removeCardFromCollection = (
  cardId: string, 
  collectionId: string,
  cards: Card[],
  collections: Collection[]
) => {
  try {
    // Update card's collectionId
    const updatedCards = cards.map(card => 
      card.id === cardId 
        ? { ...card, collectionId: undefined }
        : card
    );
    
    // Remove card from collection
    const updatedCollections = collections.map(collection => 
      collection.id === collectionId 
        ? { 
            ...collection, 
            cards: collection.cards.filter(card => card.id !== cardId)
          } 
        : collection
    );
    
    return { updatedCards, updatedCollections };
  } catch (err: any) {
    console.error('Remove card from collection error:', err);
    toast.error('Failed to remove card from collection: ' + err.message);
    throw err;
  }
};
