
import { useEffect } from 'react';
import { validateCard, validateOaklandMemoryData } from '@/lib/utils/typeSafetyChecker';
import { Card, OaklandMemoryData } from '@/lib/types';

/**
 * A hook that validates data structures in development mode
 * This helps catch type errors that might slip through TypeScript's static checking
 */
export function useTypeCheck(data: any, type: 'card' | 'oaklandMemory' | 'collection' | 'user'): void {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      let result;
      
      switch (type) {
        case 'card':
          result = validateCard(data);
          if (!result.valid) {
            console.warn('Invalid Card structure in component:', result.errors);
          }
          break;
        case 'oaklandMemory':
          result = validateOaklandMemoryData(data);
          if (!result.valid) {
            console.warn('Invalid OaklandMemoryData structure in component:', result.errors);
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

/**
 * Specialized version for OaklandMemoryData type
 */
export function useMemoryTypeCheck(memory: OaklandMemoryData): void {
  useTypeCheck(memory, 'oaklandMemory');
}
