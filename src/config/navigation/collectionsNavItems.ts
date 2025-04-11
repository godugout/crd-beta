
import { 
  Layers, 
  PlusCircle,
  Package,
  Sparkles 
} from 'lucide-react';
import { NavigationItem } from './types';

// Collections section navigation
export const collectionsNavItems: NavigationItem[] = [
  {
    label: 'My Collections',
    path: '/collections',
    icon: Layers,
    description: 'View your organized collections'
  },
  {
    label: 'Create Collection',
    path: '/collections/create',
    icon: PlusCircle,
    description: 'Create a new collection'
  },
  {
    label: 'Memory Packs',
    path: '/packs',
    icon: Package,
    description: 'Themed collections of memories'
  },
  {
    label: 'Featured Collections',
    path: '/collections/featured',
    icon: Sparkles,
    description: 'Discover curated collections'
  }
];
