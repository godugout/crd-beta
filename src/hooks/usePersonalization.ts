
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PersonalizationService } from '@/lib/services/personalizationService';
import { RecommendationService } from '@/lib/services/recommendationService';
import { UserPreferences, ColorPalette, WorkflowConfig, BrandProfile, RecommendationItem, UserStyleProfile } from '@/lib/types/userPreferences';
import { CardTemplate } from '@/lib/types/templateTypes';
import { CardEffect } from '@/lib/types/cardTypes';
import { CardElement } from '@/lib/types/cardElements';

/**
 * Hook to access and manage user personalization features
 */
export function usePersonalization() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [activeBrandProfile, setActiveBrandProfile] = useState<BrandProfile | null>(null);
  const [styleProfile, setStyleProfile] = useState<UserStyleProfile | null>(null);
  
  // Create services - use a dummy user ID if not authenticated
  const userId = user?.id || 'guest-user';
  const personalizationService = new PersonalizationService(userId);
  const recommendationService = new RecommendationService(styleProfile);
  
  // Load personalization data
  useEffect(() => {
    async function loadPersonalizationData() {
      setLoading(true);
      try {
        const prefs = await personalizationService.loadUserPreferences();
        setPreferences(prefs);
        
        // Load active brand profile if there is one
        if (prefs.activeBrandProfileId) {
          const profile = await personalizationService.getActiveBrandProfile();
          setActiveBrandProfile(profile);
        }
      } catch (error) {
        console.error('Failed to load personalization data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPersonalizationData();
  }, [user?.id]);
  
  /**
   * Toggle favorite status for an item
   */
  const toggleFavorite = useCallback(async (
    type: 'template' | 'effect' | 'element',
    itemId: string
  ): Promise<boolean> => {
    const result = await personalizationService.toggleFavorite(type, itemId);
    
    // Update local preferences
    const updatedPrefs = await personalizationService.loadUserPreferences();
    setPreferences(updatedPrefs);
    
    return result;
  }, [personalizationService]);
  
  /**
   * Create a new color palette
   */
  const createColorPalette = useCallback(async (
    palette: Omit<ColorPalette, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>
  ): Promise<ColorPalette> => {
    const result = await personalizationService.createColorPalette(palette);
    
    // Update local preferences
    const updatedPrefs = await personalizationService.loadUserPreferences();
    setPreferences(updatedPrefs);
    
    return result;
  }, [personalizationService]);
  
  /**
   * Create a new brand profile
   */
  const createBrandProfile = useCallback(async (
    profile: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BrandProfile> => {
    const result = await personalizationService.createBrandProfile(profile);
    
    // Update local preferences
    const updatedPrefs = await personalizationService.loadUserPreferences();
    setPreferences(updatedPrefs);
    
    // If this is the new active profile, update that too
    if (updatedPrefs.activeBrandProfileId === result.id) {
      setActiveBrandProfile(result);
    }
    
    return result;
  }, [personalizationService]);
  
  /**
   * Set active brand profile
   */
  const setActiveBrand = useCallback(async (profileId: string): Promise<void> => {
    await personalizationService.setActiveBrandProfile(profileId);
    
    // Update active profile
    const profile = await personalizationService.getActiveBrandProfile();
    setActiveBrandProfile(profile);
    
    // Update local preferences
    const updatedPrefs = await personalizationService.loadUserPreferences();
    setPreferences(updatedPrefs);
  }, [personalizationService]);
  
  /**
   * Record a card creation in history
   */
  const recordCardCreation = useCallback(async (
    cardId: string,
    templateId: string | undefined,
    effectsUsed: string[],
    elementsUsed: string[],
    timeSpent: number
  ): Promise<void> => {
    await personalizationService.addToHistory({
      cardId,
      templateId,
      effectsUsed,
      elementsUsed,
      timeSpent
    });
    
    // Update local preferences
    const updatedPrefs = await personalizationService.loadUserPreferences();
    setPreferences(updatedPrefs);
  }, [personalizationService]);
  
  /**
   * Get template recommendations
   */
  const getTemplateRecommendations = useCallback(async (
    imageUrl: string,
    availableTemplates: CardTemplate[]
  ): Promise<RecommendationItem<CardTemplate>[]> => {
    return recommendationService.getTemplateRecommendations(imageUrl, availableTemplates);
  }, [recommendationService]);
  
  /**
   * Get effect recommendations
   */
  const getEffectRecommendations = useCallback(async (
    imageUrl: string,
    availableEffects: CardEffect[]
  ): Promise<RecommendationItem<CardEffect>[]> => {
    return recommendationService.getEffectRecommendations(imageUrl, availableEffects);
  }, [recommendationService]);
  
  /**
   * Get element recommendations
   */
  const getElementRecommendations = useCallback(async (
    context: {
      imageUrl: string;
      templateId?: string;
      cardTitle?: string;
      tags?: string[];
    },
    availableElements: CardElement[]
  ): Promise<RecommendationItem<CardElement>[]> => {
    return recommendationService.getElementRecommendations(context, availableElements);
  }, [recommendationService]);
  
  /**
   * Get color recommendations based on image
   */
  const getColorRecommendations = useCallback(async (
    imageUrl: string
  ): Promise<string[][]> => {
    return recommendationService.getColorRecommendations(imageUrl);
  }, [recommendationService]);
  
  /**
   * Update workflow configuration
   */
  const updateWorkflow = useCallback(async (
    updates: Partial<WorkflowConfig>
  ): Promise<WorkflowConfig> => {
    const result = await personalizationService.updateWorkflowConfig(updates);
    
    // Update local preferences
    const updatedPrefs = await personalizationService.loadUserPreferences();
    setPreferences(updatedPrefs);
    
    return result;
  }, [personalizationService]);
  
  return {
    loading,
    preferences,
    activeBrandProfile,
    styleProfile,
    toggleFavorite,
    createColorPalette,
    createBrandProfile,
    setActiveBrand,
    recordCardCreation,
    getTemplateRecommendations,
    getEffectRecommendations,
    getElementRecommendations,
    getColorRecommendations,
    updateWorkflow
  };
}
