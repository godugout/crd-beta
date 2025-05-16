
import { CardTemplate } from '@/lib/types/templateTypes';

export const mockTemplates: CardTemplate[] = [
  {
    id: 'template-1',
    name: 'Classic Sports',
    description: 'Traditional sports card design',
    thumbnail: '/public/lovable-uploads/236e3ad9-f7c2-4e5b-b29a-ca52a49ff3ed.png',
    category: 'sports',
    tags: ['sports', 'classic'],
    popularity: 9.5,
    isOfficial: true,
    designDefaults: {
      cardStyle: {
        template: 'classic-sports',
        effect: 'shine',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.3)',
        frameWidth: 4,
        frameColor: '#e0e0e0'
      },
      textStyle: {
        fontFamily: 'Inter',
        titleColor: '#1a1a1a',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#555555'
      },
      effects: ['shine', 'gold-accent']
    }
  },
  {
    id: 'template-2',
    name: 'Modern Minimalist',
    description: 'Clean, modern card design',
    thumbnail: '/public/lovable-uploads/371b81a2-cafa-4637-9358-218d4120c658.png',
    category: 'modern',
    tags: ['minimalist', 'clean'],
    popularity: 8.7,
    isOfficial: true,
    designDefaults: {
      cardStyle: {
        template: 'modern-minimal',
        effect: 'subtle-shine',
        borderRadius: '16px',
        borderColor: '#ffffff',
        shadowColor: 'rgba(0,0,0,0.1)',
        frameWidth: 1,
        frameColor: '#f5f5f5'
      },
      textStyle: {
        fontFamily: 'Roboto',
        titleColor: '#333333',
        titleAlignment: 'left',
        titleWeight: 'medium',
        descriptionColor: '#666666'
      },
      effects: ['subtle-shine']
    }
  },
  {
    id: 'template-3',
    name: 'Vintage Collection',
    description: 'Old-school vintage card style',
    thumbnail: '/public/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    category: 'vintage',
    tags: ['retro', 'classic', 'vintage'],
    popularity: 7.9,
    isOfficial: true,
    designDefaults: {
      cardStyle: {
        template: 'vintage',
        effect: 'aged',
        borderRadius: '4px',
        borderColor: '#d2b48c',
        shadowColor: 'rgba(101, 67, 33, 0.4)',
        frameWidth: 6,
        frameColor: '#8b4513'
      },
      textStyle: {
        fontFamily: 'Playfair Display',
        titleColor: '#5c4033',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#6d4c41'
      },
      effects: ['aged', 'vintage-texture']
    }
  },
  {
    id: 'template-4',
    name: 'Premium Holographic',
    description: 'High-end holographic card design',
    thumbnail: '/public/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png',
    category: 'premium',
    tags: ['premium', 'holographic', 'special'],
    popularity: 9.8,
    isOfficial: true,
    designDefaults: {
      cardStyle: {
        template: 'premium-holo',
        effect: 'holographic',
        borderRadius: '12px',
        borderColor: '#303030',
        shadowColor: 'rgba(0,0,0,0.5)',
        frameWidth: 3,
        frameColor: '#gold'
      },
      textStyle: {
        fontFamily: 'Montserrat',
        titleColor: '#ffffff',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#e0e0e0'
      },
      effects: ['holographic', 'shine', 'glow']
    }
  }
];
