
/**
 * Card market metadata interface
 */
export interface CardMarketMetadata {
  price?: number;
  currency?: string;
  availableForSale?: boolean;
  editionSize?: number;
  editionNumber?: number;
  isPrintable?: boolean;
  isForSale?: boolean;
  includeInCatalog?: boolean;
}

/**
 * Card metadata interface
 */
export interface CardMetadata {
  category: string;
  series: string;
  cardType: string;
  [key: string]: any;
}

/**
 * Card design metadata interface
 */
export interface CardDesignMetadata {
  cardStyle?: {
    borderColor?: string;
    backgroundColor?: string;
    titleFont?: string;
    bodyFont?: string;
    cornerRadius?: string;
  };
  textStyle?: {
    titleColor?: string;
    titleSize?: string;
    bodyColor?: string;
    bodySize?: string;
  };
  cardMetadata: CardMetadata;
  marketMetadata: CardMarketMetadata;
  effects?: string[];
  player?: string;
  team?: string;
  year?: string;
}

/**
 * Card interface for basic card data
 */
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  player?: string;
  team?: string;
  year?: string;
  designMetadata?: CardDesignMetadata;
  ownerId?: string; 
  collectionId?: string;
}

/**
 * Export other card types to ensure consistency
 */
export * from './cardElements';
