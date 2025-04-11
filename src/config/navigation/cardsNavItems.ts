
import { 
  Image, 
  PlusCircle,
  Zap,
  Eye 
} from 'lucide-react';
import { NavigationItem } from './types';

// Cards section navigation
export const cardsNavItems: NavigationItem[] = [
  {
    title: 'All Cards',
    path: '/cards',
    icon: Image,
    description: 'Browse your complete collection'
  },
  {
    title: 'Create Card',
    path: '/cards/create',
    icon: PlusCircle,
    description: 'Create a new digital card'
  },
  {
    title: 'Card Effects',
    path: '/cards/effects',
    icon: Zap,
    description: 'Explore visual effects for cards'
  },
  {
    title: 'Card Detector',
    path: '/detector',
    icon: Eye,
    description: 'Scan and digitize physical cards'
  }
];
