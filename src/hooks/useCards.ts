
import { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { sampleCards } from '@/data/sampleCards';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // In a real application, you would fetch cards from an API here
      // For now, we'll use sample cards
      setCards(sampleCards);
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch cards');
      setError(error);
      setLoading(false);
    }
  }, []);

  return { 
    cards, 
    loading, 
    error 
  };
};
