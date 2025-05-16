
import { UserPreferences, ColorPalette, WorkflowConfig, BrandProfile, UserStyleProfile, RecommendationItem } from '../types/userPreferences';
import { CardTemplate } from '../types/templateTypes';
import { CardEffect } from '../types/cardTypes';
import { CardElement } from '../types/cardElements';

/**
 * Service that handles user personalization features
 */
export class PersonalizationService {
  private userId: string;
  private preferences: UserPreferences | null = null;
  private styleProfile: UserStyleProfile | null = null;
  
  constructor(userId: string) {
    this.userId = userId;
  }
  
  /**
   * Load user preferences from storage
   */
  async loadUserPreferences(): Promise<UserPreferences> {
    try {
      // In a real implementation, this would fetch from API/database
      const storedPrefs = localStorage.getItem(`user_preferences_${this.userId}`);
      if (storedPrefs) {
        this.preferences = JSON.parse(storedPrefs);
      } else {
        // Create default preferences
        this.preferences = this.createDefaultPreferences();
        await this.saveUserPreferences();
      }
      
      return this.preferences;
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      this.preferences = this.createDefaultPreferences();
      return this.preferences;
    }
  }
  
  /**
   * Save user preferences to storage
   */
  async saveUserPreferences(): Promise<void> {
    if (!this.preferences) return;
    
    try {
      // In a real implementation, this would save to API/database
      localStorage.setItem(`user_preferences_${this.userId}`, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }
  
  /**
   * Create default user preferences
   */
  private createDefaultPreferences(): UserPreferences {
    const now = new Date().toISOString();
    
    return {
      id: crypto.randomUUID(),
      userId: this.userId,
      defaultEffects: [],
      colorPalettes: [this.createDefaultColorPalette()],
      favoriteTemplates: [],
      favoriteEffects: [],
      favoriteElements: [],
      workflow: this.createDefaultWorkflow(),
      lastUsedTools: [],
      creationHistory: [],
      brandProfiles: [],
      recommendationsEnabled: true,
      recommendationPreferences: {
        showTemplateRecommendations: true,
        showEffectRecommendations: true,
        showColorRecommendations: true,
        showElementRecommendations: true,
      },
      extra: {},
      createdAt: now,
      updatedAt: now
    };
  }
  
  /**
   * Create a default color palette
   */
  private createDefaultColorPalette(): ColorPalette {
    const now = new Date().toISOString();
    
    return {
      id: crypto.randomUUID(),
      name: 'Default',
      colors: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      isDefault: true,
      isSystem: true,
      createdAt: now,
      updatedAt: now
    };
  }
  
  /**
   * Create default workflow configuration
   */
  private createDefaultWorkflow(): WorkflowConfig {
    const now = new Date().toISOString();
    
    return {
      id: crypto.randomUUID(),
      name: 'Default',
      quickAccessTools: ['upload', 'effects', 'text', 'elements'],
      defaultView: 'simple',
      layoutPreferences: {
        sidebarPosition: 'left',
        panelSizes: {
          'main': 70,
          'sidebar': 30
        },
        visiblePanels: ['tools', 'properties', 'layers'],
        collapsedPanels: []
      },
      shortcuts: {
        'save': 'ctrl+s',
        'undo': 'ctrl+z',
        'redo': 'ctrl+shift+z',
        'preview': 'ctrl+p'
      },
      createdAt: now,
      updatedAt: now
    };
  }
  
  /**
   * Add an item to history
   */
  async addToHistory(historyItem: Omit<CreationHistoryItem, 'id' | 'createdAt'>): Promise<void> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences) return;
    
    const newItem = {
      ...historyItem,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    this.preferences.creationHistory = [
      newItem,
      ...this.preferences.creationHistory.slice(0, 49) // Keep last 50 items
    ];
    
    this.preferences.updatedAt = new Date().toISOString();
    await this.saveUserPreferences();
    
    // Update user style profile when history changes
    await this.updateUserStyleProfile();
  }
  
  /**
   * Toggle favorite status of an item
   */
  async toggleFavorite(type: 'template' | 'effect' | 'element', itemId: string): Promise<boolean> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences) return false;
    
    let favoritesList: string[] = [];
    
    switch (type) {
      case 'template':
        favoritesList = this.preferences.favoriteTemplates;
        break;
      case 'effect':
        favoritesList = this.preferences.favoriteEffects;
        break;
      case 'element':
        favoritesList = this.preferences.favoriteElements;
        break;
    }
    
    const isFavorite = favoritesList.includes(itemId);
    
    if (isFavorite) {
      // Remove from favorites
      const index = favoritesList.indexOf(itemId);
      if (index !== -1) {
        favoritesList.splice(index, 1);
      }
    } else {
      // Add to favorites
      favoritesList.push(itemId);
    }
    
    this.preferences.updatedAt = new Date().toISOString();
    await this.saveUserPreferences();
    
    return !isFavorite; // Return new favorite status
  }
  
  /**
   * Create a new color palette
   */
  async createColorPalette(palette: Omit<ColorPalette, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>): Promise<ColorPalette> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences) throw new Error('User preferences not loaded');
    
    const now = new Date().toISOString();
    const newPalette = {
      ...palette,
      id: crypto.randomUUID(),
      isSystem: false,
      createdAt: now,
      updatedAt: now
    };
    
    this.preferences.colorPalettes.push(newPalette);
    this.preferences.updatedAt = now;
    await this.saveUserPreferences();
    
    return newPalette;
  }
  
  /**
   * Create a new brand profile
   */
  async createBrandProfile(profile: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandProfile> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences) throw new Error('User preferences not loaded');
    
    const now = new Date().toISOString();
    const newProfile = {
      ...profile,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    
    this.preferences.brandProfiles.push(newProfile);
    
    // If this is the first brand profile, make it active
    if (this.preferences.brandProfiles.length === 1) {
      this.preferences.activeBrandProfileId = newProfile.id;
    }
    
    this.preferences.updatedAt = now;
    await this.saveUserPreferences();
    
    return newProfile;
  }
  
  /**
   * Set active brand profile
   */
  async setActiveBrandProfile(profileId: string): Promise<void> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences) return;
    
    // Verify profile exists
    const profileExists = this.preferences.brandProfiles.some(p => p.id === profileId);
    if (!profileExists) throw new Error('Brand profile not found');
    
    this.preferences.activeBrandProfileId = profileId;
    this.preferences.updatedAt = new Date().toISOString();
    await this.saveUserPreferences();
  }
  
  /**
   * Update user style profile based on history and preferences
   */
  private async updateUserStyleProfile(): Promise<void> {
    if (!this.preferences) return;
    
    // This would be a more complex algorithm in production
    // to analyze user behavior and preferences
    this.styleProfile = {
      favoriteColors: this.extractFavoriteColors(),
      favoriteElements: this.preferences.favoriteElements,
      favoriteEffects: this.preferences.favoriteEffects,
      stylePreferences: {
        minimalVsDetailed: 50, // Default middle value
        classicVsModern: 50,
        brightVsDark: 50,
        patternedVsClean: 50
      }
    };
    
    // Update style preferences based on history
    if (this.preferences.creationHistory.length > 0) {
      // This would use more sophisticated analysis in production
      const recentHistory = this.preferences.creationHistory.slice(0, 10);
      
      // Just a simple example update based on effects
      const hasHolographicEffects = recentHistory.some(
        h => h.effectsUsed.some(e => e.includes('holographic'))
      );
      
      if (hasHolographicEffects) {
        this.styleProfile.stylePreferences.classicVsModern += 15;
      }
    }
    
    // Normalize values to stay within 0-100
    for (const key in this.styleProfile.stylePreferences) {
      const typedKey = key as keyof typeof this.styleProfile.stylePreferences;
      this.styleProfile.stylePreferences[typedKey] = Math.max(0, 
        Math.min(100, this.styleProfile.stylePreferences[typedKey])
      );
    }
  }
  
  /**
   * Extract favorite colors from palettes and history
   */
  private extractFavoriteColors(): string[] {
    if (!this.preferences) return [];
    
    const favoriteColors = new Set<string>();
    
    // Add colors from custom palettes
    this.preferences.colorPalettes.forEach(palette => {
      if (!palette.isSystem) {
        palette.colors.forEach(color => favoriteColors.add(color));
      }
    });
    
    // Limit to 10 colors
    return Array.from(favoriteColors).slice(0, 10);
  }
  
  /**
   * Get active brand profile
   */
  async getActiveBrandProfile(): Promise<BrandProfile | null> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences || !this.preferences.activeBrandProfileId) return null;
    
    return this.preferences.brandProfiles.find(
      p => p.id === this.preferences?.activeBrandProfileId
    ) || null;
  }
  
  /**
   * Get user workflow configuration
   */
  async getWorkflowConfig(): Promise<WorkflowConfig> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences) throw new Error('User preferences not loaded');
    
    return this.preferences.workflow;
  }
  
  /**
   * Update workflow configuration
   */
  async updateWorkflowConfig(updates: Partial<WorkflowConfig>): Promise<WorkflowConfig> {
    if (!this.preferences) await this.loadUserPreferences();
    if (!this.preferences) throw new Error('User preferences not loaded');
    
    this.preferences.workflow = {
      ...this.preferences.workflow,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.preferences.updatedAt = new Date().toISOString();
    await this.saveUserPreferences();
    
    return this.preferences.workflow;
  }
}
