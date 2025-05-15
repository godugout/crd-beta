
import { CardStyle, TextStyle } from '@/components/card-editor/types';

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  cardStyle: CardStyle;
  textStyle: TextStyle;
  backgroundColor: string;
  category: string;
  tags: string[];
}

// Default values for CardStyle to prevent type errors
export const DEFAULT_CARD_STYLE: CardStyle = {
  template: 'classic',
  effect: 'none',
  borderRadius: '8px',
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  shadowColor: 'rgba(0,0,0,0.2)',
  frameWidth: 2,
  frameColor: '#000000',
};

// Default values for TextStyle to prevent type errors
export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#000000',
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333',
};
