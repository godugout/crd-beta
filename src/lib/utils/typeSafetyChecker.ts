
/**
 * This utility helps ensure type safety by verifying that data structures
 * conform to expected types at runtime, which can help catch errors that
 * TypeScript's static checking might miss due to type assertions or any usage.
 */

import { Card, Collection, OaklandMemoryData, User } from '@/lib/types';
import { isCard, isCollection, isUser, isOaklandMemoryData } from './typeGuards';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a Card object against the Card interface
 */
export function validateCard(card: any): ValidationResult {
  const errors: string[] = [];
  
  if (!card) {
    return { valid: false, errors: ['Card is undefined or null'] };
  }
  
  if (typeof card.id !== 'string') {
    errors.push('Card.id must be a string');
  }
  
  if (typeof card.title !== 'string') {
    errors.push('Card.title must be a string');
  }
  
  if (typeof card.description !== 'string') {
    errors.push('Card.description must be a string');
  }
  
  if (typeof card.imageUrl !== 'string') {
    errors.push('Card.imageUrl must be a string');
  }
  
  if (card.tags && !Array.isArray(card.tags)) {
    errors.push('Card.tags must be an array');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates an OaklandMemoryData object
 */
export function validateOaklandMemoryData(memory: any): ValidationResult {
  const errors: string[] = [];
  
  if (!memory) {
    return { valid: false, errors: ['OaklandMemoryData is undefined or null'] };
  }
  
  if (typeof memory.title !== 'string') {
    errors.push('OaklandMemoryData.title must be a string');
  }
  
  if (typeof memory.description !== 'string') {
    errors.push('OaklandMemoryData.description must be a string');
  }
  
  if (!Array.isArray(memory.tags)) {
    errors.push('OaklandMemoryData.tags must be an array');
  }
  
  // Check optional fields if they exist
  if (memory.date !== undefined && typeof memory.date !== 'string') {
    errors.push('OaklandMemoryData.date must be a string');
  }
  
  if (memory.attendees !== undefined && !Array.isArray(memory.attendees)) {
    errors.push('OaklandMemoryData.attendees must be an array');
  }
  
  if (memory.historicalContext !== undefined && typeof memory.historicalContext !== 'string') {
    errors.push('OaklandMemoryData.historicalContext must be a string');
  }
  
  if (memory.personalSignificance !== undefined && typeof memory.personalSignificance !== 'string') {
    errors.push('OaklandMemoryData.personalSignificance must be a string');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Runtime check to validate data structures
 * This can be used in development or as a debugging tool
 */
export function validateDataStructures(data: any): void {
  if (process.env.NODE_ENV !== 'production') {
    if (isCard(data)) {
      const result = validateCard(data);
      if (!result.valid) {
        console.warn('Invalid Card structure:', result.errors);
      }
    } else if (isOaklandMemoryData(data)) {
      const result = validateOaklandMemoryData(data);
      if (!result.valid) {
        console.warn('Invalid OaklandMemoryData structure:', result.errors);
      }
    }
    // Add more validations as needed
  }
}
