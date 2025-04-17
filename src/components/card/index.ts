
// Import components from the cards directory instead
// This resolves the missing module errors by using components from the cards folder

// Import components from cards directory
import CardBase from '../cards/CardBase';
import { CardImage } from '../cards/CardImage';
import { CardInfoOverlay } from '../cards/CardInfoOverlay';
import CardThumbnail from '../cards/CardThumbnail';
import CardDetailed from '../cards/CardDetailed';
import RelatedCards from '../cards/RelatedCards';

// Import our local components
import { CardFront } from './CardFront';
import CardBack from './CardBack'; // Fixed import

// Export components
export { 
  CardBase, 
  CardImage, 
  CardInfoOverlay,
  CardFront,
  CardBack,
  CardThumbnail,
  CardDetailed,
  RelatedCards
};

// Re-export props types from cards directory
export type { CardBaseProps } from '../cards/CardBase';
export type { CardThumbnailProps } from '../cards/CardThumbnail';
export type { CardDetailedProps } from '../cards/CardDetailed';
