
import { 
  Home, 
  Image, 
  Layers, 
  Building, 
  Users 
} from 'lucide-react';
import { NavigationItem } from './types';

export const mainNavItems: NavigationItem[] = [
  { 
    title: 'Home', 
    path: '/',
    icon: Home,
    description: 'Dashboard and overview'
  },
  { 
    title: 'Cards', 
    path: '/cards',
    icon: Image,
    description: 'Browse the card collection'
  },
  { 
    title: 'Collections', 
    path: '/collections',
    icon: Layers,
    description: 'Organized card collections'
  },
  { 
    title: 'Towns', 
    path: '/towns',
    icon: Building,
    description: 'Discover towns and locales'
  },
  { 
    title: 'Teams', 
    path: '/teams',
    icon: Users,
    description: 'Browse all teams'
  },
  { 
    title: 'Community', 
    path: '/community',
    icon: Users,
    description: 'Connect with collectors, creators & communities'
  }
];
