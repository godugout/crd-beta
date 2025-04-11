
import { Archive, Database, PieChart } from 'lucide-react';
import { NavigationItem } from '@/components/navigation/mobile/types';

export const baseballNavItems: NavigationItem[] = [
  {
    title: 'Baseball Archive',
    path: '/baseball-archive',
    icon: Archive,
    highlight: true
  },
  {
    title: 'Team Colors',
    path: '/baseball-archive',
    icon: Database
  },
  {
    title: 'Statistics',
    path: '/baseball-archive/stats',
    icon: PieChart
  }
];
