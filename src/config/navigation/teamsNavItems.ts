
import { 
  Users, 
  PlayCircle 
} from 'lucide-react';
import { NavigationItem } from './types';

// Teams section navigation
export const teamsNavItems: NavigationItem[] = [
  {
    title: 'All Teams',
    path: '/teams',
    icon: Users,
    description: 'Browse all teams'
  },
  {
    title: 'Oakland A\'s',
    path: '/teams/oakland',
    icon: Users,
    description: 'Oakland Athletics'
  },
  {
    title: 'San Francisco Giants',
    path: '/teams/sf-giants',
    icon: Users,
    description: 'San Francisco Giants'
  },
  {
    title: 'Game Day Mode',
    path: '/game-day',
    icon: PlayCircle,
    description: 'Enhanced experience for game day',
    highlight: true
  }
];
