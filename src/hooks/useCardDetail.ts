import { useState, useEffect } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

/**
 * Hook for fetching and managing card details
 * Returns card data using the base Card type with proper defaults
 */
export function useCardDetail(cardId: string) {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no card ID is provided, skip fetching
    if (!cardId) {
      setIsLoading(false);
      return;
    }

    const fetchCard = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call when available
        // For now, simulate API call with timeout
        setTimeout(() => {
          // Mock data or fetch from context/API
          const fetchedCard: Partial<Card> = {
            id: cardId,
            title: "Sample Card",
            description: "This is a sample card",
            imageUrl: "/placeholder-card.png",
            userId: "user1",
            effects: [],
            thumbnailUrl: "/placeholder-card-thumb.png",
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Optional baseball card properties
            player: "Sample Player",
            team: "Sample Team",
            year: "2025"
            // Other properties would come from API
          };
          
          // Use adaptToCard to ensure all required fields are present with defaults
          setCard(adaptToCard(fetchedCard));
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching card:", err);
        setError("Failed to load card details");
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  // Function to toggle favorite status
  const toggleFavorite = () => {
    if (card) {
      // In a real app, this would update the backend
      // For now, we could add a local state for favorites
      console.log('Toggle favorite for card:', card.id);
    }
  };

  return {
    card,
    isLoading,
    error,
    toggleFavorite
  };
}
