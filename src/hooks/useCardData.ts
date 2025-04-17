
import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/lib/types'; // Import from lib/types instead
import { useCards } from '@/context/CardContext';

interface UseCardDataOptions {
  /**
   * Enable/disable automatic fetching
   * @default true
   */
  autoFetch?: boolean;
  
  /**
   * Filter function to apply to cards
   */
  filter?: (card: Card) => boolean;
  
  /**
   * Sort function to apply to cards
   */
  sort?: (a: Card, b: Card) => number;
  
  /**
   * Limit the number of cards returned
   */
  limit?: number;
  
  /**
   * Dependencies array that triggers refetch when changed
   */
  deps?: any[];
}

interface CardDataResult {
  /**
   * List of filtered and sorted cards
   */
  cards: Card[];
  
  /**
   * Loading state
   */
  isLoading: boolean;
  
  /**
   * Error state
   */
  error: Error | null;
  
  /**
   * Manually refetch cards
   */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and processing card data with standardized loading and error states
 */
export function useCardData({
  autoFetch = true,
  filter,
  sort,
  limit,
  deps = []
}: UseCardDataOptions = {}): CardDataResult {
  const { cards: allCards, refreshCards } = useCards();
  const [processedCards, setProcessedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const processCards = useCallback(() => {
    try {
      let result = [...allCards];
      
      // Apply filter if provided
      if (filter) {
        result = result.filter(filter);
      }
      
      // Apply sort if provided
      if (sort) {
        result.sort(sort);
      }
      
      // Apply limit if provided
      if (limit && limit > 0) {
        result = result.slice(0, limit);
      }
      
      setProcessedCards(result);
      setError(null);
    } catch (err) {
      console.error('Error processing cards:', err);
      setError(err instanceof Error ? err : new Error('Unknown error processing cards'));
    } finally {
      setIsLoading(false);
    }
  }, [allCards, filter, sort, limit]);

  const refetch = useCallback(async () => {
    // Prevent multiple refreshes within a short time period
    const now = Date.now();
    if (now - lastRefreshTime < 2000) {
      return;
    }
    
    setLastRefreshTime(now);
    setIsLoading(true);
    try {
      if (refreshCards) {
        await refreshCards();
      }
      // Reset retry count on success
      setRetryCount(0);
    } catch (err) {
      console.error('Error refreshing cards:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh cards'));
      // Increment retry count on failure
      setRetryCount(prev => prev + 1);
    }
  }, [refreshCards, lastRefreshTime]);

  // Process cards when dependencies change
  useEffect(() => {
    processCards();
  }, [processCards, ...deps]);

  // Initial fetch on mount if autoFetch is enabled
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  // Auto-retry mechanism with exponential backoff, but limited to 3 retries
  useEffect(() => {
    if (error && retryCount < 3) {
      const timeout = Math.min(2000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
      const timer = setTimeout(() => {
        console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
        refetch();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, refetch]);

  return {
    cards: processedCards,
    isLoading,
    error,
    refetch
  };
}
