
import { CardStyle, TextStyle } from './cardTypes';

export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  thumbnailUrl?: string; // Added for backward compatibility
  category: string;
  tags?: string[];
  popularity?: number;
  isOfficial?: boolean;
  isPublic?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  designDefaults?: {
    cardStyle: Partial<CardStyle>;
    textStyle?: Partial<TextStyle>;
    effects?: string[];
  };
  cardStyle?: Partial<CardStyle>;
  textStyle?: Partial<TextStyle>;
  layers?: any[];
  effects?: string[];
  backgroundColor?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  count?: number;
}

export interface TemplateSuggestion {
  template: CardTemplate;
  matchScore: number;
  reason: string;
}
