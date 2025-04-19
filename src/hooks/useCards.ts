// THIS FILE IS DEPRECATED - USE /context/CardContext.tsx INSTEAD

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, Collection, UserRole, DesignMetadata } from '@/lib/types';
import { CardRarity } from '@/lib/types/cardTypes'; // Import CardRarity
import { sampleCards } from '@/data/sampleCards';
import { useAuth } from './useAuth';

// Define a default design metadata
const defaultDesignMetadata: DesignMetadata = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameColor: '#FFFFFF',
    frameWidth: 10,
    shadowColor: '#000000'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333'
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  },
  cardMetadata: {
    category: 'standard',
    cardType: 'custom',
    series: 'none'
  }
};

// Define sample collections
const sampleCollections: Collection[] = [
  {
    id: 'collection-001',
    name: 'My First Collection',
    title: 'My First Collection',
    description: 'A collection of my favorite cards',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    userId: 'user-001',
    teamId: 'team-001',
    cards: sampleCards,
    visibility: 'public',
    allowComments: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: {},
    cardIds: sampleCards.map(card => card.id),
    isPublic: true,
    tags: ['favorites', 'collection']
  }
];

export const useCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>(sampleCards);
  const [collections, setCollections] = useState<Collection[]>(sampleCollections);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load user data
  useEffect(() => {
    if (user) {
      // In a real app, we would load user's cards and collections from an API
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, just use sample data
        setIsLoading(false);
      }, 500);
    }
  }, [user]);

  // Card operations
  const addCard = async (card: Partial<Card>): Promise<Card> => {
    const newCard: Card = {
      id: uuidv4(),
      title: card.title || 'New Card',
      description: card.description || '',
      imageUrl: card.imageUrl || '',
      thumbnailUrl: card.thumbnailUrl || '',
      tags: card.tags || [],
      userId: user?.id || 'user-1',
      teamId: card.teamId || 'team-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effects: card.effects || [],
      designMetadata: card.designMetadata || defaultDesignMetadata,
      rarity: 'common'
    };
    setCards([...cards, newCard]);
    return newCard;
  };

  const updateCard = async (card: Partial<Card>): Promise<Card> => {
    const updatedCard = { ...card, updatedAt: new Date().toISOString() } as Card;
    setCards(cards.map(c => c.id === card.id ? updatedCard : c));
    return updatedCard;
  };

  const deleteCard = async (id: string): Promise<void> => {
    setCards(cards.filter(c => c.id !== id));
  };

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  // Collection operations
  const addCollection = async (collection: Partial<Collection>): Promise<Collection> => {
    const newCollection: Collection = {
      id: uuidv4(),
      name: collection.name || 'New Collection',
      title: collection.title || collection.name || 'New Collection',
      description: collection.description || '',
      coverImageUrl: collection.coverImageUrl || '',
      userId: user?.id || 'user-1',
      teamId: collection.teamId || 'team-1',
      cards: [],
      visibility: collection.visibility || 'private',
      allowComments: collection.allowComments || true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: collection.designMetadata || {},
      cardIds: collection.cardIds || [],
      isPublic: collection.isPublic || false,
      tags: collection.tags || []
    };
    setCollections([...collections, newCollection]);
    return newCollection;
  };

  const updateCollection = async (collection: Partial<Collection>): Promise<Collection> => {
    const updatedCollection = { ...collection, updatedAt: new Date().toISOString() } as Collection;
    setCollections(collections.map(c => c.id === collection.id ? updatedCollection : c));
    return updatedCollection;
  };

  const deleteCollection = async (id: string): Promise<void> => {
    setCollections(collections.filter(c => c.id !== id));
  };

  const getCollectionById = (id: string): Collection | undefined => {
    return collections.find(collection => collection.id === id);
  };

  return {
    cards,
    collections,
    isLoading,
    error,
    addCard,
    updateCard,
    deleteCard,
    getCardById,
    addCollection,
    updateCollection,
    deleteCollection,
    getCollectionById
  };
};
