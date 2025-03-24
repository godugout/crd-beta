
import { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

// Define available card effects
const CARD_EFFECTS = [
  'Classic Holographic',
  'Refractor',
  'Prismatic',
  'Electric',
  'Gold Foil',
  'Chrome',
  'Vintage'
];

export const useCardEffects = (cards: Card[]) => {
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize random effects for each card when component mounts or cards change
  useEffect(() => {
    try {
      setIsLoading(true);
      const effectsMap: Record<string, string[]> = {};
      
      cards.forEach((card) => {
        // Give each card a different random effect
        const randomEffect = CARD_EFFECTS[Math.floor(Math.random() * CARD_EFFECTS.length)];
        effectsMap[card.id] = [randomEffect];
      });
      
      setCardEffects(effectsMap);
    } catch (error) {
      console.error("Error loading card effects:", error);
      toast.error("Failed to load card effects");
    } finally {
      setIsLoading(false);
    }
  }, [cards]);
  
  return { cardEffects, isLoading };
};
