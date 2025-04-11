
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
  FlaskConical,
  Eye,
  Zap,
  MessageCircle
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
      { title: 'Teams', path: '/teams', icon: Users },
      { title: 'Community', path: '/community', icon: MessageCircle },
    ]
  },
  {
    title: "CARDS",
    items: [
      { title: 'All Cards', path: '/cards', icon: Image },
      { title: 'Create Card', path: '/cards/create', icon: PlusSquare },
      { title: 'Card Effects', path: '/cards/effects', icon: Zap },
      { title: 'Card Detector', path: '/detector', icon: Eye },
    ]
  },
  {
    title: "COLLECTIONS",
    items: [
      { title: 'My Collections', path: '/collections', icon: Layers },
      { title: 'Create Collection', path: '/collections/create', icon: PlusSquare },
      { title: 'Memory Packs', path: '/packs', icon: Package },
    ]
  },
  {
    title: "TEAMS",
    items: [
      { title: 'All Teams', path: '/teams', icon: Users },
      { title: 'Oakland A\'s', path: '/teams/oakland', icon: Users },
      { title: 'Game Day Mode', path: '/game-day', icon: PlayCircle, highlight: true },
    ]
  },
  {
    title: "FEATURES",
    items: [
      { title: 'AR Card Viewer', path: '/ar-viewer', icon: Eye },
      { title: 'Card Animation', path: '/animation', icon: Zap },
      { title: 'Game Day Mode', path: '/game-day', icon: PlayCircle, highlight: true },
      { title: 'Dugout Labs', path: '/labs', icon: FlaskConical, highlight: true },
    ]
  }
];
