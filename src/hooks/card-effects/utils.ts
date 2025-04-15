
import { Card } from '@/lib/types';

/**
 * Get default effects for a card based on its metadata
 */
export function getDefaultEffectsForCard(card: Card): string[] {
  const effects: string[] = [];
  
  // Apply effects based on card tags
  if (card.tags) {
    if (card.tags.includes('rare') || card.tags.includes('ultra-rare')) {
      effects.push('Holographic');
    }
    
    if (card.tags.includes('vintage') || card.tags.includes('classic')) {
      effects.push('Vintage');
    }
    
    if (card.tags.includes('chrome') || card.tags.includes('refractor')) {
      effects.push('Chrome');
    }
    
    if (card.tags.includes('special') || card.tags.includes('limited')) {
      effects.push('Refractor');
    }
  }
  
  return effects;
}

/**
 * Process cards in batches to avoid blocking the main thread
 */
export async function processCardsBatch(
  cards: Card[], 
  initialEffects: Record<string, string[]>
): Promise<Record<string, string[]>> {
  const batchSize = 10;
  const results = { ...initialEffects };
  
  // Process in batches
  for (let i = 0; i < cards.length; i += batchSize) {
    const batch = cards.slice(i, i + batchSize);
    
    // Small delay to allow UI updates
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Process this batch
    batch.forEach(card => {
      if (!results[card.id]) {
        const defaultEffects = getDefaultEffectsForCard(card);
        if (defaultEffects.length > 0) {
          results[card.id] = defaultEffects;
        }
      }
    });
  }
  
  return results;
}
