
import { useState, useCallback, useEffect } from 'react';
import { CardData } from '@/types/card';
import { v4 as uuidv4 } from 'uuid';

export interface CardOperations {
  cards: CardData[];
  isLoading: boolean;
  error: string | null;
  getCardById: (id: string) => CardData | undefined;
  addCard: (card: Omit<CardData, 'id' | 'createdAt' | 'updatedAt'>) => CardData;
  updateCard: (id: string, updates: Partial<CardData>) => void;
  deleteCard: (id: string) => void;
}

/**
 * Central hook for card operations
 */
export function useCardSystem(): CardOperations {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load cards from localStorage on initial render
  useEffect(() => {
    const loadCards = () => {
      try {
        setIsLoading(true);
        const savedCards = localStorage.getItem('cards');
        if (savedCards) {
          setCards(JSON.parse(savedCards));
        }
      } catch (err) {
        console.error('Error loading cards from storage:', err);
        setError('Failed to load cards from storage');
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, []);

  // Update localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const getCardById = useCallback((id: string): CardData | undefined => {
    return cards.find(card => card.id === id);
  }, [cards]);

  const addCard = useCallback((card: Omit<CardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newCard: CardData = {
      ...card,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    setCards(prevCards => [...prevCards, newCard]);
    return newCard;
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<CardData>) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id
          ? { ...card, ...updates, updatedAt: new Date().toISOString() }
          : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  }, []);

  return {
    cards,
    isLoading,
    error,
    getCardById,
    addCard,
    updateCard,
    deleteCard,
  };
}

/**
 * Simplified hook for card list operations
 */
export function useCards() {
  return useCardSystem();
}
