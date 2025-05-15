
export interface CardStyle {
  template: string;
  effect: string;
  borderRadius: string;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  shadowColor: string;
  frameWidth: number;
  frameColor: string;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  titleColor: string;
  titleAlignment: string;
  titleWeight: string;
  descriptionColor: string;
}

export const DEFAULT_CARD_STYLE: CardStyle = {
  template: 'classic',
  effect: 'none',
  borderRadius: '8px',
  borderWidth: 2,
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  shadowColor: 'rgba(0,0,0,0.2)',
  frameWidth: 2,
  frameColor: '#000000',
};

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
