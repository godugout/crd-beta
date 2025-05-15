
/**
 * Core Card Interface
 * Defines the structure of a card in the Cardshow application
 */
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  player?: string;
  team?: string;
  year?: string;
  set?: string;
  effects: string[];
  effectSettings?: Record<string, EffectSetting>;
  designMetadata: CardDesignMetadata;
  userId: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  reactions?: CardReactions;
}

/**
 * Effect Setting Interface
 * Configuration options for card effects
 */
export interface EffectSetting {
  intensity?: number;
  speed?: number;
  color?: string;
  colorScheme?: string[];
  pattern?: string;
  animation?: boolean;
  [key: string]: any;
}

/**
 * Card Design Metadata Interface
 * Configuration for the visual appearance of a card
 */
export interface CardDesignMetadata {
  cardStyle?: {
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;
    backgroundColor?: string;
    backgroundGradient?: string;
    shadow?: string;
  };
  textStyle?: {
    titleFont?: string;
    titleSize?: string;
    titleColor?: string;
    descriptionFont?: string;
    descriptionSize?: string;
    descriptionColor?: string;
  };
  cardMetadata?: {
    rarity?: string;
    edition?: string;
    number?: string;
    series?: string;
  };
  marketMetadata?: {
    price?: number;
    currency?: string;
    availableForSale?: boolean;
    editionSize?: number;
    editionNumber?: number;
  };
}

/**
 * Collection Interface
 * Group of cards with additional metadata
 */
export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId: string;
  cards?: Card[];
  cardIds: string[];
  visibility?: 'public' | 'private' | 'unlisted';
  allowComments?: boolean;
  designMetadata?: Record<string, any>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Card Layer Interface
 * For the card editor and creation tool
 */
export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  content?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number | string;
    height: number | string;
  };
  rotation: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  effectIds: string[];
  // Type-specific properties
  textStyle?: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: string;
  };
  imageUrl?: string;
  shapeType?: 'rect' | 'circle' | 'triangle' | 'polygon';
  color?: string;
}

/**
 * Card Reactions Interface
 * User engagement with cards
 */
export interface CardReactions {
  likes: number;
  shares: number;
  comments?: CardComment[];
  favorites: number;
}

/**
 * Card Comment Interface
 * User comments on cards
 */
export interface CardComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replies?: CardComment[];
  reactionCount?: number;
}
