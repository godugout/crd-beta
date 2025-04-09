
import {
  Image,
  Layers,
  PlusSquare,
  PlayCircle,
  Users,
  Settings,
  Home,
  PackageIcon,
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
      path: '/batch-operations',
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
      title: 'Create New Collection',
      path: '/collections/new',
      icon: PlusSquare,
      description: 'Create and organize a new collection of cards'
    },
    {
      title: 'Memory Packs',
      path: '/memory-packs',
      icon: PackageIcon,
      description: 'Explore themed memory card packs'
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
      path: '/experimental',
      description: 'View cards in augmented reality'
    },
    {
      title: 'Baseball Card Viewer',
      path: '/baseball-card-viewer/demo',
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
      description: 'Capture and share memories during live games'
    }
  ]
};
