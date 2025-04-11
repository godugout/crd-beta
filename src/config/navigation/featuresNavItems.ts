
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
    label: 'AR Card Viewer',
    path: '/ar-viewer',
    icon: Eye,
    description: 'View cards in augmented reality'
  },
  {
    label: 'Card Animation',
    path: '/animation',
    icon: Zap,
    description: 'Animated card effects'
  },
  {
    label: 'Game Day Mode',
    path: '/game-day',
    icon: PlayCircle,
    description: 'Enhanced experience for game day',
    highlight: true
  },
  {
    label: 'Labs',
    path: '/labs',
    icon: FlaskConical,
    description: 'Experimental features',
    highlight: true
  }
];
