
import { Card } from './cardTypes';

/**
 * Interface for tracking user's creation history
 */
export interface CreationHistoryItem {
  id: string;
  cardId: string;
  userId?: string;
  createdAt: string;
  effectsUsed?: string[];
  elementsUsed?: string[];
  timeSpent: number;
  card?: Card;
  templateId?: string;
}

/**
 * Interface for user's style preferences 
 */
export interface UserStyleProfile {
  userId: string;
  preferredColors: string[];
  preferredEffects: string[];
  favoriteLayouts: string[];
  favoriteTemplates?: string[];
  lastUsedElements: {
    id: string;
    usageCount: number;
    lastUsed: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for user design preferences
 */
export interface DesignPreferences {
  colors: string[];
  themes: string[];
  styles: string[];
  templates: string[];
}

/**
 * Interface for creative tool preferences
 */
export interface ToolPreferences {
  effectIntensity: number;
  uiDensity: 'compact' | 'comfortable' | 'spacious';
  autoSaveFrequency: number;
  defaultView: 'gallery' | 'edit' | 'preview';
}

/**
 * Interface for accessibility preferences
 */
export interface AccessibilityPreferences {
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
}

/**
 * Combined user preferences
 */
export interface UserPreferences {
  design: DesignPreferences;
  tools: ToolPreferences;
  accessibility: AccessibilityPreferences;
  createdAt: string;
  updatedAt: string;
}
