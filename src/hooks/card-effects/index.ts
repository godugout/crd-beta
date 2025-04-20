
// Export compatibilities across different hooks
export * from '@/hooks/useCardEffects';
export { default as useCardEffects } from '@/hooks/useCardEffects';
export * from './types';

// Re-export the card effects hook to fix the imports
import useCardEffects from '@/hooks/useCardEffects';
export default useCardEffects;
