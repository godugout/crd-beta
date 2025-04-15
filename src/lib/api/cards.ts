
import { Card } from '@/lib/types';

// Mock data for testing
const mockCards: Card[] = [
  {
    id: "1",
    title: "LeBron James - Lakers",
    description: "LeBron James card from 2022 season",
    imageUrl: "https://i.imgur.com/qgcDPwR.jpg", // Replace with actual image
    thumbnailUrl: "https://i.imgur.com/qgcDPwR.jpg", // Replace with actual thumbnail
    tags: ["NBA", "Lakers", "LeBron"],
    player: "LeBron James",
    team: "Los Angeles Lakers",
    year: "2022",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Stephen Curry - Warriors",
    description: "Stephen Curry signature card",
    imageUrl: "https://i.imgur.com/8hIx4ZQ.jpg", // Replace with actual image
    thumbnailUrl: "https://i.imgur.com/8hIx4ZQ.jpg", // Replace with actual thumbnail
    tags: ["NBA", "Warriors", "Curry"],
    player: "Stephen Curry",
    team: "Golden State Warriors",
    year: "2022",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Fetch a card by ID
export const fetchCardById = async (id: string): Promise<Card> => {
  // In a real app, this would be an API call to your backend
  // For now, we'll simulate a small delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 500));

  const card = mockCards.find(card => card.id === id);
  
  if (!card) {
    throw new Error(`Card with ID ${id} not found`);
  }
  
  return card;
};

// Fetch all cards
export const fetchCards = async (): Promise<Card[]> => {
  // In a real app, this would be an API call to your backend
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockCards;
};
