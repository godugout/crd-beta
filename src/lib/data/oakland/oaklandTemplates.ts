
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

export const OAKLAND_MEMORY_TEMPLATES: OaklandMemoryTemplate[] = [
  // Nostalgia Templates
  {
    id: 'classic-green-gold',
    name: 'Classic Green & Gold',
    category: 'nostalgia',
    era: 'dynasty_70s',
    description: 'Timeless A\'s colors with vintage baseball card feel',
    config: {
      backgroundColor: '#003831',
      primaryColor: '#006341',
      accentColor: '#EFB21E',
      textColor: '#FFFFFF',
      borderStyle: 'solid-gold',
      effectsEnabled: ['vintage-grain', 'dusty-glow']
    },
    tags: ['classic', 'vintage', 'baseball-card'],
    usage_count: 0
  },
  {
    id: 'coliseum-memories',
    name: 'Coliseum Memories',
    category: 'nostalgia',
    era: 'playoff_runs',
    description: 'Concrete and steel aesthetic of the Oakland Coliseum',
    config: {
      backgroundColor: '#4A4A4A',
      primaryColor: '#6B7280',
      accentColor: '#EFB21E',
      textColor: '#FFFFFF',
      borderStyle: 'concrete',
      effectsEnabled: ['stadium-lights', 'concrete-texture']
    },
    tags: ['coliseum', 'stadium', 'atmosphere'],
    usage_count: 0
  },
  
  // Protest Templates
  {
    id: 'sell-the-team',
    name: 'Sell The Team',
    category: 'protest',
    era: 'farewell',
    description: 'Bold protest messaging against ownership',
    config: {
      backgroundColor: '#DC2626',
      primaryColor: '#EF4444',
      accentColor: '#FFFFFF',
      textColor: '#FFFFFF',
      borderStyle: 'protest-bold',
      effectsEnabled: ['protest-glitch', 'urgency-pulse']
    },
    tags: ['protest', 'ownership', 'relocation'],
    usage_count: 0
  },
  {
    id: 'vegas-aint-home',
    name: 'Vegas Ain\'t Home',
    category: 'protest',
    era: 'farewell',
    description: 'Resistance to the Las Vegas move',
    config: {
      backgroundColor: '#1F2937',
      primaryColor: '#374151',
      accentColor: '#DC2626',
      textColor: '#FFFFFF',
      borderStyle: 'resistance',
      effectsEnabled: ['defiance-glow', 'home-pride']
    },
    tags: ['protest', 'las-vegas', 'home', 'loyalty'],
    usage_count: 0
  },

  // Community Templates
  {
    id: 'tailgate-family',
    name: 'Tailgate Family',
    category: 'community',
    era: 'playoff_runs',
    description: 'Warm community gathering vibes',
    config: {
      backgroundColor: '#8B4513',
      primaryColor: '#A0522D',
      accentColor: '#EFB21E',
      textColor: '#FFFFFF',
      borderStyle: 'warm-wood',
      effectsEnabled: ['family-warmth', 'bbq-smoke']
    },
    tags: ['family', 'tailgate', 'community', 'gathering'],
    usage_count: 0
  },
  {
    id: 'drumline-spirit',
    name: 'Drumline Spirit',
    category: 'community',
    era: 'playoff_runs',
    description: 'Oakland A\'s drumline energy and rhythm',
    config: {
      backgroundColor: '#1E3A8A',
      primaryColor: '#3B82F6',
      accentColor: '#EFB21E',
      textColor: '#FFFFFF',
      borderStyle: 'rhythm-waves',
      effectsEnabled: ['drumbeat-pulse', 'crowd-energy']
    },
    tags: ['drumline', 'music', 'energy', 'tradition'],
    usage_count: 0
  },

  // Celebration Templates
  {
    id: 'walk-off-magic',
    name: 'Walk-Off Magic',
    category: 'celebration',
    era: 'moneyball',
    description: 'Electric moments of victory',
    config: {
      backgroundColor: '#059669',
      primaryColor: '#10B981',
      accentColor: '#FFD700',
      textColor: '#FFFFFF',
      borderStyle: 'electric-gold',
      effectsEnabled: ['victory-sparkle', 'crowd-roar']
    },
    tags: ['walk-off', 'victory', 'excitement', 'clutch'],
    usage_count: 0
  },
  {
    id: 'perfect-game',
    name: 'Perfect Game',
    category: 'celebration',
    era: 'moneyball',
    description: 'Rare moments of baseball perfection',
    config: {
      backgroundColor: '#7C3AED',
      primaryColor: '#8B5CF6',
      accentColor: '#FBBF24',
      textColor: '#FFFFFF',
      borderStyle: 'perfection-halo',
      effectsEnabled: ['perfect-shine', 'historical-glow']
    },
    tags: ['perfect-game', 'history', 'rare', 'excellence'],
    usage_count: 0
  },

  // Championship Templates
  {
    id: 'dynasty-gold',
    name: 'Dynasty Gold',
    category: 'championship',
    era: 'dynasty_70s',
    description: '1970s championship dynasty glory',
    config: {
      backgroundColor: '#B45309',
      primaryColor: '#D97706',
      accentColor: '#FCD34D',
      textColor: '#1F2937',
      borderStyle: 'championship-banner',
      effectsEnabled: ['dynasty-crown', 'golden-era']
    },
    tags: ['championship', 'dynasty', '1970s', 'glory'],
    usage_count: 0
  },
  {
    id: 'bash-brothers',
    name: 'Bash Brothers',
    category: 'championship',
    era: 'bash_brothers',
    description: 'Power hitting era of Canseco and McGwire',
    config: {
      backgroundColor: '#1E40AF',
      primaryColor: '#3B82F6',
      accentColor: '#F59E0B',
      textColor: '#FFFFFF',
      borderStyle: 'power-strike',
      effectsEnabled: ['home-run-trail', 'bash-impact']
    },
    tags: ['bash-brothers', 'power', 'home-runs', '1980s'],
    usage_count: 0
  }
];

export const getTemplatesByCategory = (category: OaklandMemoryTemplate['category']) => {
  return OAKLAND_MEMORY_TEMPLATES.filter(template => template.category === category);
};

export const getTemplatesByEra = (era: OaklandMemoryTemplate['era']) => {
  return OAKLAND_MEMORY_TEMPLATES.filter(template => template.era === era);
};

export const getTemplateById = (id: string) => {
  return OAKLAND_MEMORY_TEMPLATES.find(template => template.id === id);
};
