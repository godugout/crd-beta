import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { v4 as uuidv4 } from 'uuid';
import { adaptToLegacyCard } from '@/lib/adapters/cardAdapter';
import { Card as CardType } from '@/lib/types/cardTypes';

// Create default market metadata to conform to the MarketMetadata interface
const DEFAULT_MARKET_METADATA = {
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false,
  price: 0,
  currency: 'USD',
  availableForSale: false,
  editionSize: 1,
  editionNumber: 1
};

// Ensure the mock data conforms to the Card type
const initialCards: Card[] = [
  {
    id: '1',
    title: 'Sample Card',
    description: 'This is a sample card for development',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'development'],
    userId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: DEFAULT_MARKET_METADATA
    }
  },
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
          setCards(parsedCards.map((card: Partial<Card>) => {
            // Ensure correct structure with defaults
            return {
              ...adaptToLegacyCard(card),
              designMetadata: {
                ...card.designMetadata,
                marketMetadata: {
                  ...DEFAULT_MARKET_METADATA,
                  ...(card.designMetadata?.marketMetadata || {})
                }
              }
            };
          }));
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

  const addCard = useCallback((cardData: Partial<Card>) => {
    const now = new Date().toISOString();
    // Create a complete card with all required fields
    const newCard: Card = {
      id: uuidv4(),
      title: cardData.title || 'Untitled Card', // Ensure required field
      description: cardData.description || '', // Ensure required field
      imageUrl: cardData.imageUrl || '/placeholder.svg', // Ensure required field
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '/placeholder.svg', // Ensure required field
      tags: cardData.tags || [],
      userId: cardData.userId || 'default-user',
      createdAt: now,
      updatedAt: now,
      effects: cardData.effects || [],
      // Include player property from cardData if available
      ...(cardData.player && { player: cardData.player }),
      // Include team property from cardData if available  
      ...(cardData.team && { team: cardData.team }),
      // Include year property from cardData if available
      ...(cardData.year && { year: cardData.year }),
      designMetadata: {
        cardStyle: cardData.designMetadata?.cardStyle || {
          template: 'classic',
          effect: 'none',
          borderRadius: '8px',
          borderColor: '#000000',
          shadowColor: 'rgba(0,0,0,0.2)',
          frameWidth: 2,
          frameColor: '#000000'
        },
        textStyle: cardData.designMetadata?.textStyle || {
          titleColor: '#000000',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#333333'
        },
        cardMetadata: cardData.designMetadata?.cardMetadata || {
          category: 'general',
          series: 'base',
          cardType: 'standard'
        },
        marketMetadata: {
          isPrintable: false,
          isForSale: false,
          includeInCatalog: false,
          price: 0,
          currency: 'USD',
          availableForSale: false,
          editionSize: 1,
          editionNumber: 1,
          ...(cardData.designMetadata?.marketMetadata || {})
        }
      }
    };

    setCards(prevCards => [...prevCards, newCard]);
    return newCard;
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<CardType>) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id
          ? {
              ...card,
              ...updates,
              updatedAt: new Date().toISOString(),
              designMetadata: {
                ...(card.designMetadata || {}),
                ...(updates.designMetadata || {}),
                marketMetadata: {
                  ...DEFAULT_MARKET_METADATA,
                  ...(card.designMetadata?.marketMetadata || {}),
                  ...(updates.designMetadata?.marketMetadata || {})
                }
              }
            } as Card
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
