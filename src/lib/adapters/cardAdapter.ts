
import { Card } from '@/types/card';

// Default values for required fields
const DEFAULT_CARD: Partial<Card> = {
  tags: [],
  effects: [],
  designMetadata: {
    cardStyle: {
      borderRadius: '12px',
      borderColor: '#000000',
      borderWidth: '1px',
      backgroundColor: '#ffffff',
    },
    textStyle: {
      titleFont: 'Inter',
      titleSize: '24px',
      titleColor: '#000000',
      descriptionFont: 'Inter',
      descriptionSize: '16px',
      descriptionColor: '#555555',
    }
  }
};

/**
 * Adapts any card-like object to conform to the Card interface
 * Ensures all required fields have valid values
 */
export const adaptToCard = (data: Partial<Card>): Card => {
  if (!data.id) {
    throw new Error('Card must have an ID');
  }
  
  if (!data.imageUrl && !data.thumbnailUrl) {
    console.warn(`Card ${data.id} has no image URL, using fallback`);
  }
  
  // Merge with defaults and ensure required fields
  return {
    id: data.id,
    title: data.title || 'Untitled Card',
    description: data.description || '',
    imageUrl: data.imageUrl || data.thumbnailUrl || '/placeholder-card.png',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || '/placeholder-card.png',
    tags: data.tags || DEFAULT_CARD.tags!,
    player: data.player,
    team: data.team,
    year: data.year,
    set: data.set,
    effects: data.effects || DEFAULT_CARD.effects!,
    effectSettings: data.effectSettings || {},
    designMetadata: {
      ...DEFAULT_CARD.designMetadata!,
      ...(data.designMetadata || {})
    },
    userId: data.userId || 'anonymous',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    viewCount: data.viewCount || 0,
    reactions: data.reactions
  };
};

/**
 * Converts Card object to a simplified DTO for API transmission
 */
export const cardToDto = (card: Card) => {
  // Remove any heavy or sensitive data
  const { reactions, ...cardDto } = card;
  return cardDto;
};

/**
 * Creates a blank card template with default values
 */
export const createBlankCard = (userId: string, partialCard: Partial<Card> = {}): Card => {
  const id = crypto.randomUUID();
  
  return adaptToCard({
    id,
    userId,
    title: 'New Card',
    description: '',
    imageUrl: '/placeholder-card.png',
    thumbnailUrl: '/placeholder-card.png',
    tags: [],
    effects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...partialCard
  });
};

export default { adaptToCard, cardToDto, createBlankCard };
