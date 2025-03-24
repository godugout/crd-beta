
import { Card } from '@/lib/types';

// Sample card data to populate the gallery
export const sampleCardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Vintage Baseball Card",
    description: "A classic vintage baseball card featuring a legendary player from the golden era of baseball.",
    imageUrl: "https://images.unsplash.com/photo-1588914307233-c6677d0b1354?q=80&w=1000",
    thumbnailUrl: "https://images.unsplash.com/photo-1588914307233-c6677d0b1354?q=80&w=500",
    tags: ["baseball", "vintage", "sports", "collectible"]
  },
  {
    title: "Modern Art Exhibition",
    description: "Abstract painting from a contemporary art exhibition showcasing bold colors and geometric shapes.",
    imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1000",
    thumbnailUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=500",
    tags: ["art", "modern", "abstract", "exhibition"]
  },
  {
    title: "Mountain Landscape",
    description: "Stunning view of snow-capped mountains with a crystal clear lake reflecting the beautiful scenery.",
    imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1000",
    thumbnailUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=500", 
    tags: ["nature", "mountains", "landscape", "photography"]
  },
  {
    title: "Retro Gaming Card",
    description: "A special edition card featuring classic video game characters from the 90s era of gaming.",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=1000",
    thumbnailUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=500",
    tags: ["gaming", "retro", "nostalgia", "collectible"]
  },
  {
    title: "Luxury Watch Close-up",
    description: "Detailed macro photography of a premium luxury watch showing intricate craftsmanship.",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=1000",
    thumbnailUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=500",
    tags: ["watch", "luxury", "macro", "timepiece"]
  },
  {
    title: "Holographic Special Edition",
    description: "Limited edition holographic card with special reflective properties that change in different lighting.",
    imageUrl: "https://images.unsplash.com/photo-1599751449018-c7ce6fc09d2e?q=80&w=1000",
    thumbnailUrl: "https://images.unsplash.com/photo-1599751449018-c7ce6fc09d2e?q=80&w=500",
    tags: ["holographic", "limited", "special", "rare"]
  }
];

// Function to add sample cards
export const addSampleCards = async (addCardFn: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Card | undefined>) => {
  const results = [];
  
  for (const cardData of sampleCardData) {
    try {
      const result = await addCardFn(cardData);
      if (result) {
        results.push(result);
      }
    } catch (error) {
      console.error("Error adding sample card:", error);
    }
  }
  
  return results;
};
