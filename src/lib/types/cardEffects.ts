import { JsonValue } from './index';
import { ReactNode } from 'react';

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
  animationEnabled?: boolean;
  colorScheme?: string[];
  [key: string]: JsonValue | undefined;
}

export interface PremiumCardEffect extends CardEffect {
  premium: boolean;
  requiresSubscription: boolean;
}

export interface CardEffectsResult {
  cssClasses: string;
  effectData: Record<string, any>;
  jsxElements?: ReactNode[];
}

export type EffectSettings = CardEffectSettings;

// Material simulation types - fixed to include all needed properties
export interface MaterialSimulation {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  ior: number;
  transmission: number;
  reflectivity: number;
  emissive: string;
  envMapIntensity: number;
  
  // Additional properties needed by MaterialSimulator component
  textureUrl?: string;
  baseColor?: string;
  type?: string;
  weathering?: number;
}

// Core effect engine interfaces
export interface EffectCompositor {
  compose(effects: CardEffect[]): CardEffectsResult;
  layerEffects(primary: CardEffect, secondary: CardEffect): CardEffect;
  getHtmlElement(): HTMLElement | null;
}

export interface WebGLRenderer {
  initialize(canvas: HTMLCanvasElement): void;
  applyShader(effect: CardEffect): void;
  render(): void;
  dispose(): void;
}

export interface PreviewGenerator {
  generateThumbnail(effect: CardEffect, size: { width: number; height: number }): Promise<string>;
  generatePreview(card: any, effects: CardEffect[]): ReactNode;
}

export interface EffectEngine {
  effects: Map<string, CardEffect>;
  compositor: EffectCompositor;
  renderer: WebGLRenderer;
  preview: PreviewGenerator;
  
  addEffect(effect: CardEffect): void;
  removeEffect(id: string): void;
  applyEffects(cardElement: HTMLElement, effects: CardEffect[]): void;
  updateSettings(id: string, settings: Partial<CardEffectSettings>): void;
  getEffectById(id: string): CardEffect | undefined;
  createPreset(name: string, effects: CardEffect[]): string;
  loadPreset(presetId: string): CardEffect[];
}
