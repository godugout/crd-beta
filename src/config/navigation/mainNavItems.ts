
import { 
  Home, 
  Image, 
  Layers, 
  Building
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
    title: 'Towns & Communities', 
    path: '/towns',
    icon: Building,
    description: 'Connect with communities and towns'
  }
];
