
import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

export const useGalleryCards = () => {
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const { cards } = useCards();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if there are baseball cards
  const hasBaseballCards = useMemo(() => cards.some(card => 
    card.tags?.some(tag => ['baseball', 'vintage'].includes(tag.toLowerCase()))
  ), [cards]);

  // Sort cards based on the selected sort order
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [cards, sortOrder]);

  // Process cards for display and validate image URLs
  const displayCards = useMemo(() => {
    // Log the raw cards and their image URLs
    console.log("Raw cards from database:", cards.length);
    console.log("Sample card data:", cards.length > 0 ? cards[0] : "No cards");
    
    // Filter out any cards without images and prepare for display
    const validCards = sortedCards.map(card => {
      // Ensure imageUrl exists or use thumbnailUrl as fallback
      const imageUrl = card.imageUrl || card.thumbnailUrl || '/placeholder.svg';
      
      // Create a properly structured card object
      return {
        ...card,
        imageUrl: imageUrl,
        // Process other card data
        designMetadata: {
          ...card.designMetadata,
          oaklandMemory: card.designMetadata?.oaklandMemory ? {
            ...card.designMetadata.oaklandMemory,
            title: card.title || '',
            description: card.description || ''
          } : undefined
        }
      };
    });
    
    // Debug info
    console.log(`Processed ${validCards.length} cards for display`);
    if (validCards.length > 0) {
      console.log("First card image URL:", validCards[0].imageUrl);
    }
    
    return validCards;
  }, [sortedCards]);

  // Effect to refresh cards when component mounts or when directed from another page
  useEffect(() => {
    console.log("Fetching gallery cards...");
    
    const queryParams = new URLSearchParams(location.search);
    const shouldRefresh = queryParams.get('refresh') === 'true';
    
    if (shouldRefresh) {
      console.log("Refresh parameter detected, refreshing cards...");
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        queryParams.delete('refresh');
        navigate({
          pathname: location.pathname,
          search: queryParams.toString()
        }, { replace: true });
      }, 500);
    } else if (refreshTrigger === 0) {
      // Only refresh once on initial mount
      setRefreshTrigger(1);
    }
  }, [location.search, navigate, refreshTrigger]);
  
  // Function to refresh cards
  const refreshCards = async () => {
    setIsLoading(true);
    try {
      // This would typically call an API to refresh data
      // For now, we just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing cards:', error);
      toast.error('Failed to refresh cards');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    displayCards,
    isLoading,
    hasBaseballCards,
    sortOrder,
    setSortOrder,
    refreshCards
  };
};

export default useGalleryCards;
