
import { useEffect } from 'react';
import { validateCard } from '@/lib/utils/typeSafetyChecker';
import { Card } from '@/lib/types';

/**
 * A hook that validates data structures in development mode
 * This helps catch type errors that might slip through TypeScript's static checking
 */
export function useTypeCheck(data: any, type: 'card' | 'collection' | 'user'): void {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      let result;
      
      switch (type) {
        case 'card':
          result = validateCard(data);
          if (!result) {
            console.warn('Invalid Card structure in component');
          }
          break;
        // Add more type validations as needed
      }
    }
  }, [data, type]);
}

/**
 * Specialized version for Card type
 */
export function useCardTypeCheck(card: Card): void {
  useTypeCheck(card, 'card');
}
