
import { 
  Beaker, 
  BookOpen, 
  CaseSensitive, 
  Code, 
  Compass, 
  Orbit, 
  Pencil, 
  PencilRuler, 
  RotateCw, 
  Sparkles 
} from 'lucide-react';
import { NavigationItem } from './types';

// Features section navigation
export const featuresNavItems: NavigationItem[] = [
  {
    title: 'Card Showcase',
    path: '/features/card-showcase',
    icon: Sparkles,
    description: 'Visual showcase of card design features'
  },
  {
    title: 'Interactive Experiences',
    path: '/features/experiences',
    icon: Compass,
    description: 'Interactive card-based experiences'
  },
  {
    title: 'Dugout Labs',
    path: '/features/labs',
    icon: Beaker,
    description: 'Experimental card features in development'
  },
  {
    title: 'PBR Rendering',
    path: '/features/pbr',
    icon: Orbit,
    description: 'Physically-based rendering for cards'
  },
  {
    title: 'Card Animations',
    path: '/features/animation',
    icon: RotateCw,
    description: 'Card animation and interaction effects'
  },
  {
    title: 'Signature Technology',
    path: '/features/signature',
    icon: Pencil,
    description: 'Digital signature authentication'
  },
  {
    title: 'Developer Docs',
    path: '/features/developer',
    icon: Code,
    description: 'API documentation and developer resources'
  },
  {
    title: 'Caching Example',
    path: '/features/cache-example',
    icon: BookOpen,
    description: 'Memory cache system demonstration'
  }
];

export default featuresNavItems;
