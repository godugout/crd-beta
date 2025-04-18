
import { supabase } from '../client';

export const cardCollectionOperations = {
  async addCardToCollection(cardId: string, collectionId: string) {
    try {
      const { error: cardError } = await supabase
        .from('cards')
        .update({ collection_id: collectionId })
        .eq('id', cardId);
      
      if (cardError) {
        return { error: cardError };
      }
      
      const { error: joinError } = await supabase
        .from('collection_cards')
        .upsert({
          collection_id: collectionId,
          card_id: cardId
        });
        
      return { error: joinError };
    } catch (err: any) {
      console.error('Error adding card to collection:', err);
      return { error: { message: 'Failed to add card to collection: ' + (err.message || 'Unknown error') } };
    }
  },

  async removeCardFromCollection(cardId: string) {
    try {
      const { error: cardError } = await supabase
        .from('cards')
        .update({ collection_id: null })
        .eq('id', cardId);
      
      if (cardError) {
        return { error: cardError };
      }
      
      const { error: joinError } = await supabase
        .from('collection_cards')
        .delete()
        .eq('card_id', cardId);
        
      return { error: joinError };
    } catch (err: any) {
      console.error('Error removing card from collection:', err);
      return { error: { message: 'Failed to remove card from collection: ' + (err.message || 'Unknown error') } };
    }
  }
};
