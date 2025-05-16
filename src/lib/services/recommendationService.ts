
import { RecommendationItem, RecommendationType, UserStyleProfile } from '../types/userPreferences';
import { CardTemplate } from '../types/templateTypes';
import { CardElement } from '../types/cardElements';
import { CardEffect } from '../types/cardTypes';

/**
 * Service that provides personalized recommendations
 */
export class RecommendationService {
  private styleProfile: UserStyleProfile | null = null;
  
  constructor(styleProfile: UserStyleProfile | null = null) {
    this.styleProfile = styleProfile;
  }
  
  /**
   * Set or update the user style profile
   */
  setStyleProfile(profile: UserStyleProfile): void {
    this.styleProfile = profile;
  }
  
  /**
   * Get recommendations for templates based on an image and user preferences
   */
  async getTemplateRecommendations(
    imageUrl: string,
    availableTemplates: CardTemplate[]
  ): Promise<RecommendationItem<CardTemplate>[]> {
    // This would use image analysis and user preference matching
    // For now, we'll mock the functionality
    
    const recommendations: RecommendationItem<CardTemplate>[] = [];
    
    // Sort by assumed relevance - in a real implementation,
    // this would use actual image analysis and style matching
    for (const template of availableTemplates) {
      const score = this.calculateTemplateScore(template);
      
      // Only include reasonable matches
      if (score > 0.5) {
        recommendations.push({
          item: template,
          score: score,
          reason: this.getTemplateRecommendationReason(template, score)
        });
      }
    }
    
    // Sort by score and return top 5
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }
  
  /**
   * Get recommendations for effects based on an image and user preferences
   */
  async getEffectRecommendations(
    imageUrl: string,
    availableEffects: CardEffect[]
  ): Promise<RecommendationItem<CardEffect>[]> {
    // Similar to templates, but for effects
    const recommendations: RecommendationItem<CardEffect>[] = [];
    
    // Analyze image characteristics (would use ML in production)
    const isPortrait = true; // Mock value
    const hasHighContrast = false; // Mock value
    const dominantColors = ['#1a2b3c', '#ffffff']; // Mock values
    
    for (const effect of availableEffects) {
      let score = 0.5; // Base score
      let reason = '';
      
      // Apply simple heuristics for demonstration
      if (effect.name.includes('Holographic') || effect.name.includes('Shimmer')) {
        if (hasHighContrast) {
          score += 0.3;
          reason = 'Works well with your high-contrast image';
        }
      } else if (effect.name.includes('Gold') || effect.name.includes('Chrome')) {
        if (isPortrait) {
          score += 0.2;
          reason = 'Complements portrait-style photos';
        }
      } else if (effect.name.includes('Vintage')) {
        score += 0.1;
        reason = 'Classic effect for any card';
      }
      
      // Adjust based on user preferences if available
      if (this.styleProfile) {
        if (this.styleProfile.favoriteEffects.includes(effect.id)) {
          score += 0.2;
          reason = 'Based on your favorite effects';
        }
      }
      
      // Only include reasonable matches
      if (score > 0.6) {
        recommendations.push({
          item: effect,
          score: score,
          reason: reason || 'Recommended based on your image'
        });
      }
    }
    
    // Sort by score and return top 3
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
  
  /**
   * Get element recommendations based on card context and user preferences
   */
  async getElementRecommendations(
    context: {
      imageUrl: string;
      templateId?: string;
      cardTitle?: string;
      tags?: string[];
    },
    availableElements: CardElement[]
  ): Promise<RecommendationItem<CardElement>[]> {
    // Group elements by category for easier analysis
    const elementsByCategory = availableElements.reduce((acc, element) => {
      if (!acc[element.category]) {
        acc[element.category] = [];
      }
      acc[element.category].push(element);
      return acc;
    }, {} as Record<string, CardElement[]>);
    
    const recommendations: RecommendationItem<CardElement>[] = [];
    
    // Analyze card content for relevant elements
    // This would be more sophisticated in production
    const tags = context.tags || [];
    const title = context.cardTitle?.toLowerCase() || '';
    
    // Add recommendations for relevant categories
    if (tags.includes('sports') || title.includes('sports') || 
        title.includes('player') || title.includes('team')) {
      // Recommend sports-related elements
      if (elementsByCategory.sports) {
        for (const element of elementsByCategory.sports) {
          recommendations.push({
            item: element,
            score: 0.85,
            reason: 'Matches sports theme',
            category: 'sports'
          });
        }
      }
      
      // Recommend team elements
      if (elementsByCategory.teams) {
        for (const element of elementsByCategory.teams) {
          recommendations.push({
            item: element,
            score: 0.8,
            reason: 'Team branding elements',
            category: 'teams'
          });
        }
      }
    }
    
    // Add seasonal recommendations
    const currentMonth = new Date().getMonth();
    if (currentMonth === 11 || currentMonth === 0) { // December or January
      // Recommend holiday elements
      if (elementsByCategory.holiday) {
        for (const element of elementsByCategory.holiday) {
          recommendations.push({
            item: element,
            score: 0.75,
            reason: 'Seasonal holiday elements',
            category: 'holiday'
          });
        }
      }
    }
    
    // Always add some decorative elements
    if (elementsByCategory.decorative) {
      for (const element of elementsByCategory.decorative) {
        recommendations.push({
          item: element,
          score: 0.65,
          reason: 'Decorative accents for your card',
          category: 'decorative'
        });
      }
    }
    
    // Adjust based on user profile if available
    if (this.styleProfile) {
      recommendations.forEach(rec => {
        if (this.styleProfile?.favoriteElements.includes(rec.item.id)) {
          rec.score += 0.2;
          rec.reason = 'From your favorite elements';
        }
      });
    }
    
    // Sort and limit to top recommendations for each category
    const topRecommendations = this.getTopRecommendationsByCategory(recommendations);
    return topRecommendations.slice(0, 8);
  }
  
  /**
   * Get color palette recommendations based on image and user preferences
   */
  async getColorRecommendations(imageUrl: string): Promise<string[][]> {
    // This would extract colors from the image in production
    // For now, return mock results
    
    // Mock palettes (would be generated from image analysis)
    return [
      ['#1a2b3c', '#3d4e5f', '#6d7e8f', '#9da0b1', '#d0d1e1'],
      ['#2c3e50', '#e74c3c', '#3498db', '#2ecc71', '#f1c40f'],
      ['#34495e', '#9b59b6', '#16a085', '#f39c12', '#d35400']
    ];
  }
  
  /**
   * Calculate a match score for a template based on user style profile
   */
  private calculateTemplateScore(template: CardTemplate): number {
    if (!this.styleProfile) return 0.7; // Default score if no profile
    
    let score = 0.5; // Base score
    
    // Adjust based on favorites
    if (this.styleProfile.favoriteTemplates.includes(template.id)) {
      score += 0.3;
    }
    
    // Adjust based on style preferences (simplified example)
    if (template.category === 'modern' && 
        this.styleProfile.stylePreferences.classicVsModern > 60) {
      score += 0.2;
    } else if (template.category === 'classic' && 
        this.styleProfile.stylePreferences.classicVsModern < 40) {
      score += 0.2;
    }
    
    // Adjust based on popularity if no strong preference match
    if (score < 0.7 && template.popularity && template.popularity > 7) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  }
  
  /**
   * Generate a human-readable reason for template recommendation
   */
  private getTemplateRecommendationReason(template: CardTemplate, score: number): string {
    if (score > 0.8) {
      if (this.styleProfile?.favoriteTemplates.includes(template.id)) {
        return 'One of your favorite templates';
      }
      return 'Perfectly matches your style preferences';
    } else if (score > 0.7) {
      return 'Great fit for your creative style';
    } else if (score > 0.6) {
      return template.isOfficial 
        ? 'Popular official template that matches your style' 
        : 'Good match for your image';
    }
    return 'You might like this template';
  }
  
  /**
   * Get top recommendations for each category
   */
  private getTopRecommendationsByCategory(
    recommendations: RecommendationItem<CardElement>[]
  ): RecommendationItem<CardElement>[] {
    const categories = new Set(recommendations.map(r => r.category || 'other'));
    const result: RecommendationItem<CardElement>[] = [];
    
    // Get top 2 recommendations per category
    categories.forEach(category => {
      const categoryRecs = recommendations
        .filter(r => (r.category || 'other') === category)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);
      
      result.push(...categoryRecs);
    });
    
    return result.sort((a, b) => b.score - a.score);
  }
}
