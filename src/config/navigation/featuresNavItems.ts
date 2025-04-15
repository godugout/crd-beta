
import { 
  Beaker, 
  BookOpen, 
  Camera,
  Compass, 
  Layers,
  Orbit, 
  Pencil, 
  RotateCw, 
  Shirt,
  SparkleIcon,
  Wand2 
} from 'lucide-react';
import { NavigationItem } from './types';

// Features section navigation
export const featuresNavItems: NavigationItem[] = [
  {
    title: 'Card Showcase',
    path: '/features/card-showcase',
    icon: SparkleIcon,
    description: 'Visual showcase of card design features'
  },
  {
    title: 'Interactive Experiences',
    path: '/features/experiences',
    icon: Compass,
    description: 'Interactive card-based experiences'
  },
  {
    title: 'Card Creator',
    path: '/cards/create',
    icon: Wand2,
    description: 'Create custom digital trading cards'
  },
  {
    title: 'Dugout Labs',
    path: '/labs',
    icon: Beaker,
    description: 'Experimental card features in development',
    children: [
      {
        title: 'Card Detector',
        path: '/labs/detector',
        icon: Camera,
        description: 'Detect and extract cards from photos'
      },
      {
        title: 'PBR Rendering',
        path: '/labs/pbr',
        icon: Orbit,
        description: 'Physically-based rendering for cards'
      },
      {
        title: 'Card Animations',
        path: '/labs/animation',
        icon: RotateCw,
        description: 'Card animation and interaction effects'
      },
      {
        title: 'Signature Technology',
        path: '/labs/signature',
        icon: Pencil,
        description: 'Digital signature authentication'
      },
      {
        title: 'Uniform Textures',
        path: '/labs/uniforms',
        icon: Shirt, 
        description: 'Texture generation for uniforms'
      },
      {
        title: 'Advanced Card Creator',
        path: '/labs/card-creator',
        icon: Layers,
        description: 'Professional card creation tool'
      }
    ]
  },
  {
    title: 'Developer Docs',
    path: '/features/developer',
    icon: BookOpen,
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
