
export type ParticleEffectType = 'sparkle' | 'dust' | 'energy' | 'team';

export interface ParticleSettings {
  type: ParticleEffectType;
  enabled: boolean;
  density: number; // 0-1
  speed: number; // 0-1
  reactivity: number; // 0-1
  color: string | string[]; // Primary color or array of colors
  emissionPattern: 'edges' | 'corners' | 'full' | 'custom';
  customEmissionPoints?: [number, number][]; // Custom emission coordinates
  size: number; // 0-1
  opacity: number; // 0-1
  lifespan: number; // In seconds
  blendMode?: 'normal' | 'add' | 'multiply' | 'screen';
}

export interface ParticleSystemState {
  effects: Record<ParticleEffectType, ParticleSettings>;
  isActive: boolean;
  isTransitioning: boolean;
  isPerformanceRestricted: boolean;
  performanceLevel: 'high' | 'medium' | 'low';
  autoAdjust: boolean;
}

export type ParticlePreset = {
  name: string;
  settings: Partial<ParticleSettings>;
};

export const DEFAULT_PARTICLE_PRESETS: Record<string, ParticlePreset> = {
  premium: {
    name: 'Premium Card',
    settings: {
      type: 'sparkle',
      density: 0.7,
      speed: 0.5,
      reactivity: 0.8,
      color: ['#FFD700', '#FFFFFF', '#FFF8E0'],
      emissionPattern: 'edges',
      size: 0.6,
      opacity: 0.8,
      lifespan: 1.5,
      blendMode: 'screen'
    }
  },
  atmospheric: {
    name: 'Atmospheric',
    settings: {
      type: 'dust',
      density: 0.3,
      speed: 0.2,
      reactivity: 0.5,
      color: ['#FFFFFF', '#F0F0FF'],
      emissionPattern: 'full',
      size: 0.3,
      opacity: 0.4,
      lifespan: 3,
      blendMode: 'screen'
    }
  },
  aura: {
    name: 'Energy Aura',
    settings: {
      type: 'energy',
      density: 0.5,
      speed: 0.6,
      reactivity: 0.9,
      color: ['#00FFFF', '#0080FF', '#FFFFFF'],
      emissionPattern: 'edges',
      size: 0.5,
      opacity: 0.6,
      lifespan: 1.2,
      blendMode: 'add'
    }
  }
};

export const TEAM_COLOR_SCHEMES: Record<string, string[]> = {
  'Blue Jays': ['#134A8E', '#1D2D5C', '#E8291C'],
  'Yankees': ['#0C2340', '#FFFFFF', '#C4CED4'],
  'Red Sox': ['#BD3039', '#0C2340', '#FFFFFF'],
  'Cubs': ['#0E3386', '#CC3433', '#FFFFFF'],
  'Dodgers': ['#005A9C', '#FFFFFF', '#EF3E42']
};
