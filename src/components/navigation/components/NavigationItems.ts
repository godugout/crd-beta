
import {
  Image,
  Layers,
  PlusSquare,
  PlayCircle,
  Users,
  Settings,
  Home,
  Package,
  FlaskConical,
  Sparkles,
} from 'lucide-react';

export interface NavigationItem {
  title: string;
  path: string;
  icon?: React.ElementType;
  description?: string;
  highlight?: boolean;
}

export interface NavigationSection {
  key: string;
  title: string;
  items: NavigationItem[];
  featuredItem?: NavigationItem & { bgGradient?: boolean };
  layout?: 'grid' | 'list';
  columns?: number;
}

export const cardsNavigation: NavigationSection = {
  key: 'cards',
  title: 'Cards',
  layout: 'grid',
  columns: 2,
  featuredItem: {
    title: 'Card Gallery',
    path: '/cards',
    icon: Image,
    description: 'Browse and discover cards from various collections',
    bgGradient: true
  },
  items: [
    {
      title: 'Create New Card',
      path: '/cards/create',
      icon: PlusSquare,
      description: 'Design and publish your own custom cards'
    },
    {
      title: 'Batch Operations',
      path: '/cards/batch',
      icon: Image,
      description: 'Manage multiple assets and update cards in bulk'
    }
  ]
};

export const collectionsNavigation: NavigationSection = {
  key: 'collections',
  title: 'Collections',
  layout: 'list',
  featuredItem: {
    title: 'All Collections',
    path: '/collections',
    icon: Layers,
    description: 'Browse all card collections and sets',
    bgGradient: true
  },
  items: [
    {
      title: 'Create Collection',
      path: '/collections/create',
      icon: PlusSquare,
      description: 'Create and organize a new collection of cards'
    },
    {
      title: 'Memory Packs',
      path: '/packs',
      icon: Package,
      description: 'Explore themed memory card packs'
    },
    {
      title: 'Create Memory Pack',
      path: '/packs/create',
      icon: PlusSquare,
      description: 'Create a new themed memory pack'
    }
  ]
};

export const teamsNavigation: NavigationSection = {
  key: 'teams',
  title: 'Teams',
  layout: 'grid',
  columns: 2,
  featuredItem: {
    title: 'All Teams',
    path: '/teams',
    icon: Users,
    description: 'Browse all team collections and memories',
    bgGradient: true
  },
  items: [
    {
      title: 'Oakland A\'s',
      path: '/teams/oakland',
      description: 'Oakland Athletics team memories and collections'
    },
    {
      title: 'Game Day Mode',
      path: '/game-day',
      icon: PlayCircle,
      description: 'Capture and share memories during live games',
      highlight: true
    }
  ]
};

export const featuresNavigation: NavigationSection = {
  key: 'features',
  title: 'Features',
  layout: 'grid',
  columns: 2,
  items: [
    {
      title: 'AR Card Viewer',
      path: '/features/ar-viewer',
      description: 'View cards in augmented reality'
    },
    {
      title: 'Baseball Card Viewer',
      path: '/features/baseball-viewer',
      description: 'Interactive baseball card experience'
    },
    {
      title: 'Media Library',
      path: '/media-library',
      description: 'Manage your media assets'
    },
    {
      title: 'Game Day Mode',
      path: '/game-day',
      description: 'Capture and share memories during live games',
      highlight: true
    }
  ]
};

// Route mapping for breadcrumbs
export const routeMappings: Record<string, { path: string; label: string; parent?: string }> = {
  // Root
  '': { path: '/', label: 'Home', parent: undefined },
  
  // Cards section
  'cards': { path: '/cards', label: 'Cards', parent: '' },
  'create': { path: '/cards/create', label: 'Create Card', parent: 'cards' },
  'batch': { path: '/cards/batch', label: 'Batch Operations', parent: 'cards' },
  
  // Collections section
  'collections': { path: '/collections', label: 'Collections', parent: '' },
  'collections-create': { path: '/collections/create', label: 'Create Collection', parent: 'collections' },
  
  // Memory Packs section
  'packs': { path: '/packs', label: 'Memory Packs', parent: '' },
  'packs-create': { path: '/packs/create', label: 'Create Memory Pack', parent: 'packs' },
  
  // Teams section
  'teams': { path: '/teams', label: 'Teams', parent: '' },
  'oakland': { path: '/teams/oakland', label: 'Oakland A\'s', parent: 'teams' },
  'memories': { path: '/teams/oakland/memories', label: 'Memories', parent: 'oakland' },
  
  // Features section
  'features': { path: '/features', label: 'Features', parent: '' },
  'ar-viewer': { path: '/features/ar-viewer', label: 'AR Viewer', parent: 'features' },
  'baseball-viewer': { path: '/features/baseball-viewer', label: 'Baseball Cards', parent: 'features' },
  
  // Game Day
  'game-day': { path: '/game-day', label: 'Game Day Mode', parent: '' },
  
  // Media Library
  'media-library': { path: '/media-library', label: 'Media Library', parent: '' },
  
  // Account section
  'account': { path: '/account', label: 'Account', parent: '' },
  
  // Experimental
  'experimental': { path: '/experimental', label: 'Labs', parent: '' },
};
