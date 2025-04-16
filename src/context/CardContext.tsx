import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { sampleCardData } from '@/lib/data/sampleCardData';

export type { Card, Collection };

interface CardContextType {
  cards: Card[];
  collections: Collection[];
  loading: boolean;
  error: Error | null;
  getCardById: (id: string) => Card | undefined;
  fetchCards: () => Promise<void>;
  createCard: (cardData: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Loading sample card data:", sampleCardData.length, "cards");
      setCards(sampleCardData);

      const sampleCollections: Collection[] = [
        {
          id: 'collection-001',
          name: 'Sports Legends',
          description: 'A collection of legendary sports figures',
          coverImageUrl: sampleCardData[0].imageUrl,
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public',
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-001', 'card-002']
        },
        {
          id: 'collection-002',
          name: 'Vintage Collection',
          description: 'Classic cards from the past',
          coverImageUrl: sampleCardData[2].imageUrl,
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public',
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-003', 'card-004']
        },
        {
          id: 'collection-003',
          name: 'Special Editions',
          description: 'Limited and special edition cards',
          coverImageUrl: sampleCardData[4].imageUrl,
          userId: 'user-1',
          teamId: 'team-1',
          visibility: 'public',
          allowComments: true,
          isPublic: true,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          designMetadata: {},
          cardIds: ['card-005', 'card-006']
        }
      ];
      
      setCollections(sampleCollections);
      
      toast({
        title: "Cards loaded",
        description: `Loaded ${sampleCardData.length} cards with reliable images`,
        variant: "default",
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching cards:', error);
      setError(error);
      toast({
        title: 'Error fetching cards',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (cardData: Partial<Card>) => {
    try {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || sampleCardData[0].imageUrl,
        thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || sampleCardData[0].imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-1',
        teamId: 'team-1',
        collectionId: cardData.collectionId || '',
        isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
        tags: cardData.tags || [],
        designMetadata: cardData.designMetadata || {},
        effects: cardData.effects || ['Holographic']
      };
      
      setCards(prev => [newCard, ...prev]);
      
      toast({
        title: "Card created",
        description: `Created card: ${newCard.title}`,
      });
      
      return newCard;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating card:', error);
      toast({
        title: 'Error creating card',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>) => {
    try {
      setCards(prev => 
        prev.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date().toISOString() } 
            : card
        )
      );
      
      toast({
        title: "Card updated",
        description: `Updated card: ${updates.title || id}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error updating card:', error);
      toast({
        title: 'Error updating card',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      setCards(prev => prev.filter(card => card.id !== id));
      
      toast({
        title: "Card deleted",
        description: `Deleted card: ${id}`,
      });
      
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting card:', error);
      toast({
        title: 'Error deleting card',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const value = {
    cards,
    collections,
    loading,
    error,
    getCardById,
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

export const useCardContext = useCards;
