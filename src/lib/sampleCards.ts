
import { Card } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const createSampleCard = (data: Partial<Card>): Card => ({
  id: uuidv4(),
  title: data.title || 'Untitled Card',
  name: data.name || data.title || 'Untitled Card', // Ensure name field is present
  description: data.description || '',
  imageUrl: data.imageUrl || '',
  image: data.image || data.imageUrl || '', // Ensure image field is present
  thumbnailUrl: data.thumbnailUrl || data.imageUrl || '',
  userId: data.userId || 'sample-creator',
  creatorId: data.userId || 'sample-creator', // Use userId as creatorId for consistency
  tags: data.tags || [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  fabricSwatches: data.fabricSwatches || []
});

export const sampleCards: Card[] = [
  createSampleCard({
    title: 'Vintage Baseball Card',
    description: 'A classic baseball trading card from the 1970s',
    imageUrl: 'https://source.unsplash.com/random/300x400?baseball',
    thumbnailUrl: 'https://source.unsplash.com/random/300x400?baseball',
    tags: ['Baseball', 'Vintage', 'Trading Card']
  }),
  createSampleCard({
    title: 'Basketball Legend',
    description: 'An iconic player from basketball history',
    imageUrl: 'https://source.unsplash.com/random/300x400?basketball',
    thumbnailUrl: 'https://source.unsplash.com/random/300x400?basketball',
    tags: ['Basketball', 'Legend', 'Sports Icon']
  }),
  createSampleCard({
    title: 'Football Superstar',
    description: 'One of the greatest football players of all time',
    imageUrl: 'https://source.unsplash.com/random/300x400?football',
    thumbnailUrl: 'https://source.unsplash.com/random/300x400?football',
    tags: ['Football', 'Superstar', 'NFL']
  }),
  createSampleCard({
    title: 'Soccer World Cup',
    description: 'Memorable moment from a World Cup final',
    imageUrl: 'https://source.unsplash.com/random/300x400?soccer',
    thumbnailUrl: 'https://source.unsplash.com/random/300x400?soccer',
    tags: ['Soccer', 'World Cup', 'FIFA']
  }),
  createSampleCard({
    title: 'Tennis Champion',
    description: 'Grand Slam winning tennis player',
    imageUrl: 'https://source.unsplash.com/random/300x400?tennis',
    thumbnailUrl: 'https://source.unsplash.com/random/300x400?tennis',
    tags: ['Tennis', 'Grand Slam', 'Champion']
  }),
  createSampleCard({
    title: 'Hockey Star',
    description: 'Legendary hockey player on ice',
    imageUrl: 'https://source.unsplash.com/random/300x400?hockey',
    thumbnailUrl: 'https://source.unsplash.com/random/300x400?hockey',
    tags: ['Hockey', 'NHL', 'Ice Sports']
  })
];

export const addSampleCards = async (addCardFn: (card: Partial<Card>) => Promise<Card>): Promise<Card[]> => {
  const addedCards: Card[] = [];
  
  try {
    for (const sampleCard of sampleCards) {
      const cardToAdd = {
        ...sampleCard,
        id: undefined // Let the addCard function generate a new ID
      };
      
      const newCard = await addCardFn(cardToAdd);
      addedCards.push(newCard);
    }
  } catch (error) {
    console.error('Error adding sample cards:', error);
  }
  
  return addedCards;
};
