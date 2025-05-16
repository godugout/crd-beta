
import { CardTemplate } from './TemplateTypes';

// Define a collection of predefined card templates
const templateLibrary: Record<string, CardTemplate> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional trading card style with clean borders',
    thumbnail: '/images/templates/classic.png',
    category: 'general',
    isOfficial: true,
    popularity: 100,
    designDefaults: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000'
      }
    }
  },
  
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with sleek edges',
    thumbnail: '/images/templates/modern.png',
    category: 'general',
    isOfficial: true,
    popularity: 90,
    designDefaults: {
      cardStyle: {
        template: 'modern',
        effect: 'refractor',
        borderRadius: '12px',
        borderColor: '#48BB78'
      }
    }
  },
  
  vintage: {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro style with aged texture',
    thumbnail: '/images/templates/vintage.png',
    category: 'general',
    isOfficial: true,
    popularity: 85,
    designDefaults: {
      cardStyle: {
        template: 'vintage',
        effect: 'vintage',
        borderRadius: '4px',
        borderColor: '#8B5CF6'
      },
      textStyle: {
        fontFamily: 'serif'
      }
    }
  },
  
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury design with gold accents',
    thumbnail: '/images/templates/premium.png',
    category: 'premium',
    isOfficial: true,
    popularity: 80,
    designDefaults: {
      cardStyle: {
        template: 'premium',
        effect: 'gold',
        borderRadius: '16px',
        borderColor: '#F97316'
      }
    }
  },
  
  sports: {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic card design with team colors',
    thumbnail: '/images/templates/sports.png',
    category: 'sports',
    isOfficial: true,
    popularity: 95,
    designDefaults: {
      cardStyle: {
        template: 'sports',
        effect: 'chrome',
        borderRadius: '6px',
        borderColor: '#0EA5E9'
      }
    }
  }
};

// Export the template library
export default templateLibrary;

// Helper to get all templates as an array
export const getAllTemplates = (): CardTemplate[] => {
  return Object.values(templateLibrary);
};

// Helper to get a specific template
export const getTemplateById = (id: string): CardTemplate | undefined => {
  return templateLibrary[id];
};

// Helper to get templates by category
export const getTemplatesByCategory = (category: string): CardTemplate[] => {
  return getAllTemplates().filter(template => template.category === category);
};

// Export CardTemplate for typing
export type { CardTemplate };
