
/**
 * History-related types for Cardshow (CRD) application
 */

/**
 * Creation history item interface
 */
export interface CreationHistoryItem {
  id: string;
  cardId: string;
  effectsUsed: string[];
  elementsUsed: string[];
  timeSpent: number;
  createdAt: string;
}

/**
 * User style profile interface
 */
export interface UserStyleProfile {
  userId: string;
  favoriteColors: string[];
  favoriteEffects: string[];
  favoriteTemplates?: string[];
  favoriteLayouts: string[];
  lastUsedEffects: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * View history item interface
 */
export interface ViewHistoryItem {
  id: string;
  cardId: string;
  userId: string;
  viewedAt: string;
  viewDuration: number;
}
