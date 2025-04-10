
import { 
  Home, 
  Image, 
  Package,
  Layers, 
  PlusSquare,
  Users,
  Settings,
  PlayCircle, 
  Sparkles,
  FlaskConical
} from 'lucide-react';
import { NavigationGroup } from './types';

// Define navigation groups for better organization with consistent paths
export const navigationGroups: NavigationGroup[] = [
  {
    title: "MAIN",
    items: [
      { title: 'Home', path: '/', icon: Home },
      { title: 'Cards', path: '/cards', icon: Image },
      { title: 'Collections', path: '/collections', icon: Layers },
      { title: 'Memory Packs', path: '/packs', icon: Package },
      { title: 'Teams', path: '/teams', icon: Users },
    ]
  },
  {
    title: "CREATE",
    items: [
      { title: 'Create Card', path: '/cards/create', icon: PlusSquare },
      { title: 'Create Collection', path: '/collections/create', icon: PlusSquare },
      { title: 'Create Memory Pack', path: '/packs/create', icon: PlusSquare },
      { title: 'Batch Operations', path: '/cards/batch', icon: Layers },
    ]
  },
  {
    title: "TEAMS",
    items: [
      { title: 'Oakland A\'s', path: '/teams/oakland', icon: Users },
      { title: 'Game Day Mode', path: '/game-day', icon: PlayCircle, highlight: true },
    ]
  },
  {
    title: "MEDIA",
    items: [
      { title: 'Media Library', path: '/media-library', icon: Image },
    ]
  },
  {
    title: "LABS",
    items: [
      { title: 'Dugout Labs', path: '/labs', icon: FlaskConical, highlight: true },
      { title: 'Group Memory', path: '/group-memory', icon: Users },
    ]
  }
];
