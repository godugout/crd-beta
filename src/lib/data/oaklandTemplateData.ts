
import { OaklandTemplate, TemplateCategory, TemplateSection } from '@/lib/types/oaklandTemplates';

export const OAKLAND_TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'all',
    name: 'All Templates',
    description: 'Browse all available Oakland A\'s templates',
    icon: '⚾',
    color: '#EFB21E',
    count: 0,
    isPopular: true
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia',
    description: 'Classic Oakland memories and vintage moments',
    icon: '📸',
    color: '#8B4513',
    count: 0,
    isPopular: true
  },
  {
    id: 'celebration',
    name: 'Celebration',
    description: 'Victory moments and championship memories',
    icon: '🏆',
    color: '#FFD700',
    count: 0,
    isPopular: true
  },
  {
    id: 'protest',
    name: 'Protest',
    description: 'Stand up for Oakland - voices of resistance',
    icon: '✊',
    color: '#DC2626',
    count: 0,
    isPopular: false
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Fan connections and shared experiences',
    icon: '🤝',
    color: '#059669',
    count: 0,
    isPopular: true
  }
];

export const OAKLAND_TEMPLATES: OaklandTemplate[] = [
  {
    id: 'classic-coliseum',
    name: 'Classic Coliseum',
    description: 'Timeless Oakland-Alameda County Coliseum design',
    category: 'nostalgia',
    subcategory: 'stadium',
    thumbnailUrl: '/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png',
    completionPercentage: 95,
    difficulty: 'beginner',
    isNew: false,
    isTrending: true,
    isFavorite: false,
    usageCount: 1247,
    metadata: {
      era: '1970s',
      theme: ['stadium', 'vintage', 'classic'],
      colors: {
        primary: '#003831',
        secondary: '#EFB21E',
        accent: '#FFFFFF'
      },
      features: ['vintage borders', 'classic typography', 'sepia effects'],
      estimatedTime: 5
    },
    effects: ['vintage-sepia', 'dusty-glow'],
    tags: ['coliseum', 'vintage', 'classic', 'green'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'bash-brothers',
    name: 'Bash Brothers Era',
    description: 'Celebrate the McGwire & Canseco power duo',
    category: 'celebration',
    subcategory: 'players',
    thumbnailUrl: '/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png',
    completionPercentage: 92,
    difficulty: 'intermediate',
    isNew: false,
    isTrending: true,
    isFavorite: true,
    usageCount: 856,
    metadata: {
      era: '1980s',
      theme: ['power', 'celebration', 'legends'],
      colors: {
        primary: '#FFD700',
        secondary: '#003831',
        accent: '#FFFFFF'
      },
      features: ['gold foil effects', 'power graphics', 'retro styling'],
      estimatedTime: 8
    },
    effects: ['gold-foil', 'shine-effect'],
    tags: ['bash brothers', 'mcgwire', 'canseco', 'power'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'moneyball-magic',
    name: 'Moneyball Magic',
    description: 'Celebrating the revolutionary 2002 season',
    category: 'nostalgia',
    subcategory: 'historic',
    thumbnailUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
    completionPercentage: 88,
    difficulty: 'intermediate',
    isNew: true,
    isTrending: false,
    isFavorite: false,
    usageCount: 423,
    metadata: {
      era: '2000s',
      theme: ['analytics', 'underdog', 'innovation'],
      colors: {
        primary: '#003831',
        secondary: '#C0C0C0',
        accent: '#EFB21E'
      },
      features: ['data visualization', 'modern typography', 'clean design'],
      estimatedTime: 10
    },
    effects: ['modern-clean', 'data-overlay'],
    tags: ['moneyball', '2002', 'beane', 'analytics'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'sell-the-team',
    name: 'Sell The Team',
    description: 'Voice your protest against ownership',
    category: 'protest',
    subcategory: 'ownership',
    thumbnailUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
    completionPercentage: 96,
    difficulty: 'advanced',
    isNew: false,
    isTrending: true,
    isFavorite: false,
    usageCount: 1891,
    metadata: {
      era: '2020s',
      theme: ['protest', 'activism', 'ownership'],
      colors: {
        primary: '#DC2626',
        secondary: '#000000',
        accent: '#FFFFFF'
      },
      features: ['bold typography', 'protest styling', 'high contrast'],
      estimatedTime: 6
    },
    effects: ['protest-red', 'glitch-overlay'],
    tags: ['protest', 'ownership', 'selltheteam', 'activism'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'rally-possum',
    name: 'Rally Possum Spirit',
    description: 'Honor the legendary Rally Possum',
    category: 'community',
    subcategory: 'mascot',
    thumbnailUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    completionPercentage: 91,
    difficulty: 'beginner',
    isNew: false,
    isTrending: false,
    isFavorite: true,
    usageCount: 672,
    metadata: {
      era: '2010s',
      theme: ['mascot', 'community', 'fun'],
      colors: {
        primary: '#8B4513',
        secondary: '#EFB21E',
        accent: '#FFFFFF'
      },
      features: ['playful graphics', 'community spirit', 'warm colors'],
      estimatedTime: 4
    },
    effects: ['warm-glow', 'community-feel'],
    tags: ['rally possum', 'mascot', 'community', 'spirit'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'world-series-89',
    name: '1989 World Series',
    description: 'Remember the earthquake-interrupted championship',
    category: 'celebration',
    subcategory: 'championship',
    thumbnailUrl: '/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png',
    completionPercentage: 94,
    difficulty: 'intermediate',
    isNew: false,
    isTrending: false,
    isFavorite: false,
    usageCount: 534,
    metadata: {
      era: '1980s',
      theme: ['championship', 'historic', 'bay bridge'],
      colors: {
        primary: '#FFD700',
        secondary: '#003831',
        accent: '#FFFFFF'
      },
      features: ['championship styling', 'historic elements', 'gold accents'],
      estimatedTime: 12
    },
    effects: ['championship-glow', 'historic-feel'],
    tags: ['world series', '1989', 'championship', 'earthquake'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  }
];

export const TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    id: 'trending',
    title: 'Trending Now',
    description: 'Most popular templates this week',
    templates: OAKLAND_TEMPLATES.filter(t => t.isTrending),
    priority: 1
  },
  {
    id: 'recent',
    title: 'Recently Used',
    description: 'Your recent template selections',
    templates: OAKLAND_TEMPLATES.filter(t => t.lastUsed).slice(0, 4),
    priority: 2
  },
  {
    id: 'favorites',
    title: 'Your Favorites',
    description: 'Templates you\'ve saved for later',
    templates: OAKLAND_TEMPLATES.filter(t => t.isFavorite),
    priority: 3
  },
  {
    id: 'new',
    title: 'New Arrivals',
    description: 'Fresh templates for your memories',
    templates: OAKLAND_TEMPLATES.filter(t => t.isNew),
    priority: 4
  }
];
