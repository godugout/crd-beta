
import { Card } from '@/types/card';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { toast } from 'sonner';

/**
 * Service for card data operations
 * Handles persistence and retrieval of card data
 */
export class CardService {
  private storageKey = 'cardshow_cards';
  
  /**
   * Get all cards from storage
   */
  async getAllCards(): Promise<Card[]> {
    try {
      const storedCards = localStorage.getItem(this.storageKey);
      if (!storedCards) return [];
      
      const cards: Partial<Card>[] = JSON.parse(storedCards);
      return cards.map(adaptToCard);
    } catch (error) {
      console.error('Failed to get cards:', error);
      toast.error('Failed to load cards');
      return [];
    }
  }
  
  /**
   * Get a card by ID
   */
  async getCardById(id: string): Promise<Card | null> {
    try {
      const cards = await this.getAllCards();
      return cards.find(card => card.id === id) || null;
    } catch (error) {
      console.error(`Failed to get card ${id}:`, error);
      toast.error('Failed to load card');
      return null;
    }
  }
  
  /**
   * Save a new card
   */
  async saveCard(card: Card): Promise<Card> {
    try {
      const cards = await this.getAllCards();
      const updatedCards = [...cards, card];
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedCards));
      toast.success('Card saved successfully');
      return card;
    } catch (error) {
      console.error('Failed to save card:', error);
      toast.error('Failed to save card');
      throw error;
    }
  }
  
  /**
   * Update an existing card
   */
  async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    try {
      const cards = await this.getAllCards();
      const cardIndex = cards.findIndex(c => c.id === id);
      
      if (cardIndex === -1) {
        throw new Error(`Card ${id} not found`);
      }
      
      const updatedCard = {
        ...cards[cardIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      cards[cardIndex] = updatedCard;
      localStorage.setItem(this.storageKey, JSON.stringify(cards));
      
      toast.success('Card updated successfully');
      return updatedCard;
    } catch (error) {
      console.error(`Failed to update card ${id}:`, error);
      toast.error('Failed to update card');
      throw error;
    }
  }
  
  /**
   * Delete a card
   */
  async deleteCard(id: string): Promise<void> {
    try {
      const cards = await this.getAllCards();
      const filteredCards = cards.filter(card => card.id !== id);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredCards));
      toast.success('Card deleted successfully');
    } catch (error) {
      console.error(`Failed to delete card ${id}:`, error);
      toast.error('Failed to delete card');
      throw error;
    }
  }
}

// Create and export default instance
export const cardService = new CardService();

export default cardService;
