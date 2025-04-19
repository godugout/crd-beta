import { useState, useEffect } from 'react';
import { Card, Collection, CardRarity } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

// Default design metadata for new cards
const defaultDesignMetadata = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '16px',
    borderColor: '#000000',
    frameColor: '#ffffff',
    frameWidth: 10,
    shadowColor: '#000000',
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333',
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false,
  },
  cardMetadata: {
    category: 'standard',
    cardType: 'custom',
    series: 'none',
  },
};

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      
      // Demo data for collections
      const demoCollections: Collection[] = [
        {
          id: 'coll-1',
          name: 'Featured Collection',
          title: 'Featured Cards',
          description: 'A collection of featured cards',
          coverImageUrl: '/images/collection-cover.jpg',
          userId: 'user-1',
          visibility: 'public',
          isPublic: true,
          tags: ['featured', 'cards'],
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // More collections...
      ];
      
      setCollections(demoCollections);
      
      // Demo data for cards
      const demoCards: Card[] = [
        {
          id: 'card-1',
          title: 'Demo Card 1',
          description: 'This is a demo card',
          imageUrl: '/images/card1.jpg',
          thumbnailUrl: '/images/card1-thumb.jpg',
          tags: ['demo', 'sample'],
          userId: 'user-1',
          effects: ['Holographic'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          player: 'Player One',
          team: 'Team Alpha',
          position: 'Forward',
          year: '2023',
          designMetadata: { ...defaultDesignMetadata },
        },
        {
          id: 'card-2',
          title: 'Demo Card 2',
          description: 'Another demo card',
          imageUrl: '/images/card2.jpg',
          thumbnailUrl: '/images/card2-thumb.jpg',
          tags: ['demo', 'premium'],
          userId: 'user-1',
          effects: ['Refractor'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          player: 'Player Two',
          team: 'Team Beta',
          position: 'Guard',
          year: '2023',
          designMetadata: { ...defaultDesignMetadata },
          rarity: 'rare' as CardRarity,
        }
      ];
      
      setCards(demoCards);
      
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addCollection = (collectionData: Partial<Collection>): Collection => {
    const newCollection: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      title: collectionData.title || 'New Collection',
      name: collectionData.name || 'New Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      thumbnailUrl: collectionData.thumbnailUrl || '',
      userId: collectionData.userId || 'user-1',
      visibility: collectionData.visibility || 'public',
      isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
      tags: collectionData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  };

  const addCard = (cardData: Partial<Card>): Card => {
    const rarity: CardRarity = cardData.rarity || 'common';

    const newCard: Card = {
      id: Math.random().toString(36).substr(2, 9),
      title: cardData.title || 'New Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || '',
      tags: cardData.tags || [],
      userId: cardData.userId || 'user-1',
      effects: cardData.effects || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rarity: rarity,
      designMetadata: cardData.designMetadata || { ...defaultDesignMetadata },
    };
    
    setCards(prev => [...prev, newCard]);
    return newCard;
  };

  // Other functions...

  return {
    cards,
    collections,
    loading,
    error,
    fetchCards,
    addCard,
    addCollection
    // Additional methods as needed
  };
}
