
import { Template } from '@/lib/types/templateTypes';

export const templateLibrary: Template[] = [
  // Baseball Templates
  {
    id: 'baseball-vintage-1950s',
    name: '1950s Classic Baseball',
    category: 'baseball',
    era: 'vintage',
    thumbnail: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Card Border',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#f4f1e8', borderRadius: 8 }
      },
      {
        type: 'image',
        name: 'Player Photo',
        defaultPosition: { x: 20, y: 20 },
        defaultSize: { width: 360, height: 300 },
        constraints: { aspectRatio: 1.2, allowRotation: false },
        placeholder: { image: 'player-photo' }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 20, y: 340 },
        defaultSize: { width: 360, height: 60 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 28, fontFamily: 'serif', color: '#2c1810' }
      },
      {
        type: 'text',
        name: 'Team & Position',
        defaultPosition: { x: 20, y: 410 },
        defaultSize: { width: 360, height: 40 },
        placeholder: { text: 'TEAM • POSITION' },
        style: { fontSize: 16, fontFamily: 'serif', color: '#5c3a2a' }
      }
    ],
    effects: ['vintage'],
    metadata: {
      sport: 'baseball',
      style: 'vintage',
      author: 'CRD Templates',
      tags: ['classic', 'retro', '1950s', 'traditional']
    }
  },
  {
    id: 'baseball-chrome-modern',
    name: 'Chrome Refractor Baseball',
    category: 'baseball',
    era: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Chrome Border',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#e8e8e8', borderRadius: 12 }
      },
      {
        type: 'image',
        name: 'Action Shot',
        defaultPosition: { x: 15, y: 15 },
        defaultSize: { width: 370, height: 350 },
        constraints: { aspectRatio: 1.06, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 15, y: 380 },
        defaultSize: { width: 370, height: 50 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 24, fontFamily: 'sans-serif', color: '#000' }
      },
      {
        type: 'text',
        name: 'Team Logo Area',
        defaultPosition: { x: 15, y: 440 },
        defaultSize: { width: 100, height: 80 },
        placeholder: { text: 'TEAM' },
        style: { fontSize: 14, color: '#666' }
      }
    ],
    effects: ['Refractor', 'chrome'],
    metadata: {
      sport: 'baseball',
      style: 'premium',
      author: 'CRD Templates',
      tags: ['chrome', 'refractor', 'modern', 'premium']
    }
  },

  // Basketball Templates
  {
    id: 'basketball-prizm-2020',
    name: 'Prizm Basketball',
    category: 'basketball',
    era: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Prizm Frame',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#1a1a1a', borderRadius: 16 }
      },
      {
        type: 'image',
        name: 'Court Action',
        defaultPosition: { x: 20, y: 60 },
        defaultSize: { width: 360, height: 280 },
        constraints: { aspectRatio: 1.29, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 20, y: 360 },
        defaultSize: { width: 360, height: 45 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 22, fontFamily: 'sans-serif', color: '#fff' }
      },
      {
        type: 'text',
        name: 'Position & Number',
        defaultPosition: { x: 20, y: 415 },
        defaultSize: { width: 180, height: 35 },
        placeholder: { text: 'PG • #23' },
        style: { fontSize: 16, color: '#ccc' }
      }
    ],
    effects: ['Refractor', 'prizm'],
    metadata: {
      sport: 'basketball',
      style: 'premium',
      author: 'CRD Templates',
      tags: ['prizm', 'basketball', 'modern', 'premium']
    }
  },

  // Football Templates
  {
    id: 'football-vintage-1970s',
    name: '1970s Football Classic',
    category: 'football',
    era: 'vintage',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Vintage Border',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#f0e6d2', borderRadius: 6 }
      },
      {
        type: 'image',
        name: 'Player Portrait',
        defaultPosition: { x: 30, y: 40 },
        defaultSize: { width: 340, height: 300 },
        constraints: { aspectRatio: 1.13, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 30, y: 360 },
        defaultSize: { width: 340, height: 50 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 26, fontFamily: 'serif', color: '#8b4513' }
      },
      {
        type: 'text',
        name: 'Team & Position',
        defaultPosition: { x: 30, y: 420 },
        defaultSize: { width: 340, height: 40 },
        placeholder: { text: 'TEAM QUARTERBACK' },
        style: { fontSize: 18, fontFamily: 'serif', color: '#654321' }
      }
    ],
    effects: ['vintage', 'sepia'],
    metadata: {
      sport: 'football',
      style: 'vintage',
      author: 'CRD Templates',
      tags: ['football', '1970s', 'vintage', 'classic']
    }
  },

  // Hockey Templates
  {
    id: 'hockey-ice-modern',
    name: 'Ice Hockey Modern',
    category: 'hockey',
    era: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Ice Border',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#f8f9fa', borderRadius: 10 }
      },
      {
        type: 'image',
        name: 'Game Action',
        defaultPosition: { x: 15, y: 30 },
        defaultSize: { width: 370, height: 320 },
        constraints: { aspectRatio: 1.16, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 15, y: 370 },
        defaultSize: { width: 370, height: 45 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 24, fontFamily: 'sans-serif', color: '#000' }
      },
      {
        type: 'text',
        name: 'Position & Number',
        defaultPosition: { x: 15, y: 425 },
        defaultSize: { width: 200, height: 35 },
        placeholder: { text: 'CENTER • #87' },
        style: { fontSize: 16, color: '#555' }
      }
    ],
    effects: ['ice', 'shimmer'],
    metadata: {
      sport: 'hockey',
      style: 'modern',
      author: 'CRD Templates',
      tags: ['hockey', 'ice', 'modern', 'action']
    }
  },

  // Soccer Templates
  {
    id: 'soccer-world-cup',
    name: 'World Cup Soccer',
    category: 'soccer',
    era: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Stadium Border',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#ffffff', borderRadius: 8 }
      },
      {
        type: 'image',
        name: 'Player Action',
        defaultPosition: { x: 20, y: 50 },
        defaultSize: { width: 360, height: 300 },
        constraints: { aspectRatio: 1.2, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 20, y: 370 },
        defaultSize: { width: 360, height: 50 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 24, fontFamily: 'sans-serif', color: '#000' }
      },
      {
        type: 'text',
        name: 'Position & Club',
        defaultPosition: { x: 20, y: 430 },
        defaultSize: { width: 360, height: 40 },
        placeholder: { text: 'MIDFIELDER • CLUB FC' },
        style: { fontSize: 16, color: '#666' }
      }
    ],
    effects: ['holographic'],
    metadata: {
      sport: 'soccer',
      style: 'international',
      author: 'CRD Templates',
      tags: ['soccer', 'world-cup', 'football', 'international']
    }
  },

  // Future/Modern Templates
  {
    id: 'future-hologram-2025',
    name: 'Hologram Future Card',
    category: 'custom',
    era: 'future',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Holo Frame',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#000000', borderRadius: 20 }
      },
      {
        type: 'image',
        name: 'Futuristic Portrait',
        defaultPosition: { x: 25, y: 80 },
        defaultSize: { width: 350, height: 280 },
        constraints: { aspectRatio: 1.25, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Digital Name',
        defaultPosition: { x: 25, y: 380 },
        defaultSize: { width: 350, height: 45 },
        placeholder: { text: 'PLAYER.EXE' },
        style: { fontSize: 22, fontFamily: 'monospace', color: '#00ffff' }
      },
      {
        type: 'text',
        name: 'Neural Stats',
        defaultPosition: { x: 25, y: 435 },
        defaultSize: { width: 350, height: 35 },
        placeholder: { text: 'NEURAL NET v2.1 • ENHANCED' },
        style: { fontSize: 14, fontFamily: 'monospace', color: '#00ff00' }
      }
    ],
    effects: ['Holographic', 'neon', 'glitch'],
    metadata: {
      sport: 'esports',
      style: 'futuristic',
      author: 'CRD Templates',
      tags: ['future', 'hologram', 'digital', 'esports']
    }
  },

  // Additional Templates
  {
    id: 'basketball-vintage-1980s',
    name: '1980s Basketball Retro',
    category: 'basketball',
    era: 'classic',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Retro Border',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#ff6b35', borderRadius: 4 }
      },
      {
        type: 'image',
        name: 'Classic Shot',
        defaultPosition: { x: 30, y: 30 },
        defaultSize: { width: 340, height: 340 },
        constraints: { aspectRatio: 1.0, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 30, y: 390 },
        defaultSize: { width: 340, height: 50 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 24, fontFamily: 'sans-serif', color: '#ffffff' }
      }
    ],
    effects: ['retro', 'glow'],
    metadata: {
      sport: 'basketball',
      style: 'retro',
      author: 'CRD Templates',
      tags: ['1980s', 'retro', 'basketball', 'classic']
    }
  },

  {
    id: 'baseball-rookie-modern',
    name: 'Modern Rookie Card',
    category: 'baseball',
    era: 'future',
    thumbnail: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Rookie Frame',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#1e3a8a', borderRadius: 15 }
      },
      {
        type: 'image',
        name: 'Debut Photo',
        defaultPosition: { x: 20, y: 40 },
        defaultSize: { width: 360, height: 320 },
        constraints: { aspectRatio: 1.125, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Rookie Badge',
        defaultPosition: { x: 20, y: 10 },
        defaultSize: { width: 100, height: 25 },
        placeholder: { text: 'ROOKIE' },
        style: { fontSize: 12, fontFamily: 'sans-serif', color: '#fbbf24' }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 20, y: 380 },
        defaultSize: { width: 360, height: 50 },
        placeholder: { text: 'PLAYER NAME' },
        style: { fontSize: 24, fontFamily: 'sans-serif', color: '#ffffff' }
      }
    ],
    effects: ['Shimmer', 'rookie-glow'],
    metadata: {
      sport: 'baseball',
      style: 'rookie',
      author: 'CRD Templates',
      tags: ['rookie', 'debut', 'modern', 'prospect']
    }
  },

  {
    id: 'hockey-vintage-1960s',
    name: '1960s Hockey Legend',
    category: 'hockey',
    era: 'vintage',
    thumbnail: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=300&h=420&fit=crop',
    layers: [
      {
        type: 'border',
        name: 'Classic Border',
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 400, height: 560 },
        style: { backgroundColor: '#f5f5dc', borderRadius: 2 }
      },
      {
        type: 'image',
        name: 'Vintage Portrait',
        defaultPosition: { x: 40, y: 60 },
        defaultSize: { width: 320, height: 280 },
        constraints: { aspectRatio: 1.14, allowRotation: false }
      },
      {
        type: 'text',
        name: 'Player Name',
        defaultPosition: { x: 40, y: 360 },
        defaultSize: { width: 320, height: 55 },
        placeholder: { text: 'HOCKEY LEGEND' },
        style: { fontSize: 28, fontFamily: 'serif', color: '#2c1810' }
      },
      {
        type: 'text',
        name: 'Team & Era',
        defaultPosition: { x: 40, y: 425 },
        defaultSize: { width: 320, height: 40 },
        placeholder: { text: 'ORIGINAL SIX ERA' },
        style: { fontSize: 16, fontFamily: 'serif', color: '#5c3a2a' }
      }
    ],
    effects: ['Vintage', 'sepia'],
    metadata: {
      sport: 'hockey',
      style: 'legend',
      author: 'CRD Templates',
      tags: ['1960s', 'legend', 'original-six', 'vintage']
    }
  }
];

export const templateCategories = [
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'football', name: 'Football', icon: '🏈' },
  { id: 'hockey', name: 'Hockey', icon: '🏒' },
  { id: 'soccer', name: 'Soccer', icon: '⚽' },
  { id: 'custom', name: 'Custom', icon: '🎨' }
];

export const templateEras = [
  { id: 'vintage', name: 'Vintage (Pre-1980)', description: 'Classic retro designs' },
  { id: 'classic', name: 'Classic (1980-2000)', description: 'Traditional card layouts' },
  { id: 'modern', name: 'Modern (2000-2020)', description: 'Contemporary designs' },
  { id: 'future', name: 'Future (2020+)', description: 'Cutting-edge styles' }
];
