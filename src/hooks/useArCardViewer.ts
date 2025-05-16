import { useState, useEffect } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { useToast } from '@/hooks/use-toast';
import { createToast } from '@/types/toast';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

export const useArCardViewer = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Mock data for demonstration
        const mockCards = [
          {
            id: '1',
            title: 'Test Card 1',
            description: 'Description for card 1',
            imageUrl: '/images/card-placeholder.png',
            thumbnailUrl: '/images/card-placeholder.png',
            userId: 'user1',
            tags: ['test', 'card'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            effects: [],
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
              cardMetadata: {},
              marketMetadata: {}
            }
          }
        ];

        // Convert to proper Card type with adapter
        const adaptedCards = mockCards.map(card => adaptToCard(card));
        setCards(adaptedCards);
        
        if (adaptedCards.length > 0) {
          setCurrentCard(adaptedCards[0]);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast(createToast({
          title: 'Error loading cards',
          description: 'Could not load AR cards',
          variant: 'destructive'
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const nextCard = () => {
    if (!currentCard || cards.length <= 1) return;
    
    const currentIndex = cards.findIndex(card => card.id === currentCard.id);
    const nextIndex = (currentIndex + 1) % cards.length;
    setCurrentCard(cards[nextIndex]);
    
    toast(createToast({
      title: 'Card Changed',
      description: `Now viewing ${cards[nextIndex].title}`
    }));
  };

  const previousCard = () => {
    if (!currentCard || cards.length <= 1) return;
    
    const currentIndex = cards.findIndex(card => card.id === currentCard.id);
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    setCurrentCard(cards[prevIndex]);
    
    toast(createToast({
      title: 'Card Changed',
      description: `Now viewing ${cards[prevIndex].title}`
    }));
  };

  return {
    cards,
    currentCard,
    loading,
    error,
    nextCard,
    previousCard
  };
};
