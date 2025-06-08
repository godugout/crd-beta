import { PROFESSIONAL_OAKLAND_TEMPLATES, ProfessionalOaklandTemplate } from './professionalTemplates';

// Keep existing interface for backward compatibility
export interface OaklandMemoryTemplate {
  id: string;
  name: string;
  category: 'nostalgia' | 'protest' | 'community' | 'celebration' | 'championship';
  era: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  description: string;
  preview_url?: string;
  config: {
    backgroundColor: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
    borderStyle: string;
    effectsEnabled: string[];
  };
  tags: string[];
  usage_count: number;
}

// Convert professional templates to legacy format for compatibility
const convertToLegacyFormat = (professionalTemplate: ProfessionalOaklandTemplate): OaklandMemoryTemplate => ({
  id: professionalTemplate.id,
  name: professionalTemplate.name,
  category: professionalTemplate.category,
  era: professionalTemplate.era,
  description: professionalTemplate.description,
  preview_url: professionalTemplate.preview_url,
  config: {
    backgroundColor: professionalTemplate.config.effects.background,
    primaryColor: professionalTemplate.config.colors.primary,
    accentColor: professionalTemplate.config.colors.accent,
    textColor: professionalTemplate.config.colors.text,
    borderStyle: professionalTemplate.config.effects.border,
    effectsEnabled: professionalTemplate.config.effects.animation || []
  },
  tags: professionalTemplate.tags,
  usage_count: 0
});

// Export professional templates as main templates
export const OAKLAND_MEMORY_TEMPLATES: OaklandMemoryTemplate[] = 
  PROFESSIONAL_OAKLAND_TEMPLATES.map(convertToLegacyFormat);

// Re-export professional templates for new components
export { PROFESSIONAL_OAKLAND_TEMPLATES } from './professionalTemplates';
export type { ProfessionalOaklandTemplate } from './professionalTemplates';

// Keep existing utility functions for backward compatibility
export const getTemplatesByCategory = (category: OaklandMemoryTemplate['category']) => {
  return OAKLAND_MEMORY_TEMPLATES.filter(template => template.category === category);
};

export const getTemplatesByEra = (era: OaklandMemoryTemplate['era']) => {
  return OAKLAND_MEMORY_TEMPLATES.filter(template => template.era === era);
};

export const getTemplateById = (id: string) => {
  return OAKLAND_MEMORY_TEMPLATES.find(template => template.id === id);
};

// New professional template utilities
export const getProfessionalTemplateById = (id: string) => {
  return PROFESSIONAL_OAKLAND_TEMPLATES.find(template => template.id === id);
};

export const getProfessionalTemplatesByCategory = (category: ProfessionalOaklandTemplate['category']) => {
  return PROFESSIONAL_OAKLAND_TEMPLATES.filter(template => template.category === category);
};

export const getProfessionalTemplatesByEra = (era: ProfessionalOaklandTemplate['era']) => {
  return PROFESSIONAL_OAKLAND_TEMPLATES.filter(template => template.era === era);
};
