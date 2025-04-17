
import { useState, useEffect } from 'react';
import { Card, CardRarity } from '@/lib/types';
import { useCards } from '@/hooks/useCards';
import { toStandardCard } from '@/lib/utils/cardConverters';
import { ensureCardRarity } from '@/lib/utils/CardRarityUtils';
import { sampleCards } from '@/lib/data/sampleCards';
import { toast } from '@/hooks/use-toast';

export type CardDetailedViewCard = Required<Pick<Card, 'id' | 'title' | 'description' | 'imageUrl' | 'thumbnailUrl' | 
  'tags' | 'createdAt' | 'updatedAt' | 'userId' | 'effects' | 'isFavorite' | 'rarity'>> & 
  Omit<Card, 'id' | 'title' | 'description' | 'imageUrl' | 'thumbnailUrl' | 'tags' | 'createdAt' | 
  'updatedAt' | 'userId' | 'effects' | 'isFavorite' | 'rarity'>;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

export function useCardDetail(cardId: string | undefined) {
  const { cards, getCard } = useCards();
  const [resolvedCard, setResolvedCard] = useState<CardDetailedViewCard | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cardId) {
      console.error('CardDetail: No ID provided in URL params');
      return;
    }
    
    console.log('CardDetail: Rendering for ID:', cardId);
    
    let foundCard = sampleCards.find(c => c.id === cardId);
    
    if (!foundCard) {
      console.log('CardDetail: Card not found in sampleCards, checking context for ID:', cardId);
      foundCard = getCard ? getCard(cardId) : cards.find(c => c.id === cardId);
    }
    
    if (foundCard) {
      console.log('CardDetail: Found card:', foundCard.title, 'with imageUrl:', foundCard.imageUrl);
      
      // Create a complete card object with all required properties before calling toStandardCard
      const completeCard = {
        ...foundCard,
        imageUrl: foundCard.imageUrl || FALLBACK_IMAGE,
        thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || FALLBACK_IMAGE,
        description: foundCard.description || '',
        isFavorite: foundCard.isFavorite ?? false,
        rarity: ensureCardRarity(foundCard.rarity),
        userId: foundCard.userId || 'anonymous',
        createdAt: foundCard.createdAt || new Date().toISOString(), 
        updatedAt: foundCard.updatedAt || new Date().toISOString(),
        tags: foundCard.tags || [],
        effects: foundCard.effects || []
      };
      
      // Now convert to standard card and cast to CardDetailedViewCard
      const standardCard = toStandardCard(completeCard) as CardDetailedViewCard;
      
      setResolvedCard(standardCard);
      
      if (standardCard.imageUrl && standardCard.imageUrl !== FALLBACK_IMAGE) {
        const img = new Image();
        img.onerror = () => {
          console.error('CardDetail: Image failed to preload:', standardCard.imageUrl);
          setResolvedCard(prev => prev ? {
            ...prev,
            imageUrl: FALLBACK_IMAGE,
            thumbnailUrl: FALLBACK_IMAGE,
          } : null);
        };
        img.src = standardCard.imageUrl;
      }
    } else {
      console.error('CardDetail: Card not found at all for ID:', cardId);
      toast({
        title: "Card not found",
        description: "The requested card could not be found",
        variant: "destructive"
      });
    }
  }, [cardId, cards, getCard]);

  return {
    resolvedCard,
    isLoaded,
    FALLBACK_IMAGE
  };
}
