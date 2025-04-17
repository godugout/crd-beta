
import { 
  Home, 
  Image, 
  Layers, 
  Users, 
  MessageCircle 
} from 'lucide-react';
import { NavigationItem } from './types';

// Main navigation items that appear in both desktop and mobile navigation
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
    description: 'Your digital card collection'
  },
  { 
    title: 'Collections', 
    path: '/collections',
    icon: Layers,
    description: 'Organized card collections'
  },
  { 
    title: 'Teams', 
    path: '/teams',
    icon: Users,
    description: 'Team-based collections'
  },
  { 
    title: 'Community', 
    path: '/community',
    icon: MessageCircle,
    description: 'Connect with other collectors'
  }
];
