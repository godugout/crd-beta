
import { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCardData = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
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
        return;
      }

      // Transform the database records into our Card type
      const formattedCards: Card[] = data.map(card => ({
        id: card.id,
        title: card.title,
        description: card.description || '',
        imageUrl: card.image_url || '',
        thumbnailUrl: card.thumbnail_url || '',
        tags: card.tags || [],
        createdAt: new Date(card.created_at),
        updatedAt: new Date(card.updated_at),
        collectionId: card.collection_id
      }));

      setCards(formattedCards);
    } catch (err) {
      console.error('Unexpected error fetching cards:', err);
      setError('An unexpected error occurred');
      toast.error('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    isLoading,
    error,
    refreshCards: fetchCards
  };
};
