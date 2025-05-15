
import { Card } from '@/lib/types/cardTypes';

export interface CardViewerProps {
  card: Card;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  
  // Event handlers
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void; 
  onClose?: () => void;
  
  // UI state
  fullscreen?: boolean;
}

export interface CardTextStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  title?: string;
  description?: string;
  tags?: string[];
  player?: string;
  team?: string;
  year?: string;
}

export interface CardPreviewStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  onSave: () => void;
  onExport: (format: string) => void;
}

export interface CardEffectsStepProps {
  effects: string[];
  onUpdate: (effects: string[]) => void;
}

export interface CardDesignStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

export interface CardUploadStepProps {
  imageUrl: string;
  onImageUpload: (imageUrl: string) => void;
}
