
/**
 * Type definitions for card effects system
 */

export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: CardEffectSettings;
  className?: string;
}

export interface CardEffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  colorScheme?: string[];
  animationEnabled?: boolean;
  [key: string]: any;
}

export interface CardEffectDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'premium' | 'standard' | 'special';
  defaultSettings: CardEffectSettings;
  cssClass: string;
  supportedCardTypes: string[];
}

export interface MaterialSimulation {
  type: 'metal' | 'plastic' | 'paper' | 'glass' | 'custom';
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  thickness?: number;
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: string;
  specularIntensity?: number;
  specularColor?: string;
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThicknessRange?: [number, number];
  anisotropy?: number;
  anisotropyRotation?: number;
  envMapIntensity?: number;
  customProperties?: Record<string, any>;
}
