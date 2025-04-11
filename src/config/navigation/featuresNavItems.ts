
import { 
  Eye,
  Zap,
  PlayCircle,
  FlaskConical 
} from 'lucide-react';
import { NavigationItem } from './types';

// Features section navigation
export const featuresNavItems: NavigationItem[] = [
  {
    title: 'AR Card Viewer',
    path: '/ar-viewer',
    icon: Eye,
    description: 'View cards in augmented reality'
  },
  {
    title: 'Card Animation',
    path: '/animation',
    icon: Zap,
    description: 'Animated card effects'
  },
  {
    title: 'Game Day Mode',
    path: '/game-day',
    icon: PlayCircle,
    description: 'Enhanced experience for game day',
    highlight: true
  },
  {
    title: 'Labs',
    path: '/labs',
    icon: FlaskConical,
    description: 'Experimental features',
    highlight: true
  }
];
