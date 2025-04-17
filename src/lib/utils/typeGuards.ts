
// Import adaptToCard from typeAdapters
import { adaptToCard, isCard, isCollection, isUser, isOaklandMemoryData } from '@/lib/adapters/typeAdapters';

// Re-export type guards for use throughout the app
export { 
  isCard, 
  isCollection, 
  isUser, 
  isOaklandMemoryData,
  adaptToCard 
};
