
import { useContext } from 'react';
import { Card, CardRarity } from '@/lib/types';
import { CardContext } from '@/context/CardContext';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

export function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  
  // Ensure the adaptToCard function properly converts string rarities to CardRarity enum values
  const processedCards = context.cards.map(card => 
    adaptToCard({
      ...card,
      isFavorite: card.isFavorite ?? false,
      description: card.description || '',
      rarity: card.rarity || CardRarity.COMMON
    })
  );
  
  // Override the context with the processed cards
  return {
    ...context,
    cards: processedCards,
    getCard: (id: string) => {
      const card = context.getCard ? context.getCard(id) : null;
      if (card) {
        return adaptToCard({
          ...card,
          isFavorite: card.isFavorite ?? false,
          description: card.description || '',
          rarity: card.rarity || CardRarity.COMMON
        });
      }
      return null;
    }
  };
}
