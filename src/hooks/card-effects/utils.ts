
import { Card } from '@/lib/types';

/**
 * Determines default effects for a card based on its metadata
 */
export function getDefaultEffectsForCard(card: Card): string[] {
  const defaultEffects: string[] = [];
  
  // Use card metadata to determine default effects
  if (card.designMetadata?.cardStyle?.effect === 'refractor') {
    defaultEffects.push('Refractor');
  }
  
  if (card.designMetadata?.cardStyle?.effect === 'holographic') {
    defaultEffects.push('Holographic');
  }
  
  if (card.designMetadata?.cardStyle?.effect === 'vintage') {
    defaultEffects.push('Vintage');
  }
  
  return defaultEffects;
}

/**
 * Process cards in batches to avoid UI blocking
 */
export async function processCardsBatch(
  cards: Card[], 
  initialEffects: Record<string, string[]>,
  batchSize: number = 20
): Promise<Record<string, string[]>> {
  const updatedEffects = { ...initialEffects };
  
  for (let i = 0; i < cards.length; i += batchSize) {
    const batch = cards.slice(i, i + batchSize);
    
    // Allow UI to update between batches
    await new Promise(resolve => setTimeout(resolve, 0));
    
    batch.forEach(card => {
      // Skip if already processed
      if (updatedEffects[card.id]) return;
      
      const defaultEffects = getDefaultEffectsForCard(card);
      
      // Only add non-empty effects
      if (defaultEffects.length > 0) {
        updatedEffects[card.id] = defaultEffects;
      }
    });
  }
  
  return updatedEffects;
}
