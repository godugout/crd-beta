
import { LucideIcon } from 'lucide-react';
import { Clock, Trophy, Megaphone, Star, Heart, Zap } from 'lucide-react';

export interface OaklandCardTemplate {
  id: string;
  name: string;
  category: 'nostalgia' | 'protest' | 'community' | 'celebration';
  description: string;
  imageUrl: string;
  effects: string[];
  metadata: {
    tags: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    popularity: number;
  };
}

export interface OaklandCardCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const OAKLAND_CARD_CATEGORIES: OaklandCardCategory[] = [
  {
    id: 'all',
    name: 'All Templates',
    icon: Star,
    description: 'Browse all available templates'
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia',
    icon: Clock,
    description: 'Classic Oakland memories'
  },
  {
    id: 'celebration',
    name: 'Celebration',
    icon: Trophy,
    description: 'Victory and achievement cards'
  },
  {
    id: 'protest',
    name: 'Protest',
    icon: Megaphone,
    description: 'Stand up for Oakland'
  },
  {
    id: 'community',
    name: 'Community',
    icon: Heart,
    description: 'Fan community moments'
  }
];

export const OAKLAND_CARD_TEMPLATES: OaklandCardTemplate[] = [
  {
    id: 'classic-green',
    name: 'Classic Green',
    category: 'nostalgia',
    description: 'Traditional Oakland A\'s green and gold design',
    imageUrl: '/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png',
    effects: ['vintage-sepia', 'dusty-glow'],
    metadata: {
      tags: ['classic', 'green', 'traditional'],
      difficulty: 'easy',
      popularity: 95
    }
  },
  {
    id: 'vintage-coliseum',
    name: 'Vintage Coliseum',
    category: 'nostalgia',
    description: 'Retro stadium-inspired card design',
    imageUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
    effects: ['vintage-grain', 'sepia-tone'],
    metadata: {
      tags: ['vintage', 'stadium', 'retro'],
      difficulty: 'medium',
      popularity: 87
    }
  },
  {
    id: 'championship-gold',
    name: 'Championship Gold',
    category: 'celebration',
    description: 'Celebrate victories with golden elegance',
    imageUrl: '/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png',
    effects: ['gold-foil', 'shine-effect'],
    metadata: {
      tags: ['gold', 'victory', 'championship'],
      difficulty: 'medium',
      popularity: 92
    }
  },
  {
    id: 'protest-red',
    name: 'Protest Power',
    category: 'protest',
    description: 'Bold design for making your voice heard',
    imageUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
    effects: ['protest-red', 'glitch-overlay'],
    metadata: {
      tags: ['protest', 'bold', 'statement'],
      difficulty: 'hard',
      popularity: 78
    }
  },
  {
    id: 'community-spirit',
    name: 'Community Spirit',
    category: 'community',
    description: 'Warm design celebrating fan connections',
    imageUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    effects: ['warm-glow', 'community-feel'],
    metadata: {
      tags: ['community', 'warm', 'connection'],
      difficulty: 'easy',
      popularity: 84
    }
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    category: 'celebration',
    description: 'Clean, contemporary Oakland design',
    imageUrl: '/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png',
    effects: ['clean-lines', 'minimal-shadow'],
    metadata: {
      tags: ['modern', 'clean', 'minimalist'],
      difficulty: 'medium',
      popularity: 81
    }
  }
];
