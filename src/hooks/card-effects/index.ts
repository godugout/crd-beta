
// Export compatibilities across different hooks
export { default as useCardEffects } from '@/hooks/useCardEffects';
export * from './types';

// Fix re-export ambiguity by using explicit named exports
export { default } from '@/hooks/useCardEffects';

// Export the CardEffect type
export type { CardEffect } from '@/lib/types/cardEffects';
