
import { Card, Collection } from '@/lib/types';
import { toast } from 'sonner';
import { collectionOperations } from '@/lib/supabase';

/**
 * Adds a card to a collection
 */
export const addCardToCollection = async (
  cardId: string, 
  collectionId: string,
  collections: Collection[],
  cards: Card[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>
) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const { error } = await collectionOperations.addCardToCollection(cardId, collectionId);
    
    if (error) {
      setError(error.message);
      toast.error('Failed to add card to collection: ' + error.message);
      return;
    }
    
    // Update card's collectionId
    setCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, collectionId }
          : card
      )
    );
    
    // Find the card to add to the collection
    const cardToAdd = collections
      .flatMap(c => c.cards)
      .find(c => c.id === cardId);
    
    // If not found in collections, look in the cards array
    const cardFromState = cardToAdd || cards.find(c => c.id === cardId);
    
    // Add card to collection if found
    if (cardFromState) {
      setCollections(prev => 
        prev.map(collection => 
          collection.id === collectionId 
            ? { 
                ...collection, 
                cards: [...collection.cards.filter(c => c.id !== cardId), {...cardFromState, collectionId}]
              } 
            : collection
        )
      );
    }
    
    toast.success('Card added to collection');
  } catch (err: any) {
    console.error('Add card to collection error:', err);
    setError(err.message || 'Failed to add card to collection');
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};

/**
 * Removes a card from a collection
 */
export const removeCardFromCollection = async (
  cardId: string, 
  collectionId: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>
) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const { error } = await collectionOperations.removeCardFromCollection(cardId);
    
    if (error) {
      setError(error.message);
      toast.error('Failed to remove card from collection: ' + error.message);
      return;
    }
    
    // Update card's collectionId
    setCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, collectionId: undefined }
          : card
      )
    );
    
    // Remove card from collection
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { 
              ...collection, 
              cards: collection.cards.filter(card => card.id !== cardId)
            } 
          : collection
      )
    );
    
    toast.success('Card removed from collection');
  } catch (err: any) {
    console.error('Remove card from collection error:', err);
    setError(err.message || 'Failed to remove card from collection');
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};
