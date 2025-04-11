
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
