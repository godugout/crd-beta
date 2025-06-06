
export interface CardEffect {
  id: string;
  name: string;
  type: 'visual' | 'animation' | 'lighting';
  intensity?: number;
  enabled: boolean;
}

export interface CardEffectSettings {
  intensity: number;
  color?: string;
  speed?: number;
  direction?: 'horizontal' | 'vertical' | 'radial';
}
