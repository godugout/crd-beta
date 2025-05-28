
export interface Template {
  id: string;
  name: string;
  category: 'baseball' | 'basketball' | 'football' | 'hockey' | 'soccer' | 'custom';
  era: 'vintage' | 'classic' | 'modern' | 'future';
  thumbnail: string;
  layers: TemplateLayer[];
  effects: string[];
  metadata: {
    sport?: string;
    style?: string;
    author?: string;
    tags: string[];
  };
}

export interface TemplateLayer {
  type: 'image' | 'text' | 'shape' | 'border';
  name: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  constraints?: {
    minSize?: { width: number; height: number };
    maxSize?: { width: number; height: number };
    aspectRatio?: number;
    allowRotation?: boolean;
  };
  placeholder?: {
    text?: string;
    image?: string;
  };
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AIRecommendation {
  templateId: string;
  confidence: number;
  reason: string;
  metadata?: {
    detectedSport?: string;
    detectedTeam?: string;
    suggestedColors?: string[];
    suggestedStyle?: string;
  };
}
