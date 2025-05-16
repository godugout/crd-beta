import { Card, CardEffect } from '@/lib/types/cardTypes';
import { CardEffectSettings } from '@/lib/types/cardTypes';

export interface EffectCategory {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface PremiumCardEffect extends CardEffect {
  premium: boolean;
  price?: number;
  category?: string;
  animationClass?: string;
  renderer?: () => React.ReactNode;
}

export interface CardEffectContextProps {
  activeEffects: string[];
  setActiveEffects: React.Dispatch<React.SetStateAction<string[]>>;
  effectIntensities: { [key: string]: number };
  setEffectIntensities: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  isEffectEnabled: (effectId: string) => boolean;
  toggleEffect: (effectId: string) => void;
  setEffectIntensity: (effectId: string, intensity: number) => void;
  getEffectIntensity: (effectId: string) => number;
  resetEffects: () => void;
  cardEffects: CardEffect[];
  premiumEffects: PremiumCardEffect[];
  getEffectSettings: (effectId: string) => CardEffectSettings | undefined;
  getEffectCategory: (effectId: string) => EffectCategory | undefined;
}

export interface MediaServiceHook {
  uploadFile: (file: File) => Promise<string>;
  uploadImage: (file: File) => Promise<string>; // Add this missing method
  getMedia: () => Promise<string[]>;
  isUploading: boolean;
  error: Error | null;
}

export interface EffectRendererProps {
  card: Card;
  intensity: number;
  settings: Record<string, any>;
}

export interface EffectRegistry {
  [key: string]: {
    name: string;
    description?: string;
    category?: string;
    icon?: React.ReactNode;
    renderer: (props: EffectRendererProps) => React.ReactNode;
    settings?: CardEffectSettings;
  };
}
