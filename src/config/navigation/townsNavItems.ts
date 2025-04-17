
import { 
  Users, 
  Building,
  MapPin,
  PlayCircle
} from 'lucide-react';
import { NavigationItem } from './types';

// Towns navigation section
export const townsNavItems: NavigationItem[] = [
  {
    title: 'Oakland',
    path: '/towns/oakland',
    icon: Building,
    description: 'Oakland Town'
  },
  {
    title: 'San Francisco',
    path: '/towns/sf-giants',
    icon: Building,
    description: 'San Francisco Town'
  },
  {
    title: 'Town Directory',
    path: '/towns',
    icon: MapPin,
    description: 'Browse all towns'
  },
  {
    title: 'Game Day Mode',
    path: '/game-day',
    icon: PlayCircle,
    description: 'Enhanced experience for game day',
    highlight: true
  }
];
