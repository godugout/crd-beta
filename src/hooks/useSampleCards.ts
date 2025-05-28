
import { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { sampleCards } from '@/data/sampleCards';

export const useSampleCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and transform sample cards to proper Card type
    const transformedCards: Card[] = sampleCards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description,
      imageUrl: card.imageUrl,
      thumbnailUrl: card.thumbnailUrl,
      tags: card.tags,
      effects: card.effects || [],
      userId: card.userId,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      metadata: {
        player: card.player,
        team: card.team,
        position: card.position,
        year: card.year
      }
    }));

    setCards(transformedCards);
    setLoading(false);
  }, []);

  return { cards, loading };
};
