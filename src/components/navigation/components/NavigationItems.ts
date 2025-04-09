
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
    path: '/cards/gallery',
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
      title: 'Detect Cards',
      path: '/cards/detect',
      icon: Image,
      description: 'Automatically detect and crop cards from images'
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
      title: 'Card Comparison',
      path: '/features/card-comparison',
      description: 'Compare cards side by side'
    },
    {
      title: 'Card Animation',
      path: '/features/animation',
      description: 'Animate card designs and effects'
    }
  ]
};
