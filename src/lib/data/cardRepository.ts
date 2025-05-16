import { Card } from '@/lib/types/card';
import { StorageService } from '@/lib/services/storageService';
import { JsonObject } from '@/lib/types';

/**
 * Repository class for CRUD operations on cards
 */
export class CardRepository {
  private storageService: StorageService;
  
  constructor() {
    this.storageService = new StorageService();
  }
  
  /**
   * Create a new card
   * @param card The card to create
   */
  async createCard(card: Card): Promise<Card> {
    try {
      const cards = await this.getCards();
      cards.push(card);
      await this.storageService.setItem('cards', cards);
      return card;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  }
  
  /**
   * Get all cards
   */
  async getCards(): Promise<Card[]> {
    try {
      const cards = await this.storageService.getItem('cards');
      return cards ? (cards as Card[]) : [];
    } catch (error) {
      console.error('Error getting cards:', error);
      return [];
    }
  }
  
  /**
   * Get a card by ID
   * @param id The ID of the card to get
   */
  async getCardById(id: string): Promise<Card | null> {
    try {
      const cards = await this.getCards();
      return cards.find(card => card.id === id) || null;
    } catch (error) {
      console.error('Error getting card by ID:', error);
      return null;
    }
  }
  
  /**
   * Update an existing card
   * @param id The ID of the card to update
   * @param updatedCard The updated card data
   */
  async updateCard(id: string, updatedCard: Card): Promise<Card | null> {
    try {
      const cards = await this.getCards();
      const index = cards.findIndex(card => card.id === id);
      
      if (index === -1) {
        return null; // Card not found
      }
      
      cards[index] = { ...cards[index], ...updatedCard };
      await this.storageService.setItem('cards', cards);
      return cards[index];
    } catch (error) {
      console.error('Error updating card:', error);
      return null;
    }
  }
  
  /**
   * Delete a card by ID
   * @param id The ID of the card to delete
   */
  async deleteCard(id: string): Promise<boolean> {
    try {
      let cards = await this.getCards();
      cards = cards.filter(card => card.id !== id);
      await this.storageService.setItem('cards', cards);
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  }
  
  /**
   * Add a reaction to a card
   * @param cardId The ID of the card to add the reaction to
   * @param reaction The reaction to add
   */
  async addReaction(cardId: string, reaction: any): Promise<boolean> {
    try {
      const card = await this.getCardById(cardId);
      if (!card) return false;
      
      let reactions = card.reactions || [];
      reactions.push(reaction);
      
      card.reactions = reactions;
      await this.updateCard(cardId, card);
      return true;
    } catch (error) {
      console.error('Error adding reaction to card:', error);
      return false;
    }
  }
  
  /**
   * Remove a reaction from a card
   * @param cardId The ID of the card to remove the reaction from
   * @param reactionId The ID of the reaction to remove
   */
  async removeReaction(cardId: string, reactionId: string): Promise<boolean> {
    try {
      const card = await this.getCardById(cardId);
      if (!card) return false;
      
      let reactions = card.reactions || [];
      reactions = reactions.filter(reaction => reaction.id !== reactionId);
      
      card.reactions = reactions;
      await this.updateCard(cardId, card);
      return true;
    } catch (error) {
      console.error('Error removing reaction from card:', error);
      return false;
    }
  }
  
  /**
   * Add a comment to a card
   * @param cardId The ID of the card to add the comment to
   * @param comment The comment to add
   */
  async addComment(cardId: string, comment: any): Promise<boolean> {
    try {
      const card = await this.getCardById(cardId);
      if (!card) return false;
      
      let comments = card.comments || [];
      comments.push(comment);
      
      card.comments = comments;
      await this.updateCard(cardId, card);
      return true;
    } catch (error) {
      console.error('Error adding comment to card:', error);
      return false;
    }
  }
  
  /**
   * Remove a comment from a card
   * @param cardId The ID of the card to remove the comment from
   * @param commentId The ID of the comment to remove
   */
  async removeComment(cardId: string, commentId: string): Promise<boolean> {
    try {
      const card = await this.getCardById(cardId);
      if (!card) return false;
      
      let comments = card.comments || [];
      comments = comments.filter(comment => comment.id !== commentId);
      
      card.comments = comments;
      await this.updateCard(cardId, card);
      return true;
    } catch (error) {
      console.error('Error removing comment from card:', error);
      return false;
    }
  }
}
