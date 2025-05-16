
import React, { createContext, useContext, ReactNode } from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { UserPreferences, ColorPalette, WorkflowConfig, BrandProfile, RecommendationItem, UserStyleProfile } from '@/lib/types/userPreferences';
import { CardTemplate } from '@/lib/types/templateTypes';
import { CardEffect } from '@/lib/types/cardTypes';
import { CardElement } from '@/lib/types/cardElements';

// Define the context type
interface PersonalizationContextType {
  loading: boolean;
  preferences: UserPreferences | null;
  activeBrandProfile: BrandProfile | null;
  styleProfile: UserStyleProfile | null;
  toggleFavorite: (type: 'template' | 'effect' | 'element', itemId: string) => Promise<boolean>;
  createColorPalette: (palette: Omit<ColorPalette, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>) => Promise<ColorPalette>;
  createBrandProfile: (profile: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BrandProfile>;
  setActiveBrand: (profileId: string) => Promise<void>;
  recordCardCreation: (cardId: string, templateId: string | undefined, effectsUsed: string[], elementsUsed: string[], timeSpent: number) => Promise<void>;
  getTemplateRecommendations: (imageUrl: string, availableTemplates: CardTemplate[]) => Promise<RecommendationItem<CardTemplate>[]>;
  getEffectRecommendations: (imageUrl: string, availableEffects: CardEffect[]) => Promise<RecommendationItem<CardEffect>[]>;
  getElementRecommendations: (context: { imageUrl: string; templateId?: string; cardTitle?: string; tags?: string[]; }, availableElements: CardElement[]) => Promise<RecommendationItem<CardElement>[]>;
  getColorRecommendations: (imageUrl: string) => Promise<string[][]>;
  updateWorkflow: (updates: Partial<WorkflowConfig>) => Promise<WorkflowConfig>;
}

// Create the context
const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

// Provider component
export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const personalization = usePersonalization();
  
  return (
    <PersonalizationContext.Provider value={personalization}>
      {children}
    </PersonalizationContext.Provider>
  );
}

// Custom hook to use the context
export function usePersonalizationContext() {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalizationContext must be used within a PersonalizationProvider');
  }
  return context;
}
