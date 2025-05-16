
// Type definitions for card data
import { MarketMetadata, CardStyle, TextStyle } from '@/lib/types/cardTypes';

export interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string; 
  player?: string;
  team?: string;
  year?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  effects: string[];
  textColor?: string;  // Added for backward compatibility
  designMetadata?: {
    cardStyle?: CardStyle;
    textStyle?: TextStyle;
    cardMetadata?: {
      category?: string;
      series?: string;
      cardType?: string;
    };
    marketMetadata?: MarketMetadata;
  };
  [key: string]: any;
}

// Re-export CardData for backwards compatibility
export type { CardData as CardDataType };
