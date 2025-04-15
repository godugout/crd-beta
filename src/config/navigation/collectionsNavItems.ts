
import { 
  Layers, 
  PlusCircle,
  Package,
  Sparkles,
  Instagram
} from 'lucide-react';
import { NavigationItem } from './types';

// Collections section navigation
export const collectionsNavItems: NavigationItem[] = [
  {
    title: 'My Collections',
    path: '/collections',
    icon: Layers,
    description: 'View your organized collections'
  },
  {
    title: 'Create Collection',
    path: '/collections/create',
    icon: PlusCircle,
    description: 'Create a new collection'
  },
  {
    title: 'Instagram Collection',
    path: '/collections/instagram',
    icon: Instagram,
    description: 'Create collection from Instagram posts'
  },
  {
    title: 'Memory Packs',
    path: '/packs',
    icon: Package,
    description: 'Themed collections of memories'
  },
  {
    title: 'Featured Collections',
    path: '/collections/featured',
    icon: Sparkles,
    description: 'Discover curated collections'
  }
];
