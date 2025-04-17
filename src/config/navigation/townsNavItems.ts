
import { NavigationItem } from './types';
import { Map, Home, Building2, Landmark, Mountain, Trees } from 'lucide-react';

export const townsNavItems: NavigationItem[] = [
  {
    title: 'Oakland',
    path: '/towns/oakland',
    icon: Landmark,
    description: 'Oakland town page',
    highlight: true,
  },
  {
    title: 'San Francisco',
    path: '/towns/san-francisco',
    icon: Building2,
    description: 'San Francisco town page',
  },
  {
    title: 'Sacramento',
    path: '/towns/sacramento',
    icon: Home,
    description: 'Sacramento town page',
  },
  {
    title: 'Berkeley',
    path: '/towns/berkeley',
    icon: Trees,
    description: 'Berkeley town page',
  },
  {
    title: 'All Towns',
    path: '/towns/all',
    icon: Map,
    description: 'View all towns',
  },
];
