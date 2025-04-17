
import { NavigationItem } from './types';
import { Card, Collection, Heart, Plus, Search, Settings } from 'lucide-react';

export const cardsNavItems: NavigationItem[] = [
  {
    title: 'Browse Cards',
    path: '/cards/browse',
    icon: Card,
    description: 'Explore the card collection',
  },
  {
    title: 'My Cards',
    path: '/cards/my-cards',
    icon: Collection,
    description: 'View your personal collection',
  },
  {
    title: 'Favorites',
    path: '/cards/favorites',
    icon: Heart,
    description: 'Cards you\'ve favorited',
  },
  {
    title: 'Card Designer',
    path: '/cards/designer',
    icon: Plus,
    description: 'Create your own cards',
    highlight: true,
  },
  {
    title: 'Search',
    path: '/cards/search',
    icon: Search,
    description: 'Find specific cards',
  },
  {
    title: 'Settings',
    path: '/cards/settings',
    icon: Settings,
    description: 'Configure card preferences',
  },
];
