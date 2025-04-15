
import { Home, LayoutGrid, Collection, Users, Newspaper } from 'lucide-react';
import type { NavItem } from './types';

export const mainNavItems: NavItem[] = [
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
    icon: Collection,
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
