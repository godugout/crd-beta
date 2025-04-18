
import { 
  Home, 
  Image, 
  Layers, 
  Building,
  Trophy
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
    icon: Trophy,
    description: 'Basketball player card collection'
  },
  { 
    title: 'Collections', 
    path: '/collections',
    icon: Layers,
    description: 'Organized card collections'
  },
  { 
    title: 'Towns & Communities', 
    path: '/towns',
    icon: Building,
    description: 'Connect with communities and towns'
  }
];
