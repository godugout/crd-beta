
import { CardElement } from './cardElements';
import { CardTemplate } from './templateTypes';
import { JsonValue } from './index';
import { CardEffect } from './cardTypes';

/**
 * Color palette definition for user customization
 */
export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  isDefault?: boolean;
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User workflow configuration with tool preferences
 */
export interface WorkflowConfig {
  id: string;
  name: string;
  quickAccessTools: string[];
  defaultView: 'simple' | 'advanced' | 'expert';
  layoutPreferences: {
    sidebarPosition: 'left' | 'right';
    panelSizes: Record<string, number>;
    visiblePanels: string[];
    collapsedPanels: string[];
  };
  shortcuts: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Brand profile for consistent design
 */
export interface BrandProfile {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
    bodyFont?: string;
  };
  assets: {
    logos: string[];
    backgrounds: string[];
    elements: string[];
  };
  templates: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * User creation history item
 */
export interface CreationHistoryItem {
  id: string;
  cardId: string;
  templateId?: string;
  effectsUsed: string[];
  elementsUsed: string[];
  createdAt: string;
  timeSpent: number;
}

/**
 * User personalization preferences
 */
export interface UserPreferences {
  id: string;
  userId: string;
  
  // Visual preferences
  defaultTemplate?: string;
  defaultEffects: string[];
  colorPalettes: ColorPalette[];
  favoriteTemplates: string[];
  favoriteEffects: string[];
  favoriteElements: string[];
  
  // Workflow preferences
  workflow: WorkflowConfig;
  lastUsedTools: string[];
  creationHistory: CreationHistoryItem[];
  
  // Brand profiles
  brandProfiles: BrandProfile[];
  activeBrandProfileId?: string;
  
  // Recommendations
  recommendationsEnabled: boolean;
  recommendationPreferences: {
    showTemplateRecommendations: boolean;
    showEffectRecommendations: boolean;
    showColorRecommendations: boolean;
    showElementRecommendations: boolean;
  };
  
  // Extra settings
  extra: Record<string, JsonValue>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Recommendation item with reason and score
 */
export interface RecommendationItem<T> {
  item: T;
  score: number;
  reason: string;
  category?: string;
}

/**
 * Types of recommendations available
 */
export type RecommendationType = 'template' | 'effect' | 'element' | 'color';

/**
 * User style profile built from history
 */
export interface UserStyleProfile {
  favoriteColors: string[];
  favoriteElements: string[];
  favoriteEffects: string[];
  stylePreferences: {
    minimalVsDetailed: number; // 0-100, 0 = minimal, 100 = detailed
    classicVsModern: number;   // 0-100, 0 = classic, 100 = modern
    brightVsDark: number;      // 0-100, 0 = bright, 100 = dark
    patternedVsClean: number;  // 0-100, 0 = clean, 100 = patterned
  };
}
