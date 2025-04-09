
import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

export const useGalleryCards = () => {
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const { cards, isLoading, refreshCards } = useCards();
  const location = useLocation();
  const navigate = useNavigate();

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

  // Process cards for display
  const displayCards = useMemo(() => sortedCards.map(card => ({
    ...card,
    // Ensure imageUrl is actually present or use thumbnailUrl as fallback
    imageUrl: card.imageUrl || card.thumbnailUrl || '',
    // Process other card data
    designMetadata: {
      ...card.designMetadata,
      oaklandMemory: card.designMetadata?.oaklandMemory ? {
        ...card.designMetadata.oaklandMemory,
        title: card.title || '',
        description: card.description || ''
      } : undefined
    }
  })), [sortedCards]);

  // Effect to refresh cards when component mounts or when directed from another page
  useEffect(() => {
    console.log("Fetching gallery cards...");
    refreshCards?.();
    
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('refresh') === 'true') {
      console.log("Refresh parameter detected, refreshing cards...");
      refreshCards?.();
      queryParams.delete('refresh');
      navigate({
        pathname: location.pathname,
        search: queryParams.toString()
      }, { replace: true });
    }
  }, [location.search, refreshCards, navigate]);
  
  // Log image URLs to help with debugging
  useEffect(() => {
    if (displayCards.length > 0) {
      console.log("Available cards:", displayCards.length);
      console.log("First card imageUrl:", displayCards[0].imageUrl);
    }
  }, [displayCards]);

  return {
    displayCards,
    isLoading,
    hasBaseballCards,
    sortOrder,
    setSortOrder
  };
};

export default useGalleryCards;
