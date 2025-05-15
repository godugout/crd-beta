
// Type definitions for card data
export interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
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
    cardStyle?: {
      template?: string;
      effect?: string;
      borderRadius?: string;
      borderWidth?: number;
      borderColor?: string;
      backgroundColor?: string;
      shadowColor?: string;
      frameWidth?: number;
      frameColor?: string;
    };
    textStyle?: {
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      color?: string;
      titleColor?: string;
      titleAlignment?: string;
      titleWeight?: string;
      descriptionColor?: string;
    };
  };
  [key: string]: any;
}

// Re-export CardData for backwards compatibility
export type { CardData as CardDataType };
