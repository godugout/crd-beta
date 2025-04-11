
import { 
  Home, 
  Image, 
  Layers, 
  Package, 
  Users, 
  PlusCircle,
  Settings,
  PlayCircle, 
  Sparkles,
  FlaskConical,
  Eye,
  Zap,
  MessageCircle
} from 'lucide-react';

// Main navigation items that appear in both desktop and mobile navigation
export const mainNavItems = [
  { 
    label: 'Home', 
    path: '/',
    icon: Home,
    description: 'Dashboard and overview'
  },
  { 
    label: 'Cards', 
    path: '/cards',
    icon: Image,
    description: 'Your digital card collection'
  },
  { 
    label: 'Collections', 
    path: '/collections',
    icon: Layers,
    description: 'Organized card collections'
  },
  { 
    label: 'Teams', 
    path: '/teams',
    icon: Users,
    description: 'Team-based collections'
  },
  { 
    label: 'Community', 
    path: '/community',
    icon: MessageCircle,
    description: 'Connect with other collectors'
  }
];

// Cards section navigation
export const cardsNavItems = [
  {
    label: 'All Cards',
    path: '/cards',
    icon: Image,
    description: 'Browse your complete collection'
  },
  {
    label: 'Create Card',
    path: '/cards/create',
    icon: PlusCircle,
    description: 'Create a new digital card'
  },
  {
    label: 'Card Effects',
    path: '/cards/effects',
    icon: Zap,
    description: 'Explore visual effects for cards'
  },
  {
    label: 'Card Detector',
    path: '/detector',
    icon: Eye,
    description: 'Scan and digitize physical cards'
  }
];

// Collections section navigation
export const collectionsNavItems = [
  {
    label: 'My Collections',
    path: '/collections',
    icon: Layers,
    description: 'View your organized collections'
  },
  {
    label: 'Create Collection',
    path: '/collections/create',
    icon: PlusCircle,
    description: 'Create a new collection'
  },
  {
    label: 'Memory Packs',
    path: '/packs',
    icon: Package,
    description: 'Themed collections of memories'
  },
  {
    label: 'Featured Collections',
    path: '/collections/featured',
    icon: Sparkles,
    description: 'Discover curated collections'
  }
];

// Teams section navigation
export const teamsNavItems = [
  {
    label: 'All Teams',
    path: '/teams',
    icon: Users,
    description: 'Browse all teams'
  },
  {
    label: 'Oakland A\'s',
    path: '/teams/oakland',
    icon: Users,
    description: 'Oakland Athletics'
  },
  {
    label: 'San Francisco Giants',
    path: '/teams/sf-giants',
    icon: Users,
    description: 'San Francisco Giants'
  },
  {
    label: 'Game Day Mode',
    path: '/game-day',
    icon: PlayCircle,
    description: 'Enhanced experience for game day',
    highlight: true
  }
];

// Features section navigation
export const featuresNavItems = [
  {
    label: 'AR Card Viewer',
    path: '/ar-viewer',
    icon: Eye,
    description: 'View cards in augmented reality'
  },
  {
    label: 'Card Animation',
    path: '/animation',
    icon: Zap,
    description: 'Animated card effects'
  },
  {
    label: 'Game Day Mode',
    path: '/game-day',
    icon: PlayCircle,
    description: 'Enhanced experience for game day',
    highlight: true
  },
  {
    label: 'Labs',
    path: '/labs',
    icon: FlaskConical,
    description: 'Experimental features',
    highlight: true
  }
];

// Footer links
export const footerLinks = {
  quickLinks: [
    { label: 'Home', path: '/' },
    { label: 'Cards', path: '/cards' },
    { label: 'Collections', path: '/collections' },
    { label: 'Teams', path: '/teams' },
    { label: 'Community', path: '/community' }
  ],
  features: [
    { label: 'AR Viewer', path: '/ar-viewer' },
    { label: 'Card Detection', path: '/detector' },
    { label: 'Card Effects', path: '/animation' },
    { label: 'Game Day Mode', path: '/game-day' }
  ],
  legal: [
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
    { label: 'Team', path: '/about' }
  ]
};

// Route to section mappings for breadcrumbs
export const routeMappings = {
  '/': 'home',
  '/cards': 'cards',
  '/cards/create': 'cards',
  '/cards/edit': 'cards',
  '/detector': 'cards',
  '/collections': 'collections',
  '/collections/create': 'collections',
  '/packs': 'collections',
  '/teams': 'teams',
  '/teams/oakland': 'teams',
  '/ar-viewer': 'features',
  '/animation': 'features',
  '/game-day': 'features',
  '/community': 'community',
  '/labs': 'features',
  '/profile': 'account'
};

export type NavigationItem = {
  label: string;
  path: string;
  icon?: React.ElementType;
  description?: string;
  highlight?: boolean;
};
