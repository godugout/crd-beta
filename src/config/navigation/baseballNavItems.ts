
import { Archive, Users, Building } from 'lucide-react';
import { NavigationItem } from '@/components/navigation/mobile/types';

export const baseballNavItems: NavigationItem[] = [
  {
    title: 'Teams & Towns',
    path: '/teams',
    icon: Archive,
    highlight: true
  },
  {
    title: 'Fans Directory',
    path: '/teams/fans',
    icon: Users
  },
  {
    title: 'Town Directory',
    path: '/teams/towns',
    icon: Building
  }
];
