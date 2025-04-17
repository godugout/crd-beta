import { useState, useEffect } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { DetailedViewCard, ensureDetailedViewCard } from '@/types/detailedCardTypes';

/**
 * Hook for fetching and managing card details
 * Ensures returned card data has all required properties for detail views
 */
export function useCardDetail(cardId: string) {
  const [card, setCard] = useState<DetailedViewCard | null>(null);
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
          const fetchedCard: Card = {
            id: cardId,
            title: "Sample Card",
            description: "This is a sample card",
            imageUrl: "/placeholder-card.png",
            userId: "user1",
            effects: [],
            thumbnailUrl: "/placeholder-card-thumb.png",
            tags: [],
            designMetadata: {
              cardStyle: {
                template: 'classic',
                effect: 'none',
                borderRadius: '8px',
                borderColor: '#000000',
                frameColor: '#000000',
                frameWidth: 2,
                shadowColor: 'rgba(0,0,0,0.2)',
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
                category: 'general',
                cardType: 'standard',
                series: 'base',
              },
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Optional baseball card properties
            player: "Sample Player",
            team: "Sample Team",
            year: "2025"
            // Other properties would come from API
          };
          
          // Use our helper to ensure all required fields are present
          setCard(ensureDetailedViewCard(fetchedCard));
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
      const updatedCard = {
        ...card,
        isFavorite: !card.isFavorite
      };
      setCard(updatedCard);
      // In a real app, update this in backend/API
    }
  };

  return {
    card,
    isLoading,
    error,
    toggleFavorite
  };
}
