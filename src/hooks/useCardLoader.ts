
import { useState, useEffect } from 'react';
import { useCards } from '@/hooks/useCards';
import { Card } from '@/lib/types/cardTypes';
import { sampleCards } from '@/lib/data/sampleCards';
import { useToast } from '@/hooks/use-toast';
import { adaptToCard, ProcessedCard } from '@/lib/adapters/cardAdapter';

export const useCardLoader = (cardId: string) => {
  const { cards, getCard } = useCards();
  const [currentCard, setCurrentCard] = useState<ProcessedCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!cardId) {
      setError("No card ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('CardLoader: Loading card with ID:', cardId);
      
      // First try to find card directly from sampleCards
      let foundCard: Card | undefined = sampleCards?.find(c => c.id === cardId);
      
      // If not found in sampleCards, try the cards context
      if (!foundCard) {
        console.log('CardLoader: Card not found in sampleCards, checking context');
        foundCard = getCard ? getCard(cardId) : cards.find(c => c.id === cardId);
      }
      
      if (foundCard) {
        const processedCard = adaptToCard(foundCard);
        setCurrentCard(processedCard);
        setIsLoading(false);
      } else {
        console.error('CardLoader: Card not found with ID:', cardId);
        setError(`Card with ID ${cardId} not found`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('CardLoader: Error loading card:', err);
      setError('Failed to load card');
      setIsLoading(false);
    }
  }, [cardId, cards, getCard, toast]);

  return { currentCard, isLoading, error, setCurrentCard };
};
