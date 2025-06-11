
export interface OaklandCardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'vintage' | 'modern' | 'protest' | 'artistic' | 'classic';
  imageUrl: string;
  aspectRatio: number; // 2.5:3.5 = 0.714
  backgroundConfig: {
    type: 'gradient' | 'solid' | 'image' | 'transparent';
    primary: string;
    secondary?: string;
    opacity?: number;
  };
  textConfig: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    placement: 'bottom' | 'top' | 'overlay' | 'side';
  };
  effects: string[];
  metadata: {
    team: 'Oakland Athletics';
    colors: string[];
    era?: string;
    tags: string[];
  };
}

export const OAKLAND_CARD_TEMPLATES: OaklandCardTemplate[] = [
  {
    id: 'alfred-neuman-as',
    name: 'Alfred E. Neuman A\'s',
    description: 'Vintage parody card design with classic Oakland spirit',
    category: 'vintage',
    imageUrl: '/images/alfred-neuman-as.jpg',
    aspectRatio: 0.714, // 2.5:3.5
    backgroundConfig: {
      type: 'gradient',
      primary: '#006341',
      secondary: '#003831',
      opacity: 0.15
    },
    textConfig: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#EFB21E',
      fontFamily: 'serif',
      placement: 'bottom'
    },
    effects: ['vintage', 'sepia'],
    metadata: {
      team: 'Oakland Athletics',
      colors: ['#006341', '#EFB21E', '#FFFFFF'],
      era: 'vintage',
      tags: ['parody', 'classic', 'humor', 'retro']
    }
  },
  {
    id: 'oakland-roots-tree',
    name: 'Oakland Roots Tree',
    description: 'Artistic tree design representing Oakland\'s deep community roots',
    category: 'artistic',
    imageUrl: '/images/oakland-roots-tree.jpg',
    aspectRatio: 0.714,
    backgroundConfig: {
      type: 'gradient',
      primary: '#2F5233',
      secondary: '#1A3A2A',
      opacity: 0.2
    },
    textConfig: {
      primaryColor: '#EFB21E',
      secondaryColor: '#FFFFFF',
      fontFamily: 'sans-serif',
      placement: 'bottom'
    },
    effects: ['artistic', 'nature'],
    metadata: {
      team: 'Oakland Athletics',
      colors: ['#2F5233', '#EFB21E', '#8B4513'],
      tags: ['community', 'roots', 'artistic', 'nature']
    }
  },
  {
    id: 'baseball-field-panorama',
    name: 'Field Panorama',
    description: 'Beautiful baseball field panoramic view',
    category: 'classic',
    imageUrl: '/images/baseball-field-panorama.jpg',
    aspectRatio: 0.714,
    backgroundConfig: {
      type: 'transparent',
      primary: '#006341',
      opacity: 0.1
    },
    textConfig: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#EFB21E',
      fontFamily: 'sans-serif',
      placement: 'overlay'
    },
    effects: ['stadium', 'panoramic'],
    metadata: {
      team: 'Oakland Athletics',
      colors: ['#4A7C59', '#EFB21E', '#87CEEB'],
      tags: ['stadium', 'field', 'panoramic', 'classic']
    }
  },
  {
    id: 'fck-fisher-bold',
    name: 'F*CK FISHER Bold',
    description: 'Bold protest statement with strong typography',
    category: 'protest',
    imageUrl: '/images/fck-fisher-bold.jpg',
    aspectRatio: 0.714,
    backgroundConfig: {
      type: 'gradient',
      primary: '#DC2626',
      secondary: '#B91C1C',
      opacity: 0.3
    },
    textConfig: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#FFD700',
      fontFamily: 'impact',
      placement: 'overlay'
    },
    effects: ['bold', 'protest'],
    metadata: {
      team: 'Oakland Athletics',
      colors: ['#DC2626', '#FFFFFF', '#FFD700'],
      tags: ['protest', 'bold', 'activism', 'statement']
    }
  },
  {
    id: 'sell-the-team',
    name: 'Sell The Team',
    description: 'Clean protest typography on Oakland green',
    category: 'protest',
    imageUrl: '/images/sell-the-team.jpg',
    aspectRatio: 0.714,
    backgroundConfig: {
      type: 'solid',
      primary: '#006341',
      opacity: 0.2
    },
    textConfig: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#EFB21E',
      fontFamily: 'sans-serif',
      placement: 'bottom'
    },
    effects: ['clean', 'protest'],
    metadata: {
      team: 'Oakland Athletics',
      colors: ['#006341', '#FFFFFF', '#EFB21E'],
      tags: ['protest', 'clean', 'typography', 'activism']
    }
  },
  {
    id: 'holy-toledo-retro',
    name: 'Holy Toledo Retro',
    description: 'Vintage dotted text design with nostalgic feel',
    category: 'vintage',
    imageUrl: '/images/holy-toledo-retro.jpg',
    aspectRatio: 0.714,
    backgroundConfig: {
      type: 'gradient',
      primary: '#92400E',
      secondary: '#654321',
      opacity: 0.2
    },
    textConfig: {
      primaryColor: '#EFB21E',
      secondaryColor: '#FFFFFF',
      fontFamily: 'serif',
      placement: 'bottom'
    },
    effects: ['vintage', 'dotted', 'retro'],
    metadata: {
      team: 'Oakland Athletics',
      colors: ['#92400E', '#EFB21E', '#FFFFFF'],
      era: 'retro',
      tags: ['vintage', 'broadcast', 'nostalgia', 'holy-toledo']
    }
  }
];

export const getOaklandTemplateById = (id: string): OaklandCardTemplate | undefined => {
  return OAKLAND_CARD_TEMPLATES.find(template => template.id === id);
};

export const getOaklandTemplatesByCategory = (category: OaklandCardTemplate['category']): OaklandCardTemplate[] => {
  return OAKLAND_CARD_TEMPLATES.filter(template => template.category === category);
};

export const OAKLAND_CARD_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: '⚾' },
  { id: 'vintage', name: 'Vintage', icon: '📻' },
  { id: 'modern', name: 'Modern', icon: '🏟️' },
  { id: 'protest', name: 'Protest', icon: '✊' },
  { id: 'artistic', name: 'Artistic', icon: '🎨' },
  { id: 'classic', name: 'Classic', icon: '🏆' }
];
