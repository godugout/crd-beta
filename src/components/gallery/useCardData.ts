
import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

// Define an interface that matches the actual database schema
interface CardRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  thumbnail_url?: string | null;
  tags?: string[];
  collection_id?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_public?: boolean;
}

export const useCardData = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        setError(error.message);
        toast.error('Failed to load cards');
        
        // Increment retry count for auto-retry mechanism
        setRetryCount(prevCount => prevCount + 1);
        return;
      }

      // Transform the database records into our Card type using the adapter
      const formattedCards: Card[] = (data as CardRecord[]).map(card => adaptToCard({
        id: card.id,
        title: card.title,
        description: card.description || '',
        imageUrl: card.image_url || '',
        thumbnailUrl: card.thumbnail_url || card.image_url || '',
        tags: card.tags || [],
        createdAt: card.created_at,
        updatedAt: card.updated_at,
        collectionId: card.collection_id,
        userId: card.user_id || 'anonymous',
        effects: []
      }));

      setCards(formattedCards);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('Unexpected error fetching cards:', err);
      setError(err?.message || 'An unexpected error occurred');
      toast.error('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Add auto-retry with exponential backoff
  useEffect(() => {
    if (error && retryCount > 0 && retryCount < 4) {
      // Exponential backoff: 2s, 4s, 8s
      const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
      
      console.log(`Retrying fetch in ${delay / 1000}s (attempt ${retryCount})...`);
      
      const retryTimer = setTimeout(() => {
        fetchCards();
      }, delay);
      
      return () => clearTimeout(retryTimer);
    }
  }, [error, retryCount, fetchCards]);

  return {
    cards,
    isLoading,
    error,
    refreshCards: fetchCards
  };
};
