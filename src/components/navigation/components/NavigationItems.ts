
import { MoveRight, Image, Layers, Package, Users, Star, Play, Zap } from 'lucide-react';

// Cards navigation items
export const cardsNavigation = {
  title: 'Cards',
  key: 'cards',
  layout: 'grid',
  columns: 2,
  items: [
    {
      title: 'Card Gallery',
      path: '/cards',
      icon: Image,
      description: 'Browse and view your cards'
    },
    {
      title: 'Create Card',
      path: '/cards/create',
      icon: MoveRight,
      description: 'Create a new digital card'
    },
    {
      title: 'Card Effects',
      path: '/cards/effects',
      icon: Zap,
      description: 'Explore card visual effects'
    },
    {
      title: 'Card Detector',
      path: '/detector',
      icon: Image,
      description: 'Scan physical cards'
    }
  ],
  featuredItem: {
    title: 'Card Animations',
    path: '/animation',
    description: 'Experience animated card effects',
    icon: Play
  }
};

// Collections navigation items
export const collectionsNavigation = {
  title: 'Collections',
  key: 'collections',
  layout: 'list',
  items: [
    {
      title: 'My Collections',
      path: '/collections',
      icon: Layers,
      description: 'View your card collections'
    },
    {
      title: 'Create Collection',
      path: '/collections/create',
      icon: MoveRight,
      description: 'Create a new collection'
    },
    {
      title: 'Memory Packs',
      path: '/packs',
      icon: Package,
      description: 'Themed collections of memories'
    }
  ],
  featuredItem: {
    title: 'Featured Collections',
    path: '/collections/featured',
    description: 'Discover curated collections',
    icon: Star
  }
};

// Teams navigation items
export const teamsNavigation = {
  title: 'Teams',
  key: 'teams',
  layout: 'grid',
  columns: 2,
  items: [
    {
      title: 'All Teams',
      path: '/teams',
      icon: Users,
      description: 'Browse all teams'
    },
    {
      title: 'Oakland A\'s',
      path: '/teams/oakland',
      icon: Users,
      description: 'Oakland Athletics'
    }
  ],
  featuredTeams: [
    {
      name: 'Oakland A\'s',
      path: '/teams/oakland',
      logo: '/logo-oak.png' // Make sure this path exists
    },
    {
      name: 'San Francisco Giants',
      path: '/teams/sf-giants',
      logo: '/logo-sfg.png' // Make sure this path exists
    }
  ]
};

// Features navigation items
export const featuresNavigation = {
  title: 'Features',
  key: 'features',
  layout: 'grid',
  columns: 2,
  items: [
    {
      title: 'AR Card Viewer',
      path: '/ar-viewer',
      icon: Zap,
      description: 'View cards in augmented reality'
    },
    {
      title: 'Card Comparison',
      path: '/comparison',
      icon: Layers,
      description: 'Compare cards side by side'
    },
    {
      title: 'Card Animation',
      path: '/animation',
      icon: Play,
      description: 'Animated card effects'
    },
    {
      title: 'Game Day Mode',
      path: '/game-day',
      icon: Star,
      highlight: true,
      description: 'Enhanced experience for game day'
    }
  ]
};
