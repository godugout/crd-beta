
import { Home, LayoutGrid, Library, Users, Newspaper } from 'lucide-react';
import { NavigationItem } from './types';

export const mainNavItems: NavigationItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: Home,
  },
  {
    title: 'Cards',
    path: '/cards',
    icon: LayoutGrid,
  },
  {
    title: 'Collections',
    path: '/collections',
    icon: Library,
  },
  {
    title: 'Teams',
    path: '/teams',
    icon: Users,
  },
  {
    title: 'Community',
    path: '/community',
    icon: Newspaper,
  },
];
