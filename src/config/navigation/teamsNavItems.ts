
import { 
  Users, 
  PlayCircle 
} from 'lucide-react';
import { NavigationItem } from './types';

// Teams section navigation
export const teamsNavItems: NavigationItem[] = [
  {
    label: 'All Teams',
    path: '/teams',
    icon: Users,
    description: 'Browse all teams'
  },
  {
    label: 'Oakland A\'s',
    path: '/teams/oakland',
    icon: Users,
    description: 'Oakland Athletics'
  },
  {
    label: 'San Francisco Giants',
    path: '/teams/sf-giants',
    icon: Users,
    description: 'San Francisco Giants'
  },
  {
    label: 'Game Day Mode',
    path: '/game-day',
    icon: PlayCircle,
    description: 'Enhanced experience for game day',
    highlight: true
  }
];
