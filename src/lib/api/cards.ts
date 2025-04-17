import { Card, CardRarity } from '@/lib/types';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

// Mock API service for card data
export const fetchCards = async (): Promise<Card[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would call an actual API
  const mockCards: Card[] = [
    adaptToCard({
      id: '1',
      title: 'Vintage Baseball Card',
      description: 'A classic baseball card from the golden era',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
      tags: ['baseball', 'vintage', 'collectible'],
      userId: 'demo-user',
      effects: ['standard'],
      rarity: CardRarity.COMMON,
    }),
    adaptToCard({
      id: '2',
      title: 'Basketball Legend',
      description: 'Limited edition basketball trading card',
      imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200',
      tags: ['basketball', 'limited', 'sports'],
      userId: 'demo-user',
      effects: ['holographic'],
      rarity: CardRarity.RARE,
    }),
  ];
  
  return mockCards;
};

// Fetch card by ID
export const fetchCardById = async (id: string): Promise<Card | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would call an actual API
  if (id === '1') {
    return adaptToCard({
      id: '1',
      title: 'Vintage Baseball Card',
      description: 'A classic baseball card from the golden era',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
      tags: ['baseball', 'vintage', 'collectible'],
      userId: 'demo-user',
      effects: ['standard'],
      rarity: CardRarity.COMMON,
    });
  }
  
  // Return null if card not found
  return null;
};

// Create a new card
export const createCard = async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, this would call an actual API
  const newCard = adaptToCard({
    ...cardData,
    id: `card-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  return newCard;
};

// Update an existing card
export const updateCard = async (id: string, cardData: Partial<Card>): Promise<Card | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would call an actual API
  const existingCard = await fetchCardById(id);
  
  if (!existingCard) {
    return null;
  }
  
  const updatedCard = {
    ...existingCard,
    ...cardData,
    updatedAt: new Date().toISOString()
  };
  
  return updatedCard;
};

// Delete a card
export const deleteCard = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In a real app, this would call an actual API
  // Return true to indicate success
  return true;
};
