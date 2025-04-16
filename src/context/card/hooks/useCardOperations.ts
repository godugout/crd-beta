
import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/lib/types/card';
import { v4 as uuidv4 } from 'uuid';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

// Mock data for development
const initialCards: Card[] = [
  adaptToCard({
    id: '1',
    title: 'Sample Card',
    description: 'This is a sample card for development',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'development'],
    userId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [], // Add required effects property
  }),
];

export const useCardOperations = () => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load cards from localStorage on initial render
  useEffect(() => {
    const loadCards = () => {
      try {
        const savedCards = localStorage.getItem('cards');
        if (savedCards) {
          // Parse stored cards and ensure they match the current Card type requirements
          const parsedCards = JSON.parse(savedCards);
          setCards(parsedCards.map((card: Partial<Card>) => adaptToCard(card)));
        }
      } catch (err) {
        console.error('Error loading cards from storage:', err);
      }
    };

    loadCards();
  }, []);

  // Update localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const getCardById = useCallback((id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  }, [cards]);

  const addCard = useCallback((card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard: Card = adaptToCard({
      ...card,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setCards(prevCards => [...prevCards, newCard]);
    return newCard;
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<Card>) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id
          ? adaptToCard({ ...card, ...updates, updatedAt: new Date().toISOString() })
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
};

// Export types for consumers
export type CardOperations = ReturnType<typeof useCardOperations>;
